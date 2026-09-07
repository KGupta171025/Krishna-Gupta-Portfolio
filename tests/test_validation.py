import unittest
import io
from werkzeug.datastructures import FileStorage
from validators import validate_file_upload, ValidationError
from app import app

class TestFileUploadSecurity(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_valid_pdf_upload(self):
        content = b"%PDF-1.4 test pdf file content"
        file_obj = FileStorage(stream=io.BytesIO(content), filename="resume.pdf")
        filename, category = validate_file_upload(file_obj, "Resume")
        self.assertEqual(filename, "resume.pdf")
        self.assertEqual(category, "Resume")

    def test_valid_png_upload(self):
        png_header = bytes([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
        content = png_header + b"\x00\x00\x00\rIHDRimage_data"
        file_obj = FileStorage(stream=io.BytesIO(content), filename="photo.png")
        filename, category = validate_file_upload(file_obj, "Certificate")
        self.assertEqual(filename, "photo.png")
        self.assertEqual(category, "Certificate")

    def test_valid_parquet_upload(self):
        content = b"PAR1test_parquet_contentPAR1"
        file_obj = FileStorage(stream=io.BytesIO(content), filename="catalog.parquet")
        filename, category = validate_file_upload(file_obj, "Other")
        self.assertEqual(filename, "catalog.parquet")

    def test_spoofed_extension_magic_byte_mismatch(self):
        # File named .pdf but contains random text
        content = b"This is just plain text masquerading as a PDF."
        file_obj = FileStorage(stream=io.BytesIO(content), filename="fake.pdf")
        with self.assertRaises(ValidationError) as ctx:
            validate_file_upload(file_obj, "Resume")
        self.assertEqual(ctx.exception.error_type, "INVALID_FILE_SIGNATURE")

    def test_dangerous_executable_magic_header(self):
        # File named .png but starts with PE header bytes dynamically constructed
        exe_magic = bytes([0x4D, 0x5A]) + b"\x00" * 20
        file_obj = FileStorage(stream=io.BytesIO(exe_magic), filename="sample.png")
        with self.assertRaises(ValidationError) as ctx:
            validate_file_upload(file_obj, "Certificate")
        self.assertEqual(ctx.exception.error_type, "DANGEROUS_FILE_CONTENT")

    def test_dangerous_php_script_magic_header(self):
        # File named .pdf but contains PHP script header dynamically constructed
        php_tag = bytes([0x3C, 0x3F, 0x70, 0x68, 0x70]) + b" echo 1; ?>"
        file_obj = FileStorage(stream=io.BytesIO(php_tag), filename="script.pdf")
        with self.assertRaises(ValidationError) as ctx:
            validate_file_upload(file_obj, "Resume")
        self.assertEqual(ctx.exception.error_type, "DANGEROUS_FILE_CONTENT")

    def test_double_extension_blocked(self):
        # Double extension attacks like .php.pdf or .exe.png
        content = b"%PDF-1.4 sample content"
        file_obj = FileStorage(stream=io.BytesIO(content), filename="exploit.php.pdf")
        with self.assertRaises(ValidationError) as ctx:
            validate_file_upload(file_obj, "Resume")
        self.assertEqual(ctx.exception.error_type, "DOUBLE_EXTENSION_DETECTED")

    def test_empty_file_blocked(self):
        content = b""
        file_obj = FileStorage(stream=io.BytesIO(content), filename="empty.pdf")
        with self.assertRaises(ValidationError) as ctx:
            validate_file_upload(file_obj, "Resume")
        self.assertIn(ctx.exception.error_type, ["INVALID_FILE_SIGNATURE", "EMPTY_FILE"])

    def test_null_bytes_in_text_upload_blocked(self):
        content = b"Some normal text\x00embedded binary null byte"
        file_obj = FileStorage(stream=io.BytesIO(content), filename="notes.txt")
        with self.assertRaises(ValidationError) as ctx:
            validate_file_upload(file_obj, "Other")
        self.assertEqual(ctx.exception.error_type, "INVALID_TEXT_FILE")

    def test_download_security_headers_disallowed(self):
        response = self.client.get('/download/invalid_file.exe')
        self.assertEqual(response.status_code, 403)

if __name__ == '__main__':
    unittest.main()
