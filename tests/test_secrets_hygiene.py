import unittest
import os
import re
import sys
import subprocess

# Ensure project root is in path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app


class SecretsHygieneTestCase(unittest.TestCase):
    def setUp(self):
        self.repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    def get_tracked_files(self):
        """Returns list of all files currently tracked by git."""
        result = subprocess.run(
            ["git", "ls-files"],
            cwd=self.repo_root,
            capture_output=True,
            text=True,
            check=True
        )
        files = [f.strip() for f in result.stdout.splitlines() if f.strip()]
        return [os.path.join(self.repo_root, f) for f in files]

    def test_env_is_gitignored_and_not_tracked(self):
        """Verify .env file is strictly gitignored and not tracked in git."""
        result = subprocess.run(
            ["git", "ls-files", ".env"],
            cwd=self.repo_root,
            capture_output=True,
            text=True,
            check=True
        )
        self.assertEqual(result.stdout.strip(), "", ".env must not be tracked by git!")

        gitignore_path = os.path.join(self.repo_root, ".gitignore")
        self.assertTrue(os.path.exists(gitignore_path))
        with open(gitignore_path, 'r', encoding='utf-8') as f:
            content = f.read()
        self.assertIn('.env', content, ".gitignore must contain .env rule!")

    def test_no_private_keys_in_tracked_files(self):
        """Scan all tracked files for private key headers."""
        private_key_patterns = [
            re.compile(r'-----BEGIN\s+(RSA\s+|EC\s+|DSA\s+|OPENSSH\s+)?PRIVATE\s+KEY-----', re.IGNORECASE),
            re.compile(r'-----BEGIN\s+ENCRYPTED\s+PRIVATE\s+KEY-----', re.IGNORECASE)
        ]

        tracked_files = self.get_tracked_files()
        for file_path in tracked_files:
            if not os.path.isfile(file_path):
                continue
            # Skip binary files
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
            except Exception:
                continue

            for pattern in private_key_patterns:
                match = pattern.search(content)
                self.assertIsNone(
                    match,
                    f"Private key detected in tracked file: {os.path.relpath(file_path, self.repo_root)}"
                )

    def test_no_hardcoded_cloud_tokens_or_api_secrets(self):
        """Scan all tracked files for active leaked secret tokens."""
        # Patterns for high-confidence active secret tokens
        suspicious_patterns = [
            (re.compile(r'ghp_[a-zA-Z0-9]{36}'), "GitHub Personal Access Token"),
            (re.compile(r'github_pat_[a-zA-Z0-9_]{80,}'), "GitHub Fine-Grained Token"),
            (re.compile(r'sk-[a-zA-Z0-9]{32,}'), "OpenAI / Cloud Secret Key"),
            (re.compile(r'xox[baprs]-[0-9]{10,}-[0-9]{10,}-[a-zA-Z0-9]{24,}'), "Slack Token"),
        ]

        tracked_files = self.get_tracked_files()
        for file_path in tracked_files:
            if not os.path.isfile(file_path):
                continue
            rel_path = os.path.relpath(file_path, self.repo_root)

            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
            except Exception:
                continue

            for pattern, desc in suspicious_patterns:
                match = pattern.search(content)
                self.assertIsNone(
                    match,
                    f"{desc} detected in tracked file: {rel_path}"
                )

    def test_no_hardcoded_password_hashes_in_frontend(self):
        """Scan frontend HTML/JS files to ensure no hardcoded credentials or target hashes exist."""
        tracked_files = self.get_tracked_files()
        frontend_files = [
            f for f in tracked_files
            if f.endswith('.html') or f.endswith('.js')
        ]

        prohibited_hash_patterns = [
            re.compile(r'targetPassHash\s*=\s*["\'][a-fA-F0-9]{32,}["\']'),
            re.compile(r'targetUserHash\s*=\s*["\'][a-fA-F0-9]{32,}["\']'),
        ]

        for file_path in frontend_files:
            rel_path = os.path.relpath(file_path, self.repo_root)
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            for pattern in prohibited_hash_patterns:
                match = pattern.search(content)
                self.assertIsNone(
                    match,
                    f"Hardcoded target credential hash found in frontend: {rel_path}"
                )

    def test_flask_secret_key_security(self):
        """Test that Flask secret key is dynamic when FLASK_SECRET is not provided."""
        # Check current secret_key has high entropy (at least 32 bytes / 64 hex chars or random string)
        self.assertTrue(len(app.secret_key) >= 32)
        self.assertNotEqual(app.secret_key, "super-secure-fallback-key-ralk-gupta")


if __name__ == '__main__':
    unittest.main()
