import unittest
import json
import os
import sys
import logging
from unittest.mock import patch

# Ensure project root is in path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from rate_limiter import limiter


class ErrorHandlingTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()
        limiter.reset()

    def tearDown(self):
        limiter.reset()

    def test_500_internal_error_masks_traceback_and_paths(self):
        """Verify that server-side runtime exceptions return a generic message and mask stack traces/paths."""
        token = "test-token-err"
        os.environ["API_ACCESS_TOKEN"] = token
        headers = {'Authorization': f'Bearer {token}'}

        # Simulate unexpected backend exception (e.g. database failure in admin_list_documents)
        with patch('app.get_cached_catalog', side_effect=RuntimeError("CRITICAL: Database connection failed at D:\\Code_Files\\Projects\\Profile\\secret_db.parquet")):
            response = self.client.get('/api/v1/admin/documents', headers=headers)
            self.assertEqual(response.status_code, 500)
            
            data = json.loads(response.data)
            self.assertFalse(data['success'])
            self.assertEqual(data['error']['code'], 'INTERNAL_ERROR')
            self.assertIn('error_id', data['error'])
            self.assertTrue(len(data['error']['error_id']) > 0)
            
            # Message must be generic
            self.assertNotIn("Database connection failed", data['error']['message'])
            self.assertNotIn("secret_db.parquet", data['error']['message'])
            self.assertNotIn("D:\\Code_Files", data['error']['message'])
            self.assertNotIn("RuntimeError", data['error']['message'])

            # Raw response text must not contain traceback signatures
            raw_text = response.data.decode('utf-8')
            self.assertNotIn("Traceback (most recent call last)", raw_text)
            self.assertNotIn('File "', raw_text)

    def test_404_not_found_returns_clean_json_on_api(self):
        """Verify non-existent API routes return clean JSON error without path disclosure."""
        response = self.client.get('/api/non_existent_endpoint_12345')
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data)
        self.assertFalse(data['success'])
        self.assertEqual(data['error']['code'], 'NOT_FOUND')
        
        raw_text = response.data.decode('utf-8')
        self.assertNotIn("Traceback", raw_text)
        self.assertNotIn("D:\\", raw_text)
        self.assertNotIn("C:\\", raw_text)

    def test_405_method_not_allowed_clean_error(self):
        """Verify method not allowed on API endpoints returns standard clean JSON error."""
        response = self.client.put('/api/contact', json={'name': 'Krishna Gupta'})
        self.assertEqual(response.status_code, 405)
        data = json.loads(response.data)
        self.assertFalse(data['success'])
        self.assertEqual(data['error']['code'], 'METHOD_NOT_ALLOWED')

    def test_download_endpoint_suppresses_internal_paths(self):
        """Verify /download endpoint never exposes internal server filesystem paths on invalid/missing files."""
        # Missing file
        response = self.client.get('/download/non_existent_file.pdf')
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data)
        self.assertEqual(data['error']['code'], 'RESOURCE_NOT_FOUND')
        self.assertNotIn("D:\\", data['error']['message'])
        self.assertNotIn("C:\\", data['error']['message'])
        self.assertNotIn("static\\assets", data['error']['message'])

        # Path traversal attempt
        response2 = self.client.get('/download/../../etc/passwd')
        self.assertEqual(response2.status_code, 400)
        data2 = json.loads(response2.data)
        self.assertEqual(data2['error']['code'], 'VALIDATION_ERROR')
        self.assertNotIn("D:\\", data2['error']['message'])

    def test_server_side_logging_captures_traceback(self):
        """Verify that server-side logger captures full traceback while client receives generic message."""
        token = "test-token-err"
        os.environ["API_ACCESS_TOKEN"] = token
        headers = {'Authorization': f'Bearer {token}'}

        with self.assertLogs('portfolio_app', level='ERROR') as log_capture:
            with patch('app.get_cached_catalog', side_effect=ValueError('Simulated critical internal failure')):
                response = self.client.get('/api/v1/admin/documents', headers=headers)
                self.assertEqual(response.status_code, 500)
                
                # Check that the server log recorded the exception and stack trace
                log_output = "\n".join(log_capture.output)
                self.assertIn("Simulated critical internal failure", log_output)
                self.assertIn("ValueError", log_output)
                
                # Verify the client response does NOT contain the exception string
                data = json.loads(response.data)
                self.assertNotIn("Simulated critical internal failure", data['error']['message'])
                self.assertIn('error_id', data['error'])


if __name__ == '__main__':
    unittest.main()

