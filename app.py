import os
import time
import requests
import smtplib
import threading
from collections import defaultdict
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, render_template, send_from_directory, request, jsonify
from dotenv import load_dotenv

# Load local environment variables from .env if present
load_dotenv()

app = Flask(__name__, template_folder='.')

# --- DEFENSIVE CYBERSECURITY MODULES ---

# 1. Thread-safe In-Memory Rate Limiter (IP-based)
ip_requests = defaultdict(list)
rate_limiter_lock = threading.Lock()

def is_rate_limited(ip_address, limit=3, period=60):
    """
    Checks if an IP address has exceeded the rate limit.
    Default limit: maximum of 3 requests per 60 seconds.
    """
    now = time.time()
    with rate_limiter_lock:
        # Keep only timestamps within the current active period window
        ip_requests[ip_address] = [t for t in ip_requests[ip_address] if now - t < period]
        if len(ip_requests[ip_address]) >= limit:
            return True
        ip_requests[ip_address].append(now)
        return False

# 2. Asynchronous Notification Processor
def send_async_notifications(name, email_address, message):
    """
    Executes SMTP and Twilio requests inside a background thread
    to prevent synchronous worker thread exhaustion (DoS defense).
    """
    send_email_notification(name, email_address, message)
    send_sms_notification(name, email_address)

# --- END OF SECURITY MODULES ---

@app.route('/')
@app.route('/about')
@app.route('/skills')
@app.route('/experience')
@app.route('/projects')
@app.route('/certifications')
@app.route('/contact')
def home():
    return render_template('index.html')

# Endpoint to handle downloads of resume and certifications
@app.route('/download/<path:filename>')
def download_file(filename):
    directory = os.path.join(app.root_path, 'static', 'assets')
    
    # Path Traversal Defense: Ensure requested filename is strictly a base filename (no directory nesting/traversals)
    safe_filename = os.path.basename(filename)
    if safe_filename != filename or ".." in filename:
        return jsonify({'success': False, 'message': 'Access denied.'}), 403
        
    return send_from_directory(directory, safe_filename, as_attachment=True)

# Helper function to send email notification
def send_email_notification(name, email_address, message):
    sender_email = os.environ.get('SMTP_EMAIL_USER')
    sender_password = os.environ.get('SMTP_EMAIL_PASS')
    smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    recipient_email = 'krishna.official.gupta@gmail.com'

    if not sender_email or not sender_password:
        print("SMTP Credentials not configured in environment. Skipping email sending.")
        return False

    # CRLF Header Injection Defense: Strip carriage return and line feed characters
    clean_name = "".join(c for c in name if c not in "\r\n")
    clean_email = "".join(c for c in email_address if c not in "\r\n")

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = f"New Portfolio Message from {clean_name}"

    body = f"Name: {clean_name}\nEmail: {clean_email}\n\nMessage:\n{message}"
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

# Helper function to send Twilio SMS notification
def send_sms_notification(name, email_address):
    account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
    auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
    twilio_number = os.environ.get('TWILIO_PHONE_NUMBER')
    recipient_number = os.environ.get('MY_PHONE_NUMBER')

    if not all([account_sid, auth_token, twilio_number, recipient_number]):
        print("Twilio Credentials not configured in environment. Skipping SMS sending.")
        return False

    # CRLF Injection Defense
    clean_name = "".join(c for c in name if c not in "\r\n")
    clean_email = "".join(c for c in email_address if c not in "\r\n")

    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
    data = {
        'From': twilio_number,
        'To': recipient_number,
        'Body': f"Alert: You received a new portfolio message from {clean_name} ({clean_email}). Check your mail!"
    }
    
    try:
        response = requests.post(url, data=data, auth=(account_sid, auth_token))
        if response.status_code in [200, 201]:
            return True
        else:
            print(f"Twilio API Response Code {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"Error sending SMS: {e}")
        return False

# API Endpoint to handle contact form submissions
@app.route('/api/contact', methods=['POST'])
def contact():
    # 1. Rate Limiting Check
    client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    if client_ip and ',' in client_ip:
        client_ip = client_ip.split(',')[0].strip()

    if is_rate_limited(client_ip, limit=3, period=60):
        return jsonify({'success': False, 'message': 'Too many requests. Please try again after 60 seconds.'}), 429

    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided.'}), 400

        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not all([name, email, message]):
            return jsonify({'success': False, 'message': 'Please fill in all fields.'}), 400

        # Input Length Attack Defense: Restrict character lengths to prevent resource exhaustion
        if len(name) > 100 or len(email) > 100 or len(message) > 5000:
            return jsonify({'success': False, 'message': 'Input length limits exceeded.'}), 400

        # 2. Async Execution: Spawn a background thread to process notifications
        # This returns a 200 OK instantly and blocks slow resource exhaustion attacks
        notification_thread = threading.Thread(
            target=send_async_notifications, 
            args=(name, email, message)
        )
        notification_thread.daemon = True
        notification_thread.start()

        return jsonify({
            'success': True,
            'message': 'Message received! Notifications are processing in the background.'
        }), 200

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False, host='127.0.0.1', port=5000)
