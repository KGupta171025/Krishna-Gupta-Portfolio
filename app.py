import os
import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, render_template, send_from_directory, request, jsonify
from dotenv import load_dotenv

# Load local environment variables from .env if present
load_dotenv()

app = Flask(__name__, template_folder='.')

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
    return send_from_directory(directory, filename, as_attachment=True)

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

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = f"New Portfolio Message from {name}"

    body = f"Name: {name}\nEmail: {email_address}\n\nMessage:\n{message}"
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

    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
    data = {
        'From': twilio_number,
        'To': recipient_number,
        'Body': f"Alert: You received a new portfolio message from {name} ({email_address}). Check your mail!"
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
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided.'}), 400

        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not all([name, email, message]):
            return jsonify({'success': False, 'message': 'Please fill in all fields.'}), 400

        # Attempt to send email and SMS notifications
        email_sent = send_email_notification(name, email, message)
        sms_sent = send_sms_notification(name, email)

        return jsonify({
            'success': True,
            'message': 'Message processed successfully!',
            'email_sent': email_sent,
            'sms_sent': sms_sent
        }), 200

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
