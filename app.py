import os
import time
import requests
import smtplib
import threading
from collections import defaultdict
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, render_template, send_from_directory, request, jsonify, session, redirect, url_for
from dotenv import load_dotenv
import io
import hashlib
from werkzeug.utils import secure_filename
from argon2 import PasswordHasher
from cryptography.fernet import Fernet
import pandas as pd

# Load local environment variables from .env if present
load_dotenv()

app = Flask(__name__, template_folder='.')
app.secret_key = os.environ.get("FLASK_SECRET", "super-secure-fallback-key-ralk-gupta")

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
    "personal": """
    • Date of Birth (DOB): 17th October, 2005
    • Age: 20 years old (turns 21 on October 17, 2026)
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
        if any(w in msg for w in ["dob", "birth", "born", "age", "how old"]):
            return "Krishna Gupta was born on 17th October, 2005, and is currently 20 years old (turning 21 on October 17, 2026)."
        elif any(w in msg for w in ["who is", "about", "profile", "summary", "krishna"]):
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
        
        PERSONAL INFO (DOB & AGE):
        {KRISHNA_KNOWLEDGE['personal']}
        
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
        model = genai.GenerativeModel('gemini-3.5-flash', system_instruction=system_instruction)
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

# --- SECURE DOCUMENT MANAGEMENT ENGINE (PYSPARK + ENCRYPTION AT REST) ---

class EncryptedDocumentCatalog:
    def __init__(self, file_path, encryption_key):
        self.file_path = file_path
        # Use Fernet key for encrypting data at rest. Fall back to plaintext if no key.
        self.fernet = Fernet(encryption_key.encode('utf-8')) if encryption_key else None

    def read_catalog(self):
        """Reads and decrypts the Parquet catalog metadata into a Pandas DataFrame."""
        if not os.path.exists(self.file_path):
            return pd.DataFrame(columns=["id", "filename", "path", "category", "size_bytes", "uploaded_at"])

        try:
            with open(self.file_path, 'rb') as f:
                encrypted_data = f.read()

            if self.fernet:
                decrypted_data = self.fernet.decrypt(encrypted_data)
            else:
                decrypted_data = encrypted_data

            return pd.read_parquet(io.BytesIO(decrypted_data))
        except Exception as e:
            print(f"Error reading/decrypting catalog: {e}")
            return pd.DataFrame(columns=["id", "filename", "path", "category", "size_bytes", "uploaded_at"])

    def write_catalog(self, df):
        """Encrypts and writes the Pandas DataFrame as a Parquet dataset to disk."""
        try:
            buffer = io.BytesIO()
            df.to_parquet(buffer, index=False)
            parquet_bytes = buffer.getvalue()

            if self.fernet:
                encrypted_data = self.fernet.encrypt(parquet_bytes)
            else:
                encrypted_data = parquet_bytes

            with open(self.file_path, 'wb') as f:
                f.write(encrypted_data)
            return True
        except Exception as e:
            print(f"Error writing/encrypting catalog: {e}")
            return False

    def load_with_pyspark(self):
        """Loads the decrypted catalog into PySpark for big-data operations (e.g. tracking logs/stats)."""
        try:
            from pyspark.sql import SparkSession
            # Create local Spark Session (silence Spark log levels to prevent spam)
            spark = SparkSession.builder \
                .appName("AdminDocumentCatalog") \
                .master("local[*]") \
                .config("spark.sql.warehouse.dir", "/tmp/spark-warehouse") \
                .getOrCreate()
            spark.sparkContext.setLogLevel("ERROR")
            
            df_pd = self.read_catalog()
            if df_pd.empty:
                # Create empty spark schema
                from pyspark.sql.types import StructType, StructField, StringType, LongType
                schema = StructType([
                    StructField("id", StringType(), True),
                    StructField("filename", StringType(), True),
                    StructField("path", StringType(), True),
                    StructField("category", StringType(), True),
                    StructField("size_bytes", LongType(), True),
                    StructField("uploaded_at", StringType(), True),
                ])
                return spark.createDataFrame([], schema)
            
            # Spark session reads catalog DataFrame
            return spark.createDataFrame(df_pd)
        except Exception as e:
            print(f"[PySpark Engine] Offline or unconfigured: {e}")
            return None

CATALOG_PATH = os.path.join(app.root_path, "static", "assets", "document_catalog.parquet.enc")
DB_KEY = os.environ.get("DB_ENCRYPTION_KEY")

catalog_manager = EncryptedDocumentCatalog(CATALOG_PATH, DB_KEY)

# --- SECURE ADMIN DASHBOARD ROUTING ---

# 1. Private Dashboard Route
@app.route('/private')
def private_dashboard():
    # If authenticated, render private.html. Otherwise, render with login flag.
    logged_in = session.get('admin_logged_in') is True
    return render_template('private.html', logged_in=logged_in)

# 2. Authentication API Endpoint (Argon2id + unique salt + SHA-256 Username Hashing)
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'Invalid request parameters.'}), 400

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'success': False, 'message': 'Username and password required.'}), 400

        # Verify Username SHA-256 Hash
        stored_user_hash = os.environ.get("ADMIN_USERNAME_HASH")
        input_user_hash = hashlib.sha256(username.encode('utf-8')).hexdigest()

        if input_user_hash != stored_user_hash:
            # Constant-time mitigation: run standard verification check anyway to avoid timing leaks
            PasswordHasher().hash("dummy_password")
            return jsonify({'success': False, 'message': 'Invalid credentials.'}), 401

        # Verify Password Argon2id Hash
        stored_pass_hash = os.environ.get("ADMIN_PASSWORD_HASH")
        ph = PasswordHasher()
        try:
            ph.verify(stored_pass_hash, password)
            # Rehash if parameters have changed (best practice)
            if ph.check_needs_rehash(stored_pass_hash):
                pass
        except Exception:
            return jsonify({'success': False, 'message': 'Invalid credentials.'}), 401

        # Establish Admin Session
        session['admin_logged_in'] = True
        return jsonify({'success': True, 'message': 'Access granted.'}), 200

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# 3. Logout API Endpoint
@app.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    session.pop('admin_logged_in', None)
    return jsonify({'success': True, 'message': 'Session terminated.'}), 200

# 4. List Documents (API Endpoint)
@app.route('/api/admin/documents', methods=['GET'])
def admin_list_documents():
    if not session.get('admin_logged_in'):
        return jsonify({'success': False, 'message': 'Access denied.'}), 401

    try:
        # Load catalog (tries PySpark loading, falls back to Pandas)
        spark_df = catalog_manager.load_with_pyspark()
        
        if spark_df is not None:
            print("[PySpark Engine] Successfully cataloged document DataFrame in Spark session context.")
            # Retrieve rows from Spark context
            rows = [r.asDict() for r in spark_df.collect()]
            engine = "PySpark Session Active"
        else:
            df = catalog_manager.read_catalog()
            rows = df.to_dict(orient='records')
            engine = "Pandas Native Decryption (Spark offline)"

        return jsonify({
            'success': True,
            'engine': engine,
            'documents': rows
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# 5. Upload/Replace Document (API Endpoint)
@app.route('/api/admin/documents/upload', methods=['POST'])
def admin_upload_document():
    if not session.get('admin_logged_in'):
        return jsonify({'success': False, 'message': 'Access denied.'}), 401

    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file segment found.'}), 400

        file = request.files['file']
        category = request.form.get('category', 'Other')

        if file.filename == '':
            return jsonify({'success': False, 'message': 'No selected file.'}), 400

        filename = secure_filename(file.filename)
        
        # Determine Destination folder and paths
        if category == 'Resume':
            dest_dir = os.path.join(app.root_path, 'static', 'assets')
        elif category == 'Certificate':
            dest_dir = os.path.join(app.root_path, 'static', 'assets', 'certificates')
        else:
            dest_dir = os.path.join(app.root_path, 'static', 'assets')

        os.makedirs(dest_dir, exist_ok=True)
        file_path = os.path.join(dest_dir, filename)

        # Save file to disk
        file.save(file_path)

        # Update metadata in Parquet catalog
        df = catalog_manager.read_catalog()
        
        # Check if file is already cataloged (Replacement)
        rel_path = os.path.relpath(file_path, app.root_path).replace('\\', '/')
        existing_idx = df[df['path'] == rel_path].index

        new_record = {
            "id": hashlib.md5(rel_path.encode('utf-8')).hexdigest(),
            "filename": filename,
            "path": rel_path,
            "category": category,
            "size_bytes": os.path.getsize(file_path),
            "uploaded_at": time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
        }

        if len(existing_idx) > 0:
            # Replace record
            for col in df.columns:
                df.at[existing_idx[0], col] = new_record[col]
            action = "Replaced"
        else:
            # Append new record
            df = pd.concat([df, pd.DataFrame([new_record])], ignore_index=True)
            action = "Added"

        # Encrypt and save catalog to disk
        catalog_manager.write_catalog(df)

        return jsonify({
            'success': True,
            'message': f"Document successfully {action.lower()} and cataloged.",
            'document': new_record
        }), 200

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# 6. Delete Document (API Endpoint)
@app.route('/api/admin/documents/delete', methods=['POST'])
def admin_delete_document():
    if not session.get('admin_logged_in'):
        return jsonify({'success': False, 'message': 'Access denied.'}), 401

    try:
        data = request.get_json()
        if not data or 'id' not in data:
            return jsonify({'success': False, 'message': 'Document ID is required.'}), 400

        doc_id = data.get('id')

        # Read catalog
        df = catalog_manager.read_catalog()
        doc_record = df[df['id'] == doc_id]

        if doc_record.empty:
            return jsonify({'success': False, 'message': 'Document not found in catalog.'}), 404

        rel_path = doc_record.iloc[0]['path']
        abs_path = os.path.join(app.root_path, rel_path.replace('/', os.path.sep))

        # Delete file from local disk if it exists
        if os.path.exists(abs_path):
            os.remove(abs_path)

        # Remove row from catalog
        df = df[df['id'] != doc_id]

        # Encrypt and save updated catalog to disk
        catalog_manager.write_catalog(df)

        return jsonify({'success': True, 'message': 'Document successfully removed from system and catalog.'}), 200

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# 7. Add & Auto-Generate Project Card (API Endpoint)
@app.route('/api/admin/projects/add', methods=['POST'])
def admin_add_project():
    if not session.get('admin_logged_in'):
        return jsonify({'success': False, 'message': 'Access denied.'}), 401

    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided.'}), 400

        github_link = data.get('github_link')
        live_link = data.get('live_link')

        if not github_link or not live_link:
            return jsonify({'success': False, 'message': 'Both GitHub link and live link are required.'}), 400

        url = github_link.strip().rstrip('/')
        if "github.com/" not in url:
            return jsonify({'success': False, 'message': 'Invalid GitHub repository URL.'}), 400
            
        parts = url.split("github.com/")[-1].split('/')
        if len(parts) < 2:
            return jsonify({'success': False, 'message': 'Could not parse owner and repository name.'}), 400
            
        owner = parts[0]
        repo = parts[1].replace(".git", "")

        # Fetch GitHub repository metadata and README
        headers = {'User-Agent': 'Krishna-Portfolio-Server'}
        meta_url = f"https://api.github.com/repos/{owner}/{repo}"
        meta_res = requests.get(meta_url, headers=headers)
        
        repo_desc = ""
        if meta_res.status_code == 200:
            repo_desc = meta_res.json().get('description', '')

        readme_url = f"https://raw.githubusercontent.com/{owner}/{repo}/main/README.md"
        readme_res = requests.get(readme_url, headers=headers)
        if readme_res.status_code != 200:
            readme_url = f"https://raw.githubusercontent.com/{owner}/{repo}/master/README.md"
            readme_res = requests.get(readme_url, headers=headers)
        
        readme_content = readme_res.text if readme_res.status_code == 200 else ""

        # Default fallback values
        proj_name = repo.replace('-', ' ').title()
        proj_category = "Software Engineering"
        proj_desc = repo_desc if repo_desc else "A software project hosted on GitHub."
        proj_stack = ["GitHub", "Git", "Software", "Python"]

        # Call Gemini API to extract details if available
        if HAS_GEMINI:
            try:
                import json
                prompt = f"""
                You are an expert software portfolio architect.
                Analyze the following GitHub repository details:
                - Repository: {owner}/{repo}
                - Description: {repo_desc}
                - README content: {readme_content[:3000]}
                
                Create a professional structured project card details in JSON format.
                The JSON must contain the exact keys:
                1. "name": A clean, concise title for the project card (e.g. "ShelfScanner", "KALKI 1.5", "OpinionPlay"). Max 30 chars.
                2. "category": A professional portfolio category (e.g. "Full-Stack Application", "AI & Workflow Automation", "Computer Vision & AI Recommender"). Max 40 chars.
                3. "description": A highly engaging 2-3 sentence overview description of what the project does, key features, and achievements. Keep it professional. Max 250 chars.
                4. "stack": An array of exactly 4 relevant technologies or libraries used in this project (e.g. ["React", "Python", "MySQL", "NLP"]).
                
                Return ONLY the raw JSON string with no markdown formatting or other text.
                """
                model = genai.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content(prompt)
                
                cleaned_text = response.text.strip()
                if cleaned_text.startswith("```"):
                    start = cleaned_text.find("{")
                    end = cleaned_text.rfind("}")
                    if start != -1 and end != -1:
                        cleaned_text = cleaned_text[start:end+1]
                
                parsed_data = json.loads(cleaned_text)
                proj_name = parsed_data.get("name", proj_name)
                proj_category = parsed_data.get("category", proj_category)
                proj_desc = parsed_data.get("description", proj_desc)
                proj_stack = parsed_data.get("stack", proj_stack)
            except Exception as gem_err:
                print(f"Gemini generation failed, using fallbacks: {gem_err}")

        # Format technology stack tags
        stack_spans = "".join([f"<span>{tech}</span>" for tech in proj_stack])

        # Generate HTML project card container markup
        project_card_markup = f"""                <!-- Project: {proj_name} -->
                <div class="project-card-container">
                    <div class="project-card">
                        <!-- Front Face (Live Preview) -->
                        <div class="project-card-front">
                            <div class="preview-header">
                                <h4 class="preview-title">{proj_name}</h4>
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <span class="preview-badge"><i class="fas fa-play-circle"></i> Live Preview</span>
                                    <span class="preview-flip-icon"><i class="fas fa-sync-alt"></i></span>
                                </div>
                            </div>
                            <div class="preview-frame-container">
                                <iframe src="{live_link}" class="preview-iframe" loading="lazy"></iframe>
                                <div class="preview-click-indicator">
                                    <span><i class="fas fa-mouse"></i> Scroll to Explore | Click Header or Indicator to Flip</span>
                                </div>
                            </div>
                        </div>
                        <!-- Back Face (Details) -->
                        <div class="project-card-back">
                            <div class="project-header">
                                <span class="project-type">{proj_category}</span>
                                <div class="project-links">
                                    <a href="{github_link}" target="_blank" aria-label="GitHub"><i class="fab fa-github"></i></a>
                                    <a href="{live_link}" target="_blank" aria-label="Live Demo"><i class="fas fa-external-link-alt"></i></a>
                                </div>
                            </div>
                            <h3 class="project-title">{proj_name}</h3>
                            <p class="project-desc">
                                {proj_desc}
                            </p>
                            <div class="project-stack">
                                {stack_spans}
                            </div>
                        </div>
                    </div>
                </div>
"""

        # Read and inject into all 7 HTML files
        html_files = ["index.html", "about.html", "projects.html", "skills.html", "experience.html", "certifications.html", "contact.html"]
        for filename in html_files:
            filepath = os.path.join(app.root_path, filename)
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                target_str = '<div class="projects-grid reveal">'
                if target_str in content:
                    new_content = content.replace(target_str, f"{target_str}\n{project_card_markup}")
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                else:
                    print(f"Target projects-grid not found in {filename}!")

        # Trigger automatic Git commit & push
        git_success = False
        try:
            import subprocess
            subprocess.run(["git", "add", "."], cwd=app.root_path, check=True)
            subprocess.run(["git", "commit", "--no-gpg-sign", "-m", f"Automated project card: Add {proj_name}"], cwd=app.root_path, check=True)
            subprocess.run(["git", "push", "origin", "main"], cwd=app.root_path, check=True)
            git_success = True
        except Exception as git_err:
            print(f"Failed to auto-push changes to origin main: {git_err}")

        status_msg = f"Project '{proj_name}' card successfully generated and added."
        if git_success:
            status_msg += " Git changes pushed live to GitHub Pages!"
        else:
            status_msg += " (Local files updated; Git push failed/skipped)."

        return jsonify({
            'success': True,
            'message': status_msg,
            'project': {
                'name': proj_name,
                'category': proj_category,
                'description': proj_desc,
                'stack': proj_stack
            }
        }), 200

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False, host='127.0.0.1', port=5000)
