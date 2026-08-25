import unittest
import json
import os
import sys

# Ensure project root is in path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

class PortfolioAPITestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()
        
    def test_contact_validation(self):
        # Test missing contact payload
        response = self.client.post('/api/contact', json={})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertFalse(data['success'])
        
    def test_openapi_spec(self):
        # Test that self-documenting OpenAPI endpoints are accessible
        response = self.client.get('/api/openapi.json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['openapi'], '3.0.0')
        self.assertIn('paths', data)

    def test_unauthorized_routes(self):
        # Test that admin routes are secure and block unauthorized users
        routes = [
            ('/api/v1/admin/documents', 'GET'),
            ('/api/v1/admin/projects', 'GET'),
            ('/api/v1/admin/analytics', 'GET')
        ]
        for route, method in routes:
            if method == 'GET':
                response = self.client.get(route)
            else:
                response = self.client.post(route)
            self.assertEqual(response.status_code, 401)
            data = json.loads(response.data)
            self.assertEqual(data['error']['code'], 'UNAUTHORIZED')

if __name__ == '__main__':
    unittest.main()
