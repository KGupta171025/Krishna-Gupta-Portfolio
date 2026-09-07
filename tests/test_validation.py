import unittest
import json
import os
import sys
import io

# Ensure project root is in path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from rate_limiter import limiter


class InputValidationTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()
        limiter.reset()

    def tearDown(self):
        limiter.reset()

    def test_contact_validation_strict_rejections(self):
        """Test strict type, length, format, and extraneous field rejection on /api/contact."""
        # 1. Missing payload / Non-JSON
        limiter.reset()
        resp = self.client.post('/api/contact', data="plain text", content_type="text/plain")
        self.assertEqual(resp.status_code, 400)
        data = json.loads(resp.data)
        self.assertEqual(data['error']['code'], 'INVALID_REQUEST')

        # 2. Invalid data types (integer passed for name)
        limiter.reset()
        resp = self.client.post('/api/contact', json={
            'name': 12345,
            'email': 'valid@example.com',
            'message': 'This is a valid test message.'
        })
        self.assertEqual(resp.status_code, 400)
        data = json.loads(resp.data)
        self.assertEqual(data['error']['code'], 'VALIDATION_ERROR')
        self.assertEqual(data['error']['details']['issue'], 'INVALID_TYPE')

        # 3. Name length under minimum (< 2 chars)
        limiter.reset()
        resp = self.client.post('/api/contact', json={
            'name': 'A',
            'email': 'valid@example.com',
            'message': 'This is a valid test message.'
        })
        self.assertEqual(resp.status_code, 400)
        data = json.loads(resp.data)
        self.assertEqual(data['error']['details']['issue'], 'MIN_LENGTH_VIOLATION')

        # 4. Name invalid format (containing script tags or numbers)
        limiter.reset()
        resp = self.client.post('/api/contact', json={
            'name': '<script>alert(1)</script>',
            'email': 'valid@example.com',
            'message': 'This is a valid test message.'
        })
        self.assertEqual(resp.status_code, 400)
        data = json.loads(resp.data)
        self.assertEqual(data['error']['details']['issue'], 'INVALID_FORMAT')

        # 5. Invalid email formats (must reject without just sanitizing)
        invalid_emails = ['not-an-email', 'user@', '@domain.com', 'user@domain', 'user name@domain.com']
        for bad_email in invalid_emails:
            limiter.reset()
            resp = self.client.post('/api/contact', json={
                'name': 'Krishna Gupta',
                'email': bad_email,
                'message': 'This is a valid test message.'
            })
            self.assertEqual(resp.status_code, 400)
            data = json.loads(resp.data)
            self.assertEqual(data['error']['details']['field'], 'email')

        # 6. Message length under minimum (< 5 chars)
        limiter.reset()
        resp = self.client.post('/api/contact', json={
            'name': 'Krishna Gupta',
            'email': 'krishna@example.com',
            'message': 'Hi'
        })
        self.assertEqual(resp.status_code, 400)
        data = json.loads(resp.data)
        self.assertEqual(data['error']['details']['issue'], 'MIN_LENGTH_VIOLATION')

        # 7. Unrecognized / extra injected fields (whitelisting)
        limiter.reset()
        resp = self.client.post('/api/contact', json={
            'name': 'Krishna Gupta',
            'email': 'krishna@example.com',
            'message': 'This is a valid test message.',
            'admin_role': True,
            'is_injected': 'yes'
        })
        self.assertEqual(resp.status_code, 400)
        data = json.loads(resp.data)
        self.assertEqual(data['error']['details']['issue'], 'UNRECOGNIZED_FIELDS')

        # 8. Perfectly valid payload
        limiter.reset()
        resp = self.client.post('/api/contact', json={
            'name': 'Krishna Gupta',
            'email': 'krishna@example.com',
            'message': 'This is a valid test inquiry.'
        })
        self.assertEqual(resp.status_code, 200)

    def test_chat_validation_strict_rejections(self):
        """Test chat input schema validations."""
        # 1. Missing message
        resp = self.client.post('/api/chat', json={})
        self.assertEqual(resp.status_code, 400)
        data = json.loads(resp.data)
        self.assertEqual(data['error']['code'], 'VALIDATION_ERROR')

        # 2. Non-string message (list passed)
        resp = self.client.post('/api/chat', json={'message': ['hello', 'world']})
        self.assertEqual(resp.status_code, 400)
        data = json.loads(resp.data)
        self.assertEqual(data['error']['details']['issue'], 'INVALID_TYPE')

        # 3. Message exceeds maximum length (> 500 chars)
        resp = self.client.post('/api/chat', json={'message': 'A' * 501})
        self.assertEqual(resp.status_code, 400)
        data = json.loads(resp.data)
        self.assertEqual(data['error']['details']['issue'], 'MAX_LENGTH_VIOLATION')

        # 4. Valid query
        resp = self.client.post('/api/chat', json={'message': 'Who is Krishna Gupta?'})
        self.assertEqual(resp.status_code, 200)

    def test_admin_login_validation_strict_rejections(self):
        """Test admin login schema validations."""
        # 1. Invalid username characters (spaces or special characters)
        resp = self.client.post('/api/v1/admin/login', json={
            'username': 'admin user with spaces!',
            'password': 'password123'
        })
        self.assertEqual(resp.status_code, 400)
        data = json.loads(resp.data)
        self.assertEqual(data['error']['code'], 'VALIDATION_ERROR')

        # 2. Password under minimum length (< 6 chars)
        resp = self.client.post('/api/v1/admin/login', json={
            'username': 'admin',
            'password': '123'
        })
        self.assertEqual(resp.status_code, 400)
        data = json.loads(resp.data)
        self.assertEqual(data['error']['details']['issue'], 'MIN_LENGTH_VIOLATION')

    def test_admin_documents_query_validation(self):
        """Test strict rejection of invalid pagination query parameters."""
        token = "test-token-val"
        os.environ["API_ACCESS_TOKEN"] = token
        headers = {'Authorization': f'Bearer {token}'}

        # 1. Non-integer page parameter
        resp = self.client.get('/api/v1/admin/documents?page=abc', headers=headers)
        self.assertEqual(resp.status_code, 400)
        data = json.loads(resp.data)
        self.assertEqual(data['error']['code'], 'VALIDATION_ERROR')

        # 2. Page <= 0
        resp = self.client.get('/api/v1/admin/documents?page=0', headers=headers)
        self.assertEqual(resp.status_code, 400)
        data = json.loads(resp.data)
        self.assertEqual(data['error']['details']['issue'], 'MIN_VALUE_VIOLATION')

        # 3. Limit > 100
        resp = self.client.get('/api/v1/admin/documents?limit=101', headers=headers)
        self.assertEqual(resp.status_code, 400)
        data = json.loads(resp.data)
        self.assertEqual(data['error']['details']['issue'], 'MAX_VALUE_VIOLATION')

        # 4. Unknown query parameter
        resp = self.client.get('/api/v1/admin/documents?unknown_filter=true', headers=headers)
        self.assertEqual(resp.status_code, 400)

        # 5. Valid query parameters
        resp = self.client.get('/api/v1/admin/documents?page=1&limit=25', headers=headers)
        self.assertEqual(resp.status_code, 200)

    def test_admin_document_delete_validation(self):
        """Test strict validation of document ID (32-char hex MD5)."""
        token = "test-token-val"
        os.environ["API_ACCESS_TOKEN"] = token
        headers = {'Authorization': f'Bearer {token}'}

        # 1. Non-hex or invalid length ID
        invalid_ids = ['123', 'not-a-hash', 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz', '1234567890abcdef']
        for bad_id in invalid_ids:
            resp = self.client.post('/api/v1/admin/documents/delete', json={'id': bad_id}, headers=headers)
            self.assertEqual(resp.status_code, 400)
            data = json.loads(resp.data)
            self.assertEqual(data['error']['code'], 'VALIDATION_ERROR')

    def test_admin_project_add_validation(self):
        """Test strict validation of GitHub and Live Demo URLs."""
        token = "test-token-val"
        os.environ["API_ACCESS_TOKEN"] = token
        headers = {'Authorization': f'Bearer {token}'}

        # 1. Invalid GitHub link format
        resp = self.client.post('/api/v1/admin/projects/add', json={
            'github_link': 'https://gitlab.com/owner/repo',
            'live_link': 'https://example.com'
        }, headers=headers)
        self.assertEqual(resp.status_code, 400)
        data = json.loads(resp.data)
        self.assertEqual(data['error']['code'], 'VALIDATION_ERROR')

        # 2. Invalid Live Demo link scheme
        resp = self.client.post('/api/v1/admin/projects/add', json={
            'github_link': 'https://github.com/owner/repo',
            'live_link': 'javascript:alert(1)'
        }, headers=headers)
        self.assertEqual(resp.status_code, 400)
        data = json.loads(resp.data)
        self.assertEqual(data['error']['code'], 'VALIDATION_ERROR')

    def test_file_upload_validation(self):
        """Test multipart file upload category and extension validation."""
        token = "test-token-val"
        os.environ["API_ACCESS_TOKEN"] = token
        headers = {'Authorization': f'Bearer {token}'}

        # 1. Invalid category
        data = {
            'category': 'UnauthorizedCategory',
            'file': (io.BytesIO(b"test content"), 'test.pdf')
        }
        resp = self.client.post('/api/v1/admin/documents/upload', data=data, content_type='multipart/form-data', headers=headers)
        self.assertEqual(resp.status_code, 400)
        res_json = json.loads(resp.data)
        self.assertEqual(res_json['error']['code'], 'VALIDATION_ERROR')

        # 2. Disallowed file extension (.exe)
        data = {
            'category': 'Resume',
            'file': (io.BytesIO(b"binary content"), 'malware.exe')
        }
        resp = self.client.post('/api/v1/admin/documents/upload', data=data, content_type='multipart/form-data', headers=headers)
        self.assertEqual(resp.status_code, 400)
        res_json = json.loads(resp.data)
        self.assertEqual(res_json['error']['details']['issue'], 'DISALLOWED_FILE_TYPE')


if __name__ == '__main__':
    unittest.main()
