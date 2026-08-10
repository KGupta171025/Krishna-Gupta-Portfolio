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

# --- BACKEND AI AGENT ENDPOINT ---

# Try importing google-generativeai for the real Gemini AI model
try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False

# Setup Gemini API key securely from environment
if HAS_GEMINI:
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if gemini_key:
        genai.configure(api_key=gemini_key)
    else:
        HAS_GEMINI = False

# Krishna's Profile Knowledge Base
KRISHNA_KNOWLEDGE = {
    "summary": """
    Krishna Gupta is a Data Science B.Tech student at the Oriental Institute of Science and Technology, Bhopal (Class of 2027).
    He is an aspiring Data Scientist, AI/ML Engineer, LLM Engineer, Data Engineer, and Software Engineer.
    Experienced in Full Stack Development, REST APIs, and workflow automation.
    He has hands-on expertise in LLM post-training evaluation, prompt engineering, and data quality assurance.
    """,
    "education": """
    • Oriental Institute of Science and Technology, Bhopal, Madhya Pradesh, India.
      Bachelor of Technology (B.Tech) in Data Science (2023 - 2027).
    """,
    "experience": """
    • Ethara AI (Feb 2026 - May 2026) | LLM Post Training Intern (Paid Internship, Remote):
      - Evaluated 50,000+ Large Language Model (LLM) outputs via prompt/model evaluation, improving AI quality and data validation.
      - Developed Python automation scripts and workflow pipelines for post-training LLM evaluation, enhancing QA.
    • Kanchan Pvt Ltd - Web Development Wing (Sapphire) (Oct 2025 - Feb 2026) | Full Stack Development Intern (Paid Internship, Remote):
      - Engineered and deployed the full-stack architecture of "RevU Social" (revu.social) using React.js, Node.js, Express.js, and REST APIs with secure JWT authentication.
      - Designed and optimized relational databases in MySQL and PostgreSQL, utilizing GenAI-assisted development to accelerate design.
    """,
    "projects": """
    • KALKI 1.5 - Enterprise Intelligence Operating System (IOS) [2024 - Present]:
      - Technologies: Python, PyTorch, LLMs, VLMs, Autonomous Multi-Agents, Hybrid RAG, Defensive Cybersecurity.
      - Description: An Enterprise Intelligence Operating System integrating LLMs, Vision Language Models (VLMs), and autonomous multi-agent workflows. Implements a hybrid RAG pipeline to optimize search accuracy and speed. Contains agentic safety protocols and defensive cybersecurity mechanisms.
      - Repository: github.com/KGupta171025/KALKI-1.5
    • RevU Social - Full-Stack Review & Analytics Platform [Oct 2025 - Feb 2026]:
      - Technologies: React, Node.js, REST APIs, MySQL, PostgreSQL.
      - Live: www.revu.social / Repository: github.com/srohatgi01/opinion-play-earn
      - Description: A responsive full-stack review management app with secure REST APIs and JWT session authentication.
    • RNN Poetry Generation:
      - Technologies: Python, PyTorch, RNN, Text Generation, Sequence Modeling.
      - Description: A character-level text generation model implementing Recurrent Neural Networks to output coherent poetry.
      - Repository: github.com/KGupta171025/RNN_Poetry_Generation
    """,
    "skills": """
    • Programming: Python, SQL, JavaScript, C++.
    • AI & Machine Learning: PyTorch, TensorFlow, Scikit-learn, Deep Learning, Natural Language Processing (NLP), LLMs, LLM Evaluation, Prompt Engineering, Feature Engineering.
    • Data Engineering: Pandas, NumPy, ETL Concepts, Data Validation, Data Processing, Workflow Automation.
    • Web & APIs: FastAPI, Flask, React.js, Node.js, Express.js, REST APIs, JWT Authentication.
    • Databases & Tools: PostgreSQL, MySQL, Supabase, Git, GitHub, Docker, Postman, Linux, AWS.
    • Development & AI Tools: SDLC, Agile Methodology, OOP, ChatGPT, Gemini, Claude, Perplexity, Antigravity.
    """,
    "certifications": """
    • AWS Certified Developer Associate (Infosys Springboard, Jun 2026)
    • Machine Learning with Python (IBM SkillsBuild, Jun 2026)
    • Data Science & Analytics (HP LIFE, Jun 2026)
    • Tata Data Visualisation: Empowering Business with Effective Insights (Forage, Sep 2025)
    • Deloitte Australia Data Analytics Job Simulation (Forage, Sep 2025)
    """,
    "contact": """
    • Email: hg497kg@gmail.com / krishna.official.gupta@gmail.com
    • LinkedIn: linkedin.com/in/krishnaofficialgupta
    • GitHub: github.com/KGupta171025
    • Phone: +91-9993153109
    • Portfolio: kgupta171025.github.io/Krishna-Gupta-Portfolio
    """
}

# Rule-based NLP fallback engine
class LocalAIAgent:
    def __init__(self, knowledge):
        self.knowledge = knowledge

    def get_response(self, user_message):
        msg = user_message.lower().strip()
        if any(w in msg for w in ["who is", "about", "profile", "summary", "krishna"]):
            return f"<strong>Krishna Gupta Summary:</strong><br>{self.knowledge['summary']}"
        elif any(w in msg for w in ["skill", "tech", "languages", "programming", "python", "javascript", "frameworks"]):
            return f"<strong>Technical Skills:</strong><br>{self.knowledge['skills']}"
        elif any(w in msg for w in ["work", "experience", "job", "intern", "ethara", "kanchan"]):
            return f"<strong>Professional Experience:</strong><br>{self.knowledge['experience']}"
        elif any(w in msg for w in ["project", "kalki", "revu", "poetry", "rnn"]):
            return f"<strong>Key Projects:</strong><br>{self.knowledge['projects']}"
        elif any(w in msg for w in ["certificat", "credential", "aws", "ibm"]):
            return f"<strong>Certifications & Credentials:</strong><br>{self.knowledge['certifications']}"
        elif any(w in msg for w in ["contact", "email", "phone", "linkedin", "social", "address"]):
            return f"<strong>Contact Details:</strong><br>{self.knowledge['contact']}"
        return """
        I am Krishna's AI agent. I can answer questions about his summary, skills, experience, projects, certifications, or contact details. 
        <br><br>Please ask something like "What are his skills?" or "Tell me about the KALKI 1.5 project!".
        """

local_agent = LocalAIAgent(KRISHNA_KNOWLEDGE)

def query_gemini_model(prompt):
    """Queries Gemini 1.5 Pro/Flash if available, otherwise returns None."""
    if not HAS_GEMINI:
        return None
    try:
        system_instruction = f"""
        You are Krishna Gupta's personal Portfolio AI Agent.
        Your task is to answer visitors' questions about Krishna's profile, skills, professional experience, projects, certifications, and contact details.
        
        Here is Krishna's official profile details:
        
        SUMMARY:
        {KRISHNA_KNOWLEDGE['summary']}
        
        EDUCATION:
        {KRISHNA_KNOWLEDGE['education']}
        
        EXPERIENCE:
        {KRISHNA_KNOWLEDGE['experience']}
        
        PROJECTS:
        {KRISHNA_KNOWLEDGE['projects']}
        
        SKILLS:
        {KRISHNA_KNOWLEDGE['skills']}
        
        CERTIFICATIONS:
        {KRISHNA_KNOWLEDGE['certifications']}
        
        CONTACT:
        {KRISHNA_KNOWLEDGE['contact']}
        
        Guidelines:
        1. Always be professional, helpful, and friendly.
        2. Keep your answers concise, clear, and easy to read. Use HTML linebreaks (<br>) and list formatting for structure.
        3. Do not invent details. If you don't know the answer, politely guide the user to the contact form or give them Krishna's email.
        """
        model = genai.GenerativeModel('gemini-1.5-flash', system_instruction=system_instruction)
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error querying Gemini API: {e}")
        return None

# API route for AI Chatbot Agent
@app.route('/api/chat', methods=['POST'])
def chat():
    # Rate limiter check for anti-DoS
    client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    if client_ip and ',' in client_ip:
        client_ip = client_ip.split(',')[0].strip()

    if is_rate_limited(client_ip, limit=10, period=60):
        return jsonify({'success': False, 'message': 'Too many chat requests. Please slow down.'}), 429

    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'success': False, 'message': 'No message provided.'}), 400

        user_message = data.get('message')
        if len(user_message) > 500:
            return jsonify({'success': False, 'message': 'Message is too long.'}), 400

        # Try to get response from Gemini
        ai_response = query_gemini_model(user_message)
        
        # If Gemini is not available or fails, fall back to our local Python NLP matcher
        if not ai_response:
            ai_response = local_agent.get_response(user_message)

        return jsonify({
            'success': True,
            'message': ai_response
        }), 200

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False, host='127.0.0.1', port=5000)
