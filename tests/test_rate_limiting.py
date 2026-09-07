import unittest
import json
import os
import sys
import time

# Ensure project root is in path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from rate_limiter import limiter, RateLimitConfig, RateLimiter


class RateLimitingTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()
        # Reset rate limiter in-memory storage before each test
        limiter.reset()

    def tearDown(self):
        limiter.reset()

    def test_public_contact_rate_limiting(self):
        """Test public contact endpoint rate limiting and 429 response headers."""
        limit = limiter.config.public_contact_limit
        
        # Send valid requests up to the limit
        for i in range(limit):
            response = self.client.post('/api/contact', json={
                'name': f'Tester {i}',
                'email': 'tester@example.com',
                'message': 'Hello test'
            }, environ_base={'REMOTE_ADDR': '192.168.1.10'})
            self.assertEqual(response.status_code, 200)
            self.assertIn('X-RateLimit-Limit', response.headers)
            self.assertIn('X-RateLimit-Remaining', response.headers)

        # The next request should be rate-limited (HTTP 429)
        blocked_response = self.client.post('/api/contact', json={
            'name': 'Tester Blocked',
            'email': 'tester@example.com',
            'message': 'Hello test'
        }, environ_base={'REMOTE_ADDR': '192.168.1.10'})
        
        self.assertEqual(blocked_response.status_code, 429)
        self.assertIn('Retry-After', blocked_response.headers)
        data = json.loads(blocked_response.data)
        self.assertFalse(data['success'])
        self.assertEqual(data['error']['code'], 'RATE_LIMIT_EXCEEDED')
        self.assertIn('retry_after', data['error'])

    def test_public_chat_rate_limiting(self):
        """Test public chat endpoint rate limiting."""
        limit = limiter.config.public_chat_limit
        
        for i in range(limit):
            response = self.client.post('/api/chat', json={
                'message': f'Who is Krishna Gupta {i}?'
            }, environ_base={'REMOTE_ADDR': '192.168.1.20'})
            self.assertEqual(response.status_code, 200)

        # Exceed limit
        blocked = self.client.post('/api/chat', json={
            'message': 'Who is Krishna Gupta?'
        }, environ_base={'REMOTE_ADDR': '192.168.1.20'})
        self.assertEqual(blocked.status_code, 429)

    def test_authenticated_looser_limits(self):
        """Test authenticated requests have higher throughput than public endpoints."""
        token = "test-token-rate-limit"
        os.environ["API_ACCESS_TOKEN"] = token
        
        # Make 20 authenticated requests (which is higher than public contact limit of 5)
        for i in range(20):
            response = self.client.get(
                '/api/v1/admin/analytics',
                headers={'Authorization': f'Bearer {token}'},
                environ_base={'REMOTE_ADDR': '192.168.1.30'}
            )
            self.assertEqual(response.status_code, 200)
            self.assertIn('X-RateLimit-Limit', response.headers)
            self.assertEqual(int(response.headers['X-RateLimit-Limit']), limiter.config.authenticated_limit)

    def test_auth_route_exponential_backoff_on_failed_logins(self):
        """Test authentication routes enforce exponential backoff rather than hard lockout."""
        os.environ["ADMIN_USERNAME_HASH"] = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        os.environ["ADMIN_PASSWORD_HASH"] = "$argon2id$v=19$m=65536,t=3,p=4$dummy$dummy"

        client_ip = '192.168.1.40'
        username = 'admin_target'

        # Failed attempt 1 & 2 (below threshold of 3)
        for _ in range(2):
            resp = self.client.post('/api/v1/admin/login', json={
                'username': username,
                'password': 'wrong_password'
            }, environ_base={'REMOTE_ADDR': client_ip})
            self.assertEqual(resp.status_code, 401)

        # Failed attempt 3 -> triggers backoff (base backoff = 2s)
        resp3 = self.client.post('/api/v1/admin/login', json={
            'username': username,
            'password': 'wrong_password'
        }, environ_base={'REMOTE_ADDR': client_ip})
        self.assertEqual(resp3.status_code, 401)

        # Immediate next attempt should be blocked by backoff with 429
        blocked_resp = self.client.post('/api/v1/admin/login', json={
            'username': username,
            'password': 'wrong_password'
        }, environ_base={'REMOTE_ADDR': client_ip})
        self.assertEqual(blocked_resp.status_code, 429)
        self.assertIn('Retry-After', blocked_resp.headers)
        data = json.loads(blocked_resp.data)
        self.assertIn('temporarily throttled', data['error']['message'])

    def test_auth_route_resets_on_successful_login(self):
        """Test successful authentication clears failed login counters."""
        import hashlib
        from argon2 import PasswordHasher

        ph = PasswordHasher()
        test_pass = "SuperSecret123!"
        hashed_pass = ph.hash(test_pass)
        test_user = "krishna_admin"
        hashed_user = hashlib.sha256(test_user.encode('utf-8')).hexdigest()

        os.environ["ADMIN_USERNAME_HASH"] = hashed_user
        os.environ["ADMIN_PASSWORD_HASH"] = hashed_pass

        client_ip = '192.168.1.50'

        # Register 1 failure
        self.client.post('/api/v1/admin/login', json={
            'username': test_user,
            'password': 'wrong_password'
        }, environ_base={'REMOTE_ADDR': client_ip})

        # Successful login
        success_resp = self.client.post('/api/v1/admin/login', json={
            'username': test_user,
            'password': test_pass
        }, environ_base={'REMOTE_ADDR': client_ip})
        self.assertEqual(success_resp.status_code, 200)

        # Verify backoff tracker is cleared
        normalized_account = test_user.lower()
        self.assertNotIn(normalized_account, limiter.account_backoff)
        self.assertNotIn(client_ip, limiter.ip_backoff)

    def test_configurability_via_env(self):
        """Test rate limiter loads values dynamically from environment variables."""
        os.environ["RATE_LIMIT_PUBLIC_CONTACT_LIMIT"] = "7"
        os.environ["RATE_LIMIT_AUTH_BASE_BACKOFF"] = "3.5"

        cfg = RateLimitConfig()
        self.assertEqual(cfg.public_contact_limit, 7)
        self.assertEqual(cfg.auth_base_backoff, 3.5)

        # Clean up
        os.environ.pop("RATE_LIMIT_PUBLIC_CONTACT_LIMIT", None)
        os.environ.pop("RATE_LIMIT_AUTH_BASE_BACKOFF", None)


if __name__ == '__main__':
    unittest.main()
