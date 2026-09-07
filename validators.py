import re
import functools
from flask import request, jsonify


# Strict format regular expressions
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
NAME_REGEX = re.compile(r"^[a-zA-Z\s.'-]+$")
USERNAME_REGEX = re.compile(r'^[a-zA-Z0-9_.-]+$')
HEX_MD5_REGEX = re.compile(r'^[a-fA-F0-9]{32}$')
GITHUB_URL_REGEX = re.compile(r'^https://github\.com/([a-zA-Z0-9_-]+)/([a-zA-Z0-9_.-]+)/?$')
LIVE_URL_REGEX = re.compile(r'^https?://[a-zA-Z0-9_.-]+(?::\d+)?(?:/[a-zA-Z0-9_.-]*)*\/?$')
SAFE_TITLE_REGEX = re.compile(r"^[a-zA-Z0-9\s._\-():'+/]+$")


class ValidationError(Exception):
    """Custom exception raised when an input fails schema validation."""
    def __init__(self, field, error_type, message):
        super().__init__(message)
        self.field = field
        self.error_type = error_type
        self.message = message


class Field:
    """Base schema field descriptor."""
    def __init__(self, required=True, default=None):
        self.required = required
        self.default = default

    def validate(self, value, field_name):
        return value


class StringField(Field):
    """Validates string inputs with length, regex, and enum constraints."""
    def __init__(self, min_len=1, max_len=None, pattern=None, pattern_name=None, allowed_values=None, trim=True, required=True, default=None):
        super().__init__(required=required, default=default)
        self.min_len = min_len
        self.max_len = max_len
        self.pattern = pattern
        self.pattern_name = pattern_name
        self.allowed_values = set(allowed_values) if allowed_values is not None else None
        self.trim = trim

    def validate(self, value, field_name):
        if not isinstance(value, str):
            raise ValidationError(field_name, "INVALID_TYPE", f"Field '{field_name}' must be a string, got {type(value).__name__}.")

        val = value.strip() if self.trim else value

        if self.min_len is not None and len(val) < self.min_len:
            raise ValidationError(field_name, "MIN_LENGTH_VIOLATION", f"Field '{field_name}' must be at least {self.min_len} characters long.")

        if self.max_len is not None and len(val) > self.max_len:
            raise ValidationError(field_name, "MAX_LENGTH_VIOLATION", f"Field '{field_name}' cannot exceed {self.max_len} characters.")

        if self.allowed_values is not None and val not in self.allowed_values:
            allowed_str = ", ".join(sorted(self.allowed_values))
            raise ValidationError(field_name, "INVALID_ENUM_VALUE", f"Field '{field_name}' must be one of: {allowed_str}.")

        if self.pattern is not None and not self.pattern.match(val):
            desc = f" ({self.pattern_name})" if self.pattern_name else ""
            raise ValidationError(field_name, "INVALID_FORMAT", f"Field '{field_name}' has an invalid format{desc}.")

        return val


class EmailField(StringField):
    """Validates strict RFC 5322 compliant email strings."""
    def __init__(self, min_len=5, max_len=100, required=True, default=None):
        super().__init__(
            min_len=min_len,
            max_len=max_len,
            pattern=EMAIL_REGEX,
            pattern_name="valid email format (e.g., user@example.com)",
            trim=True,
            required=required,
            default=default
        )


class UrlField(StringField):
    """Validates HTTP/HTTPS URL strings."""
    def __init__(self, min_len=10, max_len=500, pattern=None, pattern_name=None, required=True, default=None):
        super().__init__(
            min_len=min_len,
            max_len=max_len,
            pattern=pattern or LIVE_URL_REGEX,
            pattern_name=pattern_name or "valid HTTP/HTTPS URL",
            trim=True,
            required=required,
            default=default
        )


class IntegerField(Field):
    """Validates integer inputs, optionally coercing string representations."""
    def __init__(self, min_val=None, max_val=None, coerce_str=False, required=True, default=None):
        super().__init__(required=required, default=default)
        self.min_val = min_val
        self.max_val = max_val
        self.coerce_str = coerce_str

    def validate(self, value, field_name):
        if self.coerce_str and isinstance(value, str):
            if not value.strip().lstrip('-').isdigit():
                raise ValidationError(field_name, "INVALID_TYPE", f"Field '{field_name}' must be an integer, got non-numeric string '{value}'.")
            try:
                val = int(value.strip())
            except ValueError:
                raise ValidationError(field_name, "INVALID_TYPE", f"Field '{field_name}' must be a valid integer.")
        elif isinstance(value, bool):  # Python bool is subclass of int, so reject explicitly
            raise ValidationError(field_name, "INVALID_TYPE", f"Field '{field_name}' must be an integer, got boolean.")
        elif isinstance(value, int):
            val = value
        else:
            raise ValidationError(field_name, "INVALID_TYPE", f"Field '{field_name}' must be an integer, got {type(value).__name__}.")

        if self.min_val is not None and val < self.min_val:
            raise ValidationError(field_name, "MIN_VALUE_VIOLATION", f"Field '{field_name}' must be at least {self.min_val}.")

        if self.max_val is not None and val > self.max_val:
            raise ValidationError(field_name, "MAX_VALUE_VIOLATION", f"Field '{field_name}' cannot exceed {self.max_val}.")

        return val


class HexHashField(StringField):
    """Validates fixed-length hexadecimal hash identifiers."""
    def __init__(self, length=32, required=True, default=None):
        super().__init__(
            min_len=length,
            max_len=length,
            pattern=HEX_MD5_REGEX,
            pattern_name=f"{length}-character hexadecimal hash",
            trim=True,
            required=required,
            default=default
        )


def validate_payload(data, schema, allow_unknown=False):
    """
    Strictly validates a dictionary payload against a schema.
    Rejects unknown fields, missing required fields, and rule violations.
    Returns cleaned dictionary of validated values.
    """
    if not isinstance(data, dict):
        raise ValidationError("body", "INVALID_PAYLOAD", "Request body must be a JSON object.")

    if not allow_unknown:
        unknown_keys = set(data.keys()) - set(schema.keys())
        if unknown_keys:
            unrec = ", ".join(sorted(unknown_keys))
            raise ValidationError("body", "UNRECOGNIZED_FIELDS", f"Unrecognized fields not allowed: {unrec}.")

    validated = {}
    for field_name, field_def in schema.items():
        if field_name not in data or data[field_name] is None:
            if field_def.required:
                raise ValidationError(field_name, "FIELD_REQUIRED", f"Field '{field_name}' is required.")
            validated[field_name] = field_def.default
        else:
            validated[field_name] = field_def.validate(data[field_name], field_name)

    return validated


def validate_query_params(args, schema, allow_unknown=False):
    """
    Strictly validates request query parameters against a schema.
    Returns cleaned dictionary with converted values.
    """
    args_dict = args.to_dict()

    if not allow_unknown:
        unknown_keys = set(args_dict.keys()) - set(schema.keys())
        if unknown_keys:
            unrec = ", ".join(sorted(unknown_keys))
            raise ValidationError("query", "UNRECOGNIZED_PARAMETERS", f"Unrecognized query parameters not allowed: {unrec}.")

    validated = {}
    for field_name, field_def in schema.items():
        if field_name not in args_dict or args_dict[field_name] is None or args_dict[field_name] == '':
            if field_def.required:
                raise ValidationError(field_name, "PARAMETER_REQUIRED", f"Query parameter '{field_name}' is required.")
            validated[field_name] = field_def.default
        else:
            validated[field_name] = field_def.validate(args_dict[field_name], field_name)

    return validated


# --- ENDPOINT SCHEMAS ---

CONTACT_SCHEMA = {
    'name': StringField(min_len=2, max_len=100, pattern=NAME_REGEX, pattern_name="letters, spaces, and hyphens only", required=True),
    'email': EmailField(min_len=5, max_len=100, required=True),
    'message': StringField(min_len=5, max_len=5000, required=True)
}

CHAT_SCHEMA = {
    'message': StringField(min_len=1, max_len=500, required=True)
}

ADMIN_LOGIN_SCHEMA = {
    'username': StringField(min_len=3, max_len=50, pattern=USERNAME_REGEX, pattern_name="alphanumeric, underscore, hyphen, or dot", required=True),
    'password': StringField(min_len=6, max_len=128, trim=False, required=True)
}

ADMIN_DOCS_QUERY_SCHEMA = {
    'page': IntegerField(min_val=1, max_val=100000, coerce_str=True, required=False, default=1),
    'limit': IntegerField(min_val=1, max_val=100, coerce_str=True, required=False, default=50)
}

ADMIN_DOC_DELETE_SCHEMA = {
    'id': HexHashField(length=32, required=True)
}

ADMIN_PROJECT_ADD_SCHEMA = {
    'github_link': UrlField(min_len=15, max_len=200, pattern=GITHUB_URL_REGEX, pattern_name="GitHub repository URL ('https://github.com/owner/repo')", required=True),
    'live_link': UrlField(min_len=10, max_len=500, pattern=LIVE_URL_REGEX, pattern_name="valid HTTP/HTTPS URL", required=True)
}

ADMIN_PROJECT_DELETE_SCHEMA = {
    'name': StringField(min_len=1, max_len=100, pattern=SAFE_TITLE_REGEX, pattern_name="safe project title characters", required=True)
}

ADMIN_PROJECT_UPDATE_SCHEMA = {
    'name': StringField(min_len=1, max_len=100, pattern=SAFE_TITLE_REGEX, pattern_name="safe project title characters", required=True),
    'github_link': UrlField(min_len=15, max_len=200, pattern=GITHUB_URL_REGEX, pattern_name="GitHub repository URL ('https://github.com/owner/repo')", required=True),
    'live_link': UrlField(min_len=10, max_len=500, pattern=LIVE_URL_REGEX, pattern_name="valid HTTP/HTTPS URL", required=True)
}


# Allowed upload file extensions and categories
ALLOWED_UPLOAD_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx', 'txt', 'csv', 'parquet', 'zip'}
ALLOWED_UPLOAD_CATEGORIES = {'Resume', 'Certificate', 'Other'}
MAX_UPLOAD_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB max limit

# Dangerous executable extensions to block in double-extension attacks
DANGEROUS_INTERNAL_EXTENSIONS = {
    'php', 'php3', 'php4', 'php5', 'phtml', 'phar', 'exe', 'dll', 'so', 'dylib',
    'sh', 'bash', 'zsh', 'bat', 'cmd', 'ps1', 'vbs', 'js', 'jsp', 'cgi', 'py', 'pl', 'rb', 'svg', 'html', 'htm'
}

# Magic byte signatures for authorized file types
MAGIC_SIGNATURES = {
    'pdf': [b'%PDF-'],
    'png': [b'\x89PNG\r\n\x1a\n'],
    'jpg': [b'\xff\xd8\xff'],
    'jpeg': [b'\xff\xd8\xff'],
    'zip': [b'PK\x03\x04'],
    'docx': [b'PK\x03\x04'],
    'parquet': [b'PAR1'],
    'doc': [b'\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1'],  # OLE Compound File
}

# Dangerous executable / script binary headers
DANGEROUS_MAGIC_HEADERS = [
    b'MZ',                   # Windows PE executable / DLL
    b'\x7fELF',              # Linux ELF binary
    b'\xca\xfe\xba\xbe',      # Java class file / Mach-O universal binary
    b'<?php',                # PHP script
    b'<?',                   # Short tag PHP / XML script
    b'#!/bin',               # Unix shell script
    b'#!/usr/bin',           # Script shebang
    b'<script',              # Inline JavaScript
    b'<!DOCTYPE html',       # HTML document masquerading as image/doc
    b'<html',                # HTML tag
]


def validate_file_upload(file_obj, category_str):
    """
    Strictly validates uploaded multipart files, category strings, size,
    double extensions, and deep binary content magic-bytes.
    """
    if not category_str or category_str not in ALLOWED_UPLOAD_CATEGORIES:
        allowed = ", ".join(sorted(ALLOWED_UPLOAD_CATEGORIES))
        raise ValidationError("category", "INVALID_ENUM_VALUE", f"Upload category must be one of: {allowed}.")

    if file_obj is None or file_obj.filename == '':
        raise ValidationError("file", "FILE_REQUIRED", "No file selected for upload.")

    filename = file_obj.filename
    if len(filename) > 255:
        raise ValidationError("file", "MAX_LENGTH_VIOLATION", "Filename cannot exceed 255 characters.")

    if '.' not in filename:
        raise ValidationError("file", "INVALID_EXTENSION", "Uploaded file must have a valid file extension.")

    # Check for dangerous double extensions (e.g. payload.php.pdf, exploit.exe.png)
    parts = filename.lower().split('.')
    if len(parts) > 2:
        for mid_ext in parts[1:-1]:
            if mid_ext in DANGEROUS_INTERNAL_EXTENSIONS:
                raise ValidationError("file", "DOUBLE_EXTENSION_DETECTED", f"Dangerous nested extension '.{mid_ext}' detected in filename.")

    ext = parts[-1]
    if ext not in ALLOWED_UPLOAD_EXTENSIONS:
        allowed_exts = ", ".join(sorted(ALLOWED_UPLOAD_EXTENSIONS))
        raise ValidationError("file", "DISALLOWED_FILE_TYPE", f"File extension '.{ext}' is not allowed. Supported extensions: {allowed_exts}.")

    # Binary Content & Magic Byte Inspection
    stream = file_obj.stream if hasattr(file_obj, 'stream') else file_obj

    try:
        header = stream.read(1024)

        # Check against dangerous binary executable/script headers
        for bad_header in DANGEROUS_MAGIC_HEADERS:
            if header.lower().startswith(bad_header.lower()) or bad_header.lower() in header[:128].lower():
                raise ValidationError("file", "DANGEROUS_FILE_CONTENT", "Uploaded file contains executable or script signatures.")

        # Check positive magic signature if defined for extension
        if ext in MAGIC_SIGNATURES:
            signatures = MAGIC_SIGNATURES[ext]
            matched = any(header.startswith(sig) for sig in signatures)
            if not matched:
                raise ValidationError("file", "INVALID_FILE_SIGNATURE", f"File content does not match genuine '.{ext}' signature.")

        # For text / csv files, verify valid text encoding and no null bytes
        elif ext in {'txt', 'csv'}:
            if b'\x00' in header:
                raise ValidationError("file", "INVALID_TEXT_FILE", "Binary null bytes detected in text/csv upload.")

        # Check file length
        stream.seek(0, 2)  # seek to end
        file_size = stream.tell()
        stream.seek(0)  # reset stream cursor

        if file_size > MAX_UPLOAD_SIZE_BYTES:
            max_mb = MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)
            raise ValidationError("file", "FILE_SIZE_EXCEEDED", f"Uploaded file exceeds the maximum allowed size of {max_mb} MB.")

        if file_size == 0:
            raise ValidationError("file", "EMPTY_FILE", "Uploaded file cannot be empty (0 bytes).")

    except ValidationError:
        stream.seek(0)
        raise
    except Exception as err:
        stream.seek(0)
        raise ValidationError("file", "UNREADABLE_FILE", f"Unable to verify file stream: {str(err)}")

    return filename, category_str


# --- FLASK ROUTE DECORATORS ---

def validate_json_schema(schema, allow_unknown=False):
    """
    Decorator that strictly validates JSON request bodies against a schema.
    Returns HTTP 400 VALIDATION_ERROR on any failure.
    """
    def decorator(f):
        @functools.wraps(f)
        def wrapped(*args, **kwargs):
            if not request.is_json:
                return jsonify({
                    'success': False,
                    'error': {
                        'code': 'INVALID_REQUEST',
                        'message': 'Request Content-Type must be application/json.'
                    }
                }), 400

            data = request.get_json(silent=True)
            if data is None:
                return jsonify({
                    'success': False,
                    'error': {
                        'code': 'INVALID_REQUEST',
                        'message': 'Invalid JSON format in request body.'
                    }
                }), 400

            try:
                validated_data = validate_payload(data, schema, allow_unknown=allow_unknown)
                request.validated_data = validated_data
            except ValidationError as e:
                return jsonify({
                    'success': False,
                    'error': {
                        'code': 'VALIDATION_ERROR',
                        'message': e.message,
                        'details': {
                            'field': e.field,
                            'issue': e.error_type
                        }
                    }
                }), 400

            return f(*args, **kwargs)
        return wrapped
    return decorator


def validate_query_schema(schema, allow_unknown=False):
    """
    Decorator that strictly validates query parameters against a schema.
    Returns HTTP 400 VALIDATION_ERROR on any failure.
    """
    def decorator(f):
        @functools.wraps(f)
        def wrapped(*args, **kwargs):
            try:
                validated_args = validate_query_params(request.args, schema, allow_unknown=allow_unknown)
                request.validated_args = validated_args
            except ValidationError as e:
                return jsonify({
                    'success': False,
                    'error': {
                        'code': 'VALIDATION_ERROR',
                        'message': e.message,
                        'details': {
                            'parameter': e.field,
                            'issue': e.error_type
                        }
                    }
                }), 400

            return f(*args, **kwargs)
        return wrapped
    return decorator
