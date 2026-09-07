import os
import time
import threading
import functools
from collections import defaultdict
from flask import request, jsonify, session, make_response


class RateLimitConfig:
    """Configurable rate limiting parameters loaded from environment or defaults."""

    @classmethod
    def get_int(cls, key, default):
        try:
            return int(os.environ.get(key, default))
        except (ValueError, TypeError):
            return default

    @classmethod
    def get_float(cls, key, default):
        try:
            return float(os.environ.get(key, default))
        except (ValueError, TypeError):
            return default

    @property
    def auth_ip_limit(self):
        return self.get_int("RATE_LIMIT_AUTH_IP_LIMIT", 5)

    @property
    def auth_ip_window(self):
        return self.get_int("RATE_LIMIT_AUTH_IP_WINDOW", 60)

    @property
    def auth_max_attempts(self):
        return self.get_int("RATE_LIMIT_AUTH_MAX_ATTEMPTS", 3)

    @property
    def auth_base_backoff(self):
        return self.get_float("RATE_LIMIT_AUTH_BASE_BACKOFF", 2.0)

    @property
    def auth_backoff_factor(self):
        return self.get_float("RATE_LIMIT_AUTH_BACKOFF_FACTOR", 2.0)

    @property
    def auth_max_backoff(self):
        return self.get_float("RATE_LIMIT_AUTH_MAX_BACKOFF", 900.0)

    @property
    def auth_account_window(self):
        return self.get_int("RATE_LIMIT_AUTH_ACCOUNT_WINDOW", 900)

    @property
    def public_contact_limit(self):
        return self.get_int("RATE_LIMIT_PUBLIC_CONTACT_LIMIT", 5)

    @property
    def public_contact_window(self):
        return self.get_int("RATE_LIMIT_PUBLIC_CONTACT_WINDOW", 60)

    @property
    def public_chat_limit(self):
        return self.get_int("RATE_LIMIT_PUBLIC_CHAT_LIMIT", 15)

    @property
    def public_chat_window(self):
        return self.get_int("RATE_LIMIT_PUBLIC_CHAT_WINDOW", 60)

    @property
    def public_download_limit(self):
        return self.get_int("RATE_LIMIT_PUBLIC_DOWNLOAD_LIMIT", 30)

    @property
    def public_download_window(self):
        return self.get_int("RATE_LIMIT_PUBLIC_DOWNLOAD_WINDOW", 60)

    @property
    def public_general_limit(self):
        return self.get_int("RATE_LIMIT_PUBLIC_GENERAL_LIMIT", 60)

    @property
    def public_general_window(self):
        return self.get_int("RATE_LIMIT_PUBLIC_GENERAL_WINDOW", 60)

    @property
    def authenticated_limit(self):
        return self.get_int("RATE_LIMIT_AUTHENTICATED_LIMIT", 120)

    @property
    def authenticated_window(self):
        return self.get_int("RATE_LIMIT_AUTHENTICATED_WINDOW", 60)


class RateLimiter:
    """Thread-safe rate limiter supporting sliding windows, exponential backoff, and dual-key tracking."""

    def __init__(self, config=None):
        self.config = config or RateLimitConfig()
        self.lock = threading.RLock()
        self.ip_sliding_windows = defaultdict(list)
        self.account_backoff = {}
        self.ip_backoff = {}
        self.last_cleanup = time.time()

    def reset(self):
        """Clears all tracking history (primarily for unit testing)."""
        with self.lock:
            self.ip_sliding_windows.clear()
            self.account_backoff.clear()
            self.ip_backoff.clear()
            self.last_cleanup = time.time()

    @staticmethod
    def get_client_ip():
        """Extract client IP from request headers or remote address safely."""
        client_ip = request.headers.get('X-Forwarded-For', request.remote_addr or '127.0.0.1')
        if client_ip and ',' in client_ip:
            client_ip = client_ip.split(',')[0].strip()
        return client_ip or '127.0.0.1'

    def _cleanup_unlocked(self, now):
        """Prunes old timestamps and expired backoff trackers to avoid memory growth."""
        if now - self.last_cleanup < 60:
            return
        self.last_cleanup = now

        # Prune sliding window logs
        expired_keys = []
        for key, timestamps in list(self.ip_sliding_windows.items()):
            active = [t for t in timestamps if now - t < 3600]
            if active:
                self.ip_sliding_windows[key] = active
            else:
                expired_keys.append(key)
        for k in expired_keys:
            self.ip_sliding_windows.pop(k, None)

        # Prune account backoffs
        expired_accounts = [
            acc for acc, data in self.account_backoff.items()
            if now > data.get('locked_until', 0) and now - data.get('last_attempt', 0) > self.config.auth_account_window
        ]
        for acc in expired_accounts:
            self.account_backoff.pop(acc, None)

        # Prune IP backoffs
        expired_ips = [
            ip for ip, data in self.ip_backoff.items()
            if now > data.get('locked_until', 0) and now - data.get('last_attempt', 0) > self.config.auth_account_window
        ]
        for ip in expired_ips:
            self.ip_backoff.pop(ip, None)

    def check_sliding_window(self, key, limit, window):
        """
        Check and record a request against a sliding window limit.
        Returns (is_limited, remaining, retry_after, reset_time).
        """
        now = time.time()
        with self.lock:
            self._cleanup_unlocked(now)
            timestamps = self.ip_sliding_windows[key]
            active_timestamps = [t for t in timestamps if now - t < window]
            self.ip_sliding_windows[key] = active_timestamps

            if len(active_timestamps) >= limit:
                oldest = active_timestamps[0]
                retry_after = max(1, int(oldest + window - now) + 1)
                reset_time = int(oldest + window)
                return True, 0, retry_after, reset_time

            active_timestamps.append(now)
            remaining = limit - len(active_timestamps)
            reset_time = int(active_timestamps[0] + window) if active_timestamps else int(now + window)
            return False, remaining, 0, reset_time

    def check_auth_rate_limit(self, account, ip):
        """
        Dual-key pre-check for authentication routes.
        Checks:
        1. Client IP sliding window request limit.
        2. Client IP exponential backoff status.
        3. Account identifier exponential backoff status.
        Returns: (is_limited, retry_after, message, limit, remaining, reset_time)
        """
        now = time.time()
        with self.lock:
            self._cleanup_unlocked(now)

            # 1. Sliding window request frequency per IP
            is_limited, remaining, retry_after, reset_time = self.check_sliding_window(
                f"auth_ip:{ip}", self.config.auth_ip_limit, self.config.auth_ip_window
            )
            if is_limited:
                return (
                    True,
                    retry_after,
                    f"Too many authentication attempts from this IP. Please wait {retry_after} seconds.",
                    self.config.auth_ip_limit,
                    0,
                    reset_time
                )

            # 2. Check if IP is in exponential backoff lockout
            ip_data = self.ip_backoff.get(ip)
            if ip_data and now < ip_data.get('locked_until', 0):
                lock_retry_after = max(1, int(ip_data['locked_until'] - now))
                return (
                    True,
                    lock_retry_after,
                    f"IP address temporarily throttled due to multiple failed attempts. Please retry in {lock_retry_after} seconds.",
                    self.config.auth_ip_limit,
                    0,
                    int(ip_data['locked_until'])
                )

            # 3. Check if Account identifier is in exponential backoff lockout
            if account:
                normalized_account = str(account).strip().lower()
                acc_data = self.account_backoff.get(normalized_account)
                if acc_data and now < acc_data.get('locked_until', 0):
                    lock_retry_after = max(1, int(acc_data['locked_until'] - now))
                    return (
                        True,
                        lock_retry_after,
                        f"Account '{normalized_account}' temporarily throttled due to repeated failed logins. Please retry in {lock_retry_after} seconds.",
                        self.config.auth_max_attempts,
                        0,
                        int(acc_data['locked_until'])
                    )

            return False, 0, None, self.config.auth_ip_limit, remaining, reset_time

    def record_auth_result(self, account, ip, success):
        """
        Updates exponential backoff counters after an authentication attempt:
        - If success: clears/resets failed attempts for both account and IP.
        - If failure: increments failed attempts and computes exponential backoff lockout.
        """
        now = time.time()
        with self.lock:
            normalized_account = str(account).strip().lower() if account else None

            if success:
                # Reset counters on success
                if normalized_account in self.account_backoff:
                    self.account_backoff.pop(normalized_account, None)
                if ip in self.ip_backoff:
                    self.ip_backoff.pop(ip, None)
                return 0

            # On failure: calculate exponential backoff
            max_attempts = self.config.auth_max_attempts
            base_backoff = self.config.auth_base_backoff
            factor = self.config.auth_backoff_factor
            max_backoff = self.config.auth_max_backoff

            # Update account backoff
            account_backoff_secs = 0
            if normalized_account:
                acc_data = self.account_backoff.get(normalized_account, {'failed_attempts': 0, 'locked_until': 0})
                failed = acc_data['failed_attempts'] + 1
                locked_until = 0
                if failed >= max_attempts:
                    exponent = failed - max_attempts
                    account_backoff_secs = min(max_backoff, base_backoff * (factor ** exponent))
                    locked_until = now + account_backoff_secs

                self.account_backoff[normalized_account] = {
                    'failed_attempts': failed,
                    'locked_until': locked_until,
                    'last_attempt': now
                }

            # Update IP backoff
            ip_backoff_secs = 0
            ip_data = self.ip_backoff.get(ip, {'failed_attempts': 0, 'locked_until': 0})
            ip_failed = ip_data['failed_attempts'] + 1
            ip_locked_until = 0
            if ip_failed >= max_attempts:
                exponent = ip_failed - max_attempts
                ip_backoff_secs = min(max_backoff, base_backoff * (factor ** exponent))
                ip_locked_until = now + ip_backoff_secs

            self.ip_backoff[ip] = {
                'failed_attempts': ip_failed,
                'locked_until': ip_locked_until,
                'last_attempt': now
            }

            return max(account_backoff_secs, ip_backoff_secs)


# Global singleton instance
limiter = RateLimiter()


def build_rate_limit_response(message, retry_after, limit=None, remaining=0, reset_time=None):
    """Formats standard HTTP 429 Too Many Requests response with informative headers."""
    payload = {
        'success': False,
        'error': {
            'code': 'RATE_LIMIT_EXCEEDED',
            'message': message or f"Too many requests. Please retry in {retry_after} seconds.",
            'retry_after': int(retry_after)
        }
    }
    response = jsonify(payload)
    response.status_code = 429
    response.headers['Retry-After'] = str(int(retry_after))
    if limit is not None:
        response.headers['X-RateLimit-Limit'] = str(limit)
    response.headers['X-RateLimit-Remaining'] = str(remaining)
    if reset_time:
        response.headers['X-RateLimit-Reset'] = str(int(reset_time))
    return response


def rate_limit_public(tier="general", limit=None, window=None):
    """
    Decorator for public endpoints with moderate rate limits.
    Tiers: 'contact', 'chat', 'download', 'general'
    """
    def decorator(f):
        @functools.wraps(f)
        def wrapped(*args, **kwargs):
            cfg = limiter.config
            if tier == "contact":
                lim = limit if limit is not None else cfg.public_contact_limit
                win = window if window is not None else cfg.public_contact_window
            elif tier == "chat":
                lim = limit if limit is not None else cfg.public_chat_limit
                win = window if window is not None else cfg.public_chat_window
            elif tier == "download":
                lim = limit if limit is not None else cfg.public_download_limit
                win = window if window is not None else cfg.public_download_window
            else:
                lim = limit if limit is not None else cfg.public_general_limit
                win = window if window is not None else cfg.public_general_window

            client_ip = limiter.get_client_ip()
            key = f"public:{tier}:{client_ip}"
            is_limited, remaining, retry_after, reset_time = limiter.check_sliding_window(key, lim, win)

            if is_limited:
                return build_rate_limit_response(
                    f"Too many requests for this resource. Please wait {retry_after} seconds.",
                    retry_after,
                    limit=lim,
                    remaining=remaining,
                    reset_time=reset_time
                )

            res = make_response(f(*args, **kwargs))
            res.headers['X-RateLimit-Limit'] = str(lim)
            res.headers['X-RateLimit-Remaining'] = str(remaining)
            res.headers['X-RateLimit-Reset'] = str(reset_time)
            return res
        return wrapped
    return decorator


def rate_limit_authenticated(limit=None, window=None):
    """
    Decorator for authenticated user / admin endpoints with looser rate limits.
    Tracks via Bearer token / session ID or client IP.
    """
    def decorator(f):
        @functools.wraps(f)
        def wrapped(*args, **kwargs):
            cfg = limiter.config
            lim = limit if limit is not None else cfg.authenticated_limit
            win = window if window is not None else cfg.authenticated_window

            # Extract auth identifier
            auth_token = request.headers.get('Authorization', '')
            admin_session = session.get('admin_logged_in')
            client_ip = limiter.get_client_ip()

            if auth_token:
                ident = f"auth_token:{auth_token}"
            elif admin_session:
                ident = f"auth_session:{client_ip}"
            else:
                ident = f"auth_ip:{client_ip}"

            is_limited, remaining, retry_after, reset_time = limiter.check_sliding_window(ident, lim, win)
            if is_limited:
                return build_rate_limit_response(
                    f"Authenticated request rate limit exceeded. Please retry in {retry_after} seconds.",
                    retry_after,
                    limit=lim,
                    remaining=remaining,
                    reset_time=reset_time
                )

            res = make_response(f(*args, **kwargs))
            res.headers['X-RateLimit-Limit'] = str(lim)
            res.headers['X-RateLimit-Remaining'] = str(remaining)
            res.headers['X-RateLimit-Reset'] = str(reset_time)
            return res
        return wrapped
    return decorator


def rate_limit_auth(get_account=None):
    """
    Decorator for authentication routes (login, signup, reset) with dual-key IP + Account tracking
    and exponential backoff.
    """
    def decorator(f):
        @functools.wraps(f)
        def wrapped(*args, **kwargs):
            client_ip = limiter.get_client_ip()
            account = None
            if get_account and callable(get_account):
                try:
                    account = get_account()
                except Exception:
                    account = None
            elif request.is_json:
                data = request.get_json(silent=True) or {}
                account = data.get('username') or data.get('email') or data.get('account')

            is_limited, retry_after, message, limit_val, remaining, reset_time = limiter.check_auth_rate_limit(account, client_ip)
            if is_limited:
                return build_rate_limit_response(
                    message,
                    retry_after,
                    limit=limit_val,
                    remaining=remaining,
                    reset_time=reset_time
                )

            res = make_response(f(*args, **kwargs))
            if limit_val is not None:
                res.headers['X-RateLimit-Limit'] = str(limit_val)
            res.headers['X-RateLimit-Remaining'] = str(remaining)
            if reset_time:
                res.headers['X-RateLimit-Reset'] = str(reset_time)
            return res
        return wrapped
    return decorator


# Backward-compatible general rate limiter decorator
def rate_limit(limit=10, period=60):
    return rate_limit_public(tier="general", limit=limit, window=period)
