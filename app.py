import os

import functools

import uuid

import threading

import time

import requests

import smtplib

import threading

import re

import json

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



# Load environment

load_dotenv()



app = Flask(__name__, template_folder='.')

app.secret_key = os.environ.get("FLASK_SECRET", "super-secure-fallback-key-ralk-gupta")



# Secure Session Cookie Settings (XSS & CSRF Mitigation)

app.config.update(

    SESSION_COOKIE_SECURE=os.environ.get("FLASK_ENV") == "production",

    SESSION_COOKIE_HTTPONLY=True,

    SESSION_COOKIE_SAMESITE='Lax',

    PERMANENT_SESSION_LIFETIME=1800  # 30-minute absolute lifetime limit

)



# Global locks and caches for thread safety & performance

git_lock = threading.Lock()

idempotency_cache = {}

idempotency_lock = threading.Lock()



_spark_session = None

_spark_lock = threading.Lock()



_catalog_cache = None

_catalog_cache_mtime = 0

_catalog_cache_lock = threading.Lock()



# Define strict regular expressions for URL validation (SSRF & Injection mitigation)

GITHUB_URL_REGEX = re.compile(r'^https?://(?:www\.)?github\.com/([a-zA-Z0-9_-]+)/([a-zA-Z0-9_.-]+)/?$')

LIVE_URL_REGEX = re.compile(r'^https?://[a-zA-Z0-9_.-]+(?::\d+)?(?:/[a-zA-Z0-9_.-]*)*\/?$')



# --- 1. PYSPARK SINGLETON INITIALIZER ---

def get_spark_session():

    global _spark_session

    if _spark_session is None:

        with _spark_lock:

            if _spark_session is None:

                try:

                    from pyspark.sql import SparkSession

                    _spark_session = SparkSession.builder \
                        .appName("AdminDocumentCatalog") \
                        .master("local[*]") \
                        .config("spark.sql.warehouse.dir", "/tmp/spark-warehouse") \
                        .getOrCreate()

                    _spark_session.sparkContext.setLogLevel("ERROR")

                except Exception as e:

                    print(f"[PySpark Engine] Offline or unconfigured: {e}")

    return _spark_session



# --- 2. DEFENSIVE CYBERSECURITY MODULES ---

ip_requests = defaultdict(list)

rate_limiter_lock = threading.Lock()



def is_rate_limited(ip_address, limit=3, period=60):

    now = time.time()

    with rate_limiter_lock:

        ip_requests[ip_address] = [t for t in ip_requests[ip_address] if now - t < period]

        if len(ip_requests[ip_address]) >= limit:

            return True

        ip_requests[ip_address].append(now)

        return False



def send_async_notifications(name, email_address, message):

    send_email_notification(name, email_address, message)

    send_sms_notification(name, email_address)



# --- 3. UNIFIED ERROR HANDLER & STATUS CODES ---

def make_error_response(error_code, message, status_code):

    return jsonify({

        'success': False,

        'error': {

            'code': error_code,

            'message': message

        }

    }), status_code



# --- 3b. GLOBAL API JSON ERROR HANDLERS ---

@app.errorhandler(400)

def bad_request_handler(e):

    if request.path.startswith('/api/'):

        return make_error_response("BAD_REQUEST", str(e.description or e), 400)

    return e



@app.errorhandler(404)

def not_found_handler(e):

    if request.path.startswith('/api/'):

        return make_error_response("NOT_FOUND", "The requested API resource does not exist.", 404)

    return e



@app.errorhandler(405)

def method_not_allowed_handler(e):

    if request.path.startswith('/api/'):

        return make_error_response("METHOD_NOT_ALLOWED", "HTTP method is not supported for this endpoint.", 405)

    return e



@app.errorhandler(429)

def too_many_requests_handler(e):

    if request.path.startswith('/api/'):

        return make_error_response("RATE_LIMIT_EXCEEDED", "Too many requests. Please wait.", 429)

    return e



@app.errorhandler(500)

def internal_server_error_handler(e):

    if request.path.startswith('/api/'):

        return make_error_response("INTERNAL_ERROR", "A fatal server error occurred.", 500)

    return e



# --- 4b. AUTHENTICATION & ACCESS TOKEN HANDLERS ---

def check_authentication():

    # A. Validate admin cookie session

    if session.get('admin_logged_in'):

        return True



    # B. Validate Bearer Access Token in Authorization header

    auth_header = request.headers.get('Authorization')

    if auth_header and auth_header.startswith('Bearer '):

        token = auth_header.split(' ')[1]

        configured_token = os.environ.get("API_ACCESS_TOKEN")

        if configured_token and token == configured_token:

            return True



    return False



def require_admin():

    def decorator(f):

        @functools.wraps(f)

        def wrapped(*args, **kwargs):

            if not check_authentication():

                return make_error_response("UNAUTHORIZED", "Access denied. Valid session or Bearer token is required.", 401)

            return f(*args, **kwargs)

        return wrapped

    return decorator



# --- 4c. REUSABLE API RATE LIMITING DECORATOR ---

def rate_limit(limit=10, period=60):

    def decorator(f):

        @functools.wraps(f)

        def wrapped(*args, **kwargs):

            client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)

            if client_ip and ',' in client_ip:

                client_ip = client_ip.split(',')[0].strip()



            if is_rate_limited(client_ip, limit, period):

                response = jsonify({

                    'success': False,

                    'error': {

                        'code': 'RATE_LIMIT_EXCEEDED',

                        'message': 'Too many requests. Please slow down.'

                    }

                })

                response.headers['Retry-After'] = str(period)

                response.headers['X-RateLimit-Limit'] = str(limit)

                response.headers['X-RateLimit-Remaining'] = '0'

                return response, 429

            return f(*args, **kwargs)

        return wrapped

    return decorator



# --- 4d. REUSABLE POST IDEMPOTENCY DECORATOR ---

def idempotent():

    def decorator(f):

        @functools.wraps(f)

        def wrapped(*args, **kwargs):

            idempotency_key = request.headers.get('X-Idempotency-Key')

            if idempotency_key:

                cached_res = check_idempotency_key(idempotency_key)

                if cached_res:

                    if isinstance(cached_res, tuple):

                        return jsonify(cached_res[0]), cached_res[1]

                    return jsonify(cached_res), 200



            res = f(*args, **kwargs)



            if idempotency_key:

                status_code = 200

                if isinstance(res, tuple):

                    res_body, status_code = res

                else:

                    res_body = res



                if hasattr(res_body, 'get_json'):

                    payload = res_body.get_json()

                elif isinstance(res_body, dict):

                    payload = res_body

                else:

                    payload = res_body



                save_idempotency_key(idempotency_key, (payload, status_code))

            return res

        return wrapped

    return decorator





# --- 4. IDEMPOTENCY KEY CHECKER ---

def check_idempotency_key(key):

    now = time.time()

    with idempotency_lock:

        # Clean cached keys older than 10 minutes (600 seconds)

        for k in list(idempotency_cache.keys()):

            if now - idempotency_cache[k]['timestamp'] > 600:

                del idempotency_cache[k]



        if key in idempotency_cache:

            return idempotency_cache[key]['response']

    return None



def save_idempotency_key(key, response):

    with idempotency_lock:

        idempotency_cache[key] = {

            'timestamp': time.time(),

            'response': response

        }



# --- 5. ENCRYPTED DATASET MANAGER (WITH THREAD LOCKS & DISK CACHING) ---

class EncryptedDocumentCatalog:

    def __init__(self, file_path, encryption_key):

        self.file_path = file_path

        self.fernet = Fernet(encryption_key.encode('utf-8')) if encryption_key else None

        self.lock = threading.Lock()



    def read_catalog(self):

        """Reads and decrypts the Parquet catalog metadata into a Pandas DataFrame."""

        with self.lock:

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

        with self.lock:

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



                # Invalidate cache on write

                global _catalog_cache

                _catalog_cache = None

                return True

            except Exception as e:

                print(f"Error writing/encrypting catalog: {e}")

                return False



    def load_with_pyspark(self):

        """Loads the decrypted catalog into PySpark using singleton Session context."""

        try:

            spark = get_spark_session()

            if spark is None:

                return None



            df_pd = get_cached_catalog(self)

            if df_pd.empty:

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



            return spark.createDataFrame(df_pd)

        except Exception as e:

            print(f"[PySpark Engine] Catalog conversion failed: {e}")

            return None



def get_cached_catalog(catalog_manager):

    global _catalog_cache, _catalog_cache_mtime

    filepath = catalog_manager.file_path

    if not os.path.exists(filepath):

        return pd.DataFrame(columns=["id", "filename", "path", "category", "size_bytes", "uploaded_at"])



    mtime = os.path.getmtime(filepath)

    with _catalog_cache_lock:

        if _catalog_cache is None or mtime > _catalog_cache_mtime:

            _catalog_cache = catalog_manager.read_catalog()

            _catalog_cache_mtime = mtime

        return _catalog_cache.copy()



CATALOG_PATH = os.path.join(app.root_path, "static", "assets", "document_catalog.parquet.enc")

DB_KEY = os.environ.get("DB_ENCRYPTION_KEY")



catalog_manager = EncryptedDocumentCatalog(CATALOG_PATH, DB_KEY)



# --- 6. STANDARD TEMPLATE RENDERING ---

@app.route('/')

@app.route('/about')

@app.route('/skills')

@app.route('/experience')

@app.route('/projects')

@app.route('/certifications')

@app.route('/contact')

def home():

    return render_template('index.html')



@app.route('/download/<path:filename>')

def download_file(filename):

    if ".." in filename or filename.startswith('/') or filename.startswith('.'):

        return make_error_response("ACCESS_DENIED", "Access denied to parent files.", 403)



    rel_path = filename

    if rel_path.startswith("static/assets/"):

        rel_path = rel_path[len("static/assets/"):]

    elif rel_path.startswith("assets/"):

        rel_path = rel_path[len("assets/"):]



    base_dir = os.path.join(app.root_path, 'static', 'assets')

    full_path = os.path.abspath(os.path.join(base_dir, rel_path))



    if not full_path.startswith(os.path.abspath(base_dir)):

        return make_error_response("ACCESS_DENIED", "Access denied to parent files.", 403)



    if not os.path.exists(full_path) or os.path.isdir(full_path):

        return make_error_response("RESOURCE_NOT_FOUND", "The requested document was not found.", 404)



    file_dir = os.path.dirname(full_path)

    file_name = os.path.basename(full_path)

    return send_from_directory(file_dir, file_name, as_attachment=True)



# Helper function to send email notification

def send_email_notification(name, email_address, message):

    sender_email = os.environ.get('SMTP_EMAIL_USER')

    sender_password = os.environ.get('SMTP_EMAIL_PASS')

    smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')

    smtp_port = int(os.environ.get('SMTP_PORT', '587'))

    recipient_email = 'krishna.official.gupta@gmail.com'



    if not sender_email or not sender_password:

        return False



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

        return False



    clean_name = "".join(c for c in name if c not in "\r\n")

    clean_email = "".join(c for c in email_address if c not in "\r\n")



    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"

    data = {

        'From': twilio_number,

        'To': recipient_number,

        'Body': f"Alert: You received a new portfolio message from {clean_name} ({clean_email}). Check your mail!"

    }



    try:

        response = requests.post(url, data=data, auth=(account_sid, auth_token), timeout=5)

        return response.status_code in [200, 201]

    except Exception as e:

        print(f"Error sending SMS: {e}")

        return False



# API Endpoint to handle contact form submissions

@app.route('/api/contact', methods=['POST'])

@rate_limit(limit=3, period=60)

def contact():



    try:

        data = request.get_json()

        if not data:

            return make_error_response("INVALID_REQUEST", "No payload provided.", 400)



        name = data.get('name')

        email = data.get('email')

        message = data.get('message')



        if not all([name, email, message]):

            return make_error_response("VALIDATION_ERROR", "All fields are required.", 400)



        if len(name) > 100 or len(email) > 100 or len(message) > 5000:

            return make_error_response("VALIDATION_ERROR", "Payload size limit exceeded.", 400)



        notification_thread = threading.Thread(

            target=send_async_notifications,

            args=(name, email, message)

        )

        notification_thread.daemon = True

        notification_thread.start()



        return jsonify({

            'success': True,

            'message': 'Message received! Processing in the background.'

        }), 200

    except Exception as e:

        return make_error_response("INTERNAL_ERROR", str(e), 500)



# --- 7. BACKEND CHATBOT API ENGINE ---

try:

    import google.generativeai as genai

    HAS_GEMINI = True

except ImportError:

    HAS_GEMINI = False



if HAS_GEMINI:

    gemini_key = os.environ.get("GEMINI_API_KEY")

    if gemini_key:

        genai.configure(api_key=gemini_key)

    else:

        HAS_GEMINI = False



KRISHNA_KNOWLEDGE = {

    "summary": """

    Krishna Gupta is a Data Science B.Tech student at the Oriental Institute of Science and Technology, Bhopal (Class of 2027).

    Aspiring Data Scientist, AI/ML Engineer, LLM Engineer, Data Engineer, and Software Engineer.

    """,

    "personal": "DOB: 17th October, 2005. Age: 20 years old (turns 21 on October 17, 2026).",

    "education": "B.Tech Data Science (2023 - 2027) at Oriental Institute of Science and Technology, Bhopal.",

    "experience": """

    Ethara AI (Feb 2026 - May 2026) | LLM Post Training Intern (Remote): Evaluated 50,000+ LLM outputs, built python scripts.

    Kanchan Pvt Ltd (Oct 2025 - Feb 2026) | Full Stack Development Intern: Developed RevU Social.

    """,

    "projects": """

    KALKI 1.5 (Python, PyTorch, Multi-Agents, Hybrid RAG)

    RevU Social (React, Node.js, Express, MySQL, PostgreSQL)

    ShelfScanner (Gemini Vision API, WebRTC, PySpark, Argon2id, Fernet)

    """,

    "skills": "Python, SQL, JavaScript, C++, PySpark, LangChain, LangGraph, RAG, React.js, Flask, PostgreSQL.",

    "certifications": "AWS Certified Developer Associate (2026), IBM Machine Learning (2026), HP LIFE Data Science (2026).",

    "contact": "Email: krishna.official.gupta@gmail.com | Phone: +91-9993153109 | GitHub: KGupta171025"

}





class LocalAIAgent:

    def __init__(self, knowledge):

        self.knowledge = knowledge

        import math

        import re

        self.math = math

        self.re = re



        # Define canonical queries mapped to categories

        self.canonicals = {

            'personal': [

                "when is krishna born",

                "what is krishna's date of birth",

                "how old is krishna gupta",

                "age of krishna",

                "dob of krishna",

                "krishna birth date"

            ],

            'summary': [

                "who is krishna",

                "tell me about krishna",

                "describe krishna gupta",

                "portfolio summary",

                "biography profile"

            ],

            'skills': [

                "what are krishna's skills",

                "krishna's core technical stack",

                "programming languages and tools",

                "ai and ml expertise",

                "technologies programming python database"

            ],

            'experience': [

                "tell me about krishna's experience",

                "where did krishna intern",

                "professional work history",

                "ethara ai internship",

                "kanchan pvt ltd",

                "job history work background"

            ],

            'projects': [

                "show me krishna's projects",

                "kalki 1.5",

                "revu social",

                "shelfscanner",

                "showcase projects github link"

            ],

            'certifications': [

                "aws developer certificate",

                "ibm machine learning with python",

                "certifications and credentials",

                "download certificates credentials course"

            ],

            'contact': [

                "how can i contact krishna",

                "email address and phone number",

                "social links github linkedin",

                "hire krishna resume download"

            ]

        }



        # Simple stop words

        self.stopwords = {'a', 'an', 'the', 'is', 'are', 'was', 'were', 'and', 'or', 'of', 'in', 'on', 'to', 'for', 'with', 'about', 'how', 'what', 'when', 'who', 'where', 'why', 'his', 'him', 'he'}



        # Build vocabulary and precompute TF-IDF vectors for all canonicals

        all_texts = []

        for cat, queries in self.canonicals.items():

            all_texts.extend(queries)



        # Fit Vocabulary & compute document frequency (DF)

        self.df = {}

        for text in all_texts:

            words = self._tokenize(text)

            for w in set(words):

                self.df[w] = self.df.get(w, 0) + 1



        self.total_docs = len(all_texts)

        self.vocabulary = list(self.df.keys())



        # Precompute vectors for categories

        self.category_vectors = {}

        for cat, queries in self.canonicals.items():

            vectors = []

            for query in queries:

                vectors.append(self._vectorize(query))

            self.category_vectors[cat] = vectors



    def _tokenize(self, text):

        words = self.re.findall(r'\b[a-z0-9_.-]+\b', text.lower())

        return [w for w in words if w not in self.stopwords]



    def _vectorize(self, text):

        words = self._tokenize(text)

        vector = {}

        for w in words:

            if w in self.df:

                tf = words.count(w)

                idf = self.math.log((1 + self.total_docs) / (1 + self.df[w])) + 1

                vector[w] = tf * idf

        return vector



    def _cosine_similarity(self, vec1, vec2):

        dot_product = 0.0

        for w in vec1:

            if w in vec2:

                dot_product += vec1[w] * vec2[w]



        mag1 = self.math.sqrt(sum(val * val for val in vec1.values()))

        mag2 = self.math.sqrt(sum(val * val for val in vec2.values()))



        if mag1 == 0.0 or mag2 == 0.0:

            return 0.0



        return dot_product / (mag1 * mag2)



    def get_response(self, user_message):

        user_vec = self._vectorize(user_message)

        if not user_vec:

            return self._fallback_keyword_check(user_message)



        best_cat = None

        best_score = 0.0



        for cat, vectors in self.category_vectors.items():

            for vec in vectors:

                score = self._cosine_similarity(user_vec, vec)

                if score > best_score:

                    best_score = score

                    best_cat = cat



        # ML similarity threshold: 0.22

        if best_score >= 0.22:

            print(f"[Semantic AI Local Agent] Matched Category: {best_cat} with score: {best_score:.4f}")

            return self.knowledge[best_cat]



        return "I am Krishna's portfolio assistant. You can ask me about his skills, experience, projects, or certifications."



    def _fallback_keyword_check(self, user_message):

        msg = user_message.lower().strip()

        if any(w in msg for w in ["dob", "birth", "born", "age", "how old"]):

            return self.knowledge['personal']

        elif any(w in msg for w in ["who is", "about", "profile", "summary"]):

            return self.knowledge['summary']

        elif any(w in msg for w in ["skill", "tech", "languages", "programming"]):

            return self.knowledge['skills']

        elif any(w in msg for w in ["work", "experience", "job", "intern"]):

            return self.knowledge['experience']

        elif any(w in msg for w in ["project", "kalki", "revu", "scanner"]):

            return self.knowledge['projects']

        elif any(w in msg for w in ["certificat", "credential", "aws", "ibm"]):

            return self.knowledge['certifications']

        elif any(w in msg for w in ["contact", "email", "phone", "linkedin"]):

            return self.knowledge['contact']

        return "I am Krishna's portfolio assistant. You can ask me about his skills, experience, projects, or certifications."





local_agent = LocalAIAgent(KRISHNA_KNOWLEDGE)



# Server-side conversation history tracking (thread-safe context memory)

chat_histories = {}

chat_histories_lock = threading.Lock()



def query_gemini_model(prompt, chat_id):

    if not HAS_GEMINI:

        return None

    try:

        # Load active documents from the catalog using PySpark or Pandas

        docs_metadata = []

        try:

            spark_df = catalog_manager.load_with_pyspark()

            if spark_df is not None:

                rows = [r.asDict() for r in spark_df.collect()]

            else:

                df = get_cached_catalog(catalog_manager)

                rows = df.to_dict(orient='records')



            for r in rows:

                filename = r.get('filename')

                category = r.get('category')

                path = r.get('path')

                docs_metadata.append(f"- Category: {category} | Name: {filename} | Direct Download URL: /download/{path}")

        except Exception as err:

            print(f"RAG Catalog load failed: {err}")



        docs_context = "\n".join(docs_metadata) if docs_metadata else "- No document attachments currently registered."



        system_instruction = f"""

        You are Krishna Gupta's personal Portfolio AI Agent, a sophisticated and helpful assistant.

        Your goal is to answer visitors' queries about Krishna's background, education, projects, skills, experience, and certifications.



        Krishna's Profile Context:

        {KRISHNA_KNOWLEDGE}



        Registered Documents & Digital Credentials:

        When visitors ask to download, view, or verify his certifications, credentials, or resume, you MUST directly supply the download URL from this database:

        {docs_context}



        Response Rules:

        1. Tone & Style: Be enthusiastic, professional, and clear.

        2. Markdown Formatting: Use bolding, bullet points, and clean lists to make responses highly readable. Render download links as clean markdown links, e.g., [Download AWS Certificate](/download/static/assets/certificates/AWS_Certified_Developer.pdf).

        3. Accurate & Factual: Answer strictly based on the profile context. If asked about something not present in the context, politely mention that you do not have that information but can assist with his projects, skills, or experience.

        4. Structured Output: Keep responses concise (under 150 words) unless the user asks for deep technical details.

        """



        # Reconstruct historical conversation turns for Gemini Chat API

        formatted_history = []

        with chat_histories_lock:

            history = chat_histories.get(chat_id, [])

            for msg in history:

                formatted_history.append({

                    "role": "user" if msg["role"] == "user" else "model",

                    "parts": [msg["text"]]

                })



        model = genai.GenerativeModel('gemini-1.5-flash', system_instruction=system_instruction)

        chat = model.start_chat(history=formatted_history)

        response = chat.send_message(prompt)



        # Append latest turn to history

        with chat_histories_lock:

            if chat_id not in chat_histories:

                chat_histories[chat_id] = []

            chat_histories[chat_id].append({"role": "user", "text": prompt})

            chat_histories[chat_id].append({"role": "model", "text": response.text})

            # Bound history to last 12 turns (6 Q&A pairs) to limit context size

            if len(chat_histories[chat_id]) > 12:

                chat_histories[chat_id] = chat_histories[chat_id][-12:]



        return response.text

    except Exception as e:

        print(f"Error querying Gemini API: {e}")

        return None

@app.route('/api/chat', methods=['POST'])

@rate_limit(limit=10, period=60)

def chat():

    try:

        data = request.get_json()

        if not data or 'message' not in data:

            return make_error_response("INVALID_REQUEST", "No query provided.", 400)



        user_message = data.get('message')

        if len(user_message) > 500:

            return make_error_response("VALIDATION_ERROR", "Message query exceeds character limits.", 400)



        # Generate unique thread session ID for memory context

        if 'chat_id' not in session:

            session['chat_id'] = str(uuid.uuid4())

        chat_id = session['chat_id']



        ai_response = query_gemini_model(user_message, chat_id)

        if not ai_response:

            ai_response = local_agent.get_response(user_message)



        return jsonify({

            'success': True,

            'message': ai_response

        }), 200

    except Exception as e:

        return make_error_response("INTERNAL_ERROR", str(e), 500)



# --- 8. SECURE ADMIN ROUTINGS & VERSIONED API CONTROLLERS ---



@app.route('/private')

def private_dashboard():

    logged_in = session.get('admin_logged_in') is True

    return render_template('private.html', logged_in=logged_in)



# Aliases for V1 API login & authentication

@app.route('/api/admin/login', methods=['POST'])

def old_login():

    return admin_login()



@app.route('/api/admin/logout', methods=['POST'])

def old_logout():

    return admin_logout()



@app.route('/api/v1/admin/login', methods=['POST'])

@app.route('/api/admin/login', methods=['POST'])

@rate_limit(limit=5, period=60)

def admin_login():

    try:

        data = request.get_json()

        if not data:

            return make_error_response("INVALID_REQUEST", "Username and password required.", 400)



        username = data.get('username')

        password = data.get('password')



        if not username or not password:

            return make_error_response("VALIDATION_ERROR", "Username and password required.", 400)



        stored_user_hash = os.environ.get("ADMIN_USERNAME_HASH")

        input_user_hash = hashlib.sha256(username.encode('utf-8')).hexdigest()



        if input_user_hash != stored_user_hash:

            PasswordHasher().hash("dummy_password")  # Defend against timing leaks

            return make_error_response("UNAUTHORIZED", "Invalid admin credentials.", 401)



        stored_pass_hash = os.environ.get("ADMIN_PASSWORD_HASH")

        ph = PasswordHasher()

        try:

            ph.verify(stored_pass_hash, password)

        except Exception:

            return make_error_response("UNAUTHORIZED", "Invalid admin credentials.", 401)



        session['admin_logged_in'] = True

        return jsonify({'success': True, 'message': 'Access granted.'}), 200

    except Exception as e:

        return make_error_response("INTERNAL_ERROR", str(e), 500)



@app.route('/api/v1/admin/logout', methods=['POST'])

def admin_logout():

    session.pop('admin_logged_in', None)

    return jsonify({'success': True, 'message': 'Session terminated.'}), 200



# V1 Document Catalog API (with support for Pagination and Disk Cache)

@app.route('/api/v1/admin/documents', methods=['GET'])

@app.route('/api/admin/documents', methods=['GET'])

@require_admin()

def admin_list_documents():



    try:

        # Load catalog metadata

        spark_df = catalog_manager.load_with_pyspark()



        if spark_df is not None:

            rows = [r.asDict() for r in spark_df.collect()]

            engine = "PySpark Session Singleton Active"

        else:

            df = get_cached_catalog(catalog_manager)

            rows = df.to_dict(orient='records')

            engine = "Pandas Native Decryption (Spark offline)"



        # Implement pagination (GET /api/v1/admin/documents?page=1&limit=10)

        try:

            page = int(request.args.get('page', 1))

            limit = int(request.args.get('limit', 50))

        except ValueError:

            page = 1

            limit = 50



        total_records = len(rows)

        start_idx = (page - 1) * limit

        end_idx = start_idx + limit

        paginated_rows = rows[start_idx:end_idx]



        return jsonify({

            'success': True,

            'engine': engine,

            'pagination': {

                'page': page,

                'limit': limit,

                'total': total_records,

                'pages': (total_records + limit - 1) // limit

            },

            'documents': paginated_rows

        }), 200

    except Exception as e:

        return make_error_response("INTERNAL_ERROR", str(e), 500)



# V1 Document Upload API (incorporating Idempotency verification)

@app.route('/api/v1/admin/documents/upload', methods=['POST'])

@app.route('/api/admin/documents/upload', methods=['POST'])

@require_admin()

@idempotent()

def admin_upload_document():



    try:

        if 'file' not in request.files:

            return make_error_response("INVALID_REQUEST", "No file segment found.", 400)



        file = request.files['file']

        category = request.form.get('category', 'Other')



        if file.filename == '':

            return make_error_response("VALIDATION_ERROR", "No selected file.", 400)



        filename = secure_filename(file.filename)



        if category == 'Resume':

            dest_dir = os.path.join(app.root_path, 'static', 'assets')

        elif category == 'Certificate':

            dest_dir = os.path.join(app.root_path, 'static', 'assets', 'certificates')

        else:

            dest_dir = os.path.join(app.root_path, 'static', 'assets')



        os.makedirs(dest_dir, exist_ok=True)

        file_path = os.path.join(dest_dir, filename)

        file.save(file_path)



        # Update Parquet Catalog

        df = catalog_manager.read_catalog()

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

            for col in df.columns:

                df.at[existing_idx[0], col] = new_record[col]

            action = "Replaced"

        else:

            df = pd.concat([df, pd.DataFrame([new_record])], ignore_index=True)

            action = "Added"



        catalog_manager.write_catalog(df)



        response_payload = {

            'success': True,

            'message': f"Document successfully {action.lower()} and cataloged.",

            'document': new_record

        }



        return jsonify(response_payload), 200



    except Exception as e:

        return make_error_response("INTERNAL_ERROR", str(e), 500)



# V1 Document Deletion API

@app.route('/api/v1/admin/documents/delete', methods=['POST'])

@app.route('/api/admin/documents/delete', methods=['POST'])

@require_admin()

def admin_delete_document():



    try:

        data = request.get_json()

        if not data or 'id' not in data:

            return make_error_response("VALIDATION_ERROR", "Document ID is required.", 400)



        doc_id = data.get('id')

        df = catalog_manager.read_catalog()

        doc_record = df[df['id'] == doc_id]



        if doc_record.empty:

            return make_error_response("RESOURCE_NOT_FOUND", "Document not found in catalog.", 404)



        rel_path = doc_record.iloc[0]['path']

        abs_path = os.path.join(app.root_path, rel_path.replace('/', os.path.sep))



        if os.path.exists(abs_path):

            os.remove(abs_path)



        df = df[df['id'] != doc_id]

        catalog_manager.write_catalog(df)



        return jsonify({'success': True, 'message': 'Document successfully removed.'}), 200

    except Exception as e:

        return make_error_response("INTERNAL_ERROR", str(e), 500)



# V1 List Showcase Projects

@app.route('/api/v1/admin/projects', methods=['GET'])

@app.route('/api/admin/projects', methods=['GET'])

@require_admin()

def admin_list_projects():

    try:

        projects = get_existing_projects()

        response_data = []

        for p in projects:

            response_data.append({

                "id": p["id"],

                "name": p["name"],

                "github_link": p["github_link"],

                "live_link": p["live_link"]

            })

        return jsonify({'success': True, 'projects': response_data}), 200

    except Exception as e:

        return make_error_response("INTERNAL_ERROR", str(e), 500)



# V1 Add & Auto-Generate Project Card (incorporating SSRF validation, Caching, and Git Locks)

@app.route('/api/v1/admin/projects/add', methods=['POST'])

@app.route('/api/admin/projects/add', methods=['POST'])

@require_admin()

@idempotent()

def admin_add_project():



    try:

        data = request.get_json()

        if not data:

            return make_error_response("INVALID_REQUEST", "No payload provided.", 400)



        github_link = data.get('github_link', '').strip()

        live_link = data.get('live_link', '').strip()



        if not github_link or not live_link:

            return make_error_response("VALIDATION_ERROR", "GitHub link and Live link are required.", 400)



        # Secure URL Formatting & SSRF Validation Check

        github_match = GITHUB_URL_REGEX.match(github_link)

        if not github_match:

            return make_error_response("VALIDATION_ERROR", "Invalid GitHub link. Must match format 'https://github.com/owner/repo'.", 400)



        if not LIVE_URL_REGEX.match(live_link):

            return make_error_response("VALIDATION_ERROR", "Invalid Live Demo link. Must be a valid HTTP/HTTPS URL.", 400)



        owner = github_match.group(1)

        repo = github_match.group(2)



        # Query GitHub with strict request timeout

        headers = {'User-Agent': 'Krishna-Portfolio-Server'}

        meta_url = f"https://api.github.com/repos/{owner}/{repo}"



        try:

            meta_res = requests.get(meta_url, headers=headers, timeout=5)

            repo_desc = meta_res.json().get('description', '') if meta_res.status_code == 200 else ""

        except Exception:

            repo_desc = ""



        readme_url = f"https://raw.githubusercontent.com/{owner}/{repo}/main/README.md"

        try:

            readme_res = requests.get(readme_url, headers=headers, timeout=5)

            if readme_res.status_code != 200:

                readme_url = f"https://raw.githubusercontent.com/{owner}/{repo}/master/README.md"

                readme_res = requests.get(readme_url, headers=headers, timeout=5)

            readme_content = readme_res.text if readme_res.status_code == 200 else ""

        except Exception:

            readme_content = ""



        # Default fallbacks

        proj_name = repo.replace('-', ' ').title()

        proj_category = "Software Engineering"

        proj_desc = repo_desc if repo_desc else "A software project hosted on GitHub."

        proj_stack = ["GitHub", "Git", "Software", "Python"]



        # Call Gemini model

        if HAS_GEMINI:

            try:

                prompt = f"""

                You are an expert software portfolio architect.

                Analyze the following GitHub repository details:

                - Repository: {owner}/{repo}

                - Description: {repo_desc}

                - README content: {readme_content[:3000]}



                Create a professional structured project card details in JSON format.

                The JSON must contain the exact keys:

                1. "name": A clean, concise title for the project card. Max 30 chars.

                2. "category": A professional portfolio category. Max 40 chars.

                3. "description": A highly engaging 2-3 sentence overview description. Max 250 chars.

                4. "stack": An array of exactly 4 relevant technologies.



                Return ONLY the raw JSON string with no markdown formatting.

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

                print(f"Gemini API failure: {gem_err}")



        # Render HTML block

        stack_spans = "".join([f"<span>{tech}</span>" for tech in proj_stack])



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



        # Update all 7 HTML pages

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



        # Trigger Git push serialized by global lock

        git_success = False

        with git_lock:

            try:

                import subprocess

                subprocess.run(["git", "add", "."], cwd=app.root_path, check=True)

                subprocess.run(["git", "commit", "--no-gpg-sign", "-m", f"Automated project card: Add {proj_name}"], cwd=app.root_path, check=True)

                subprocess.run(["git", "push", "origin", "main"], cwd=app.root_path, check=True)

                git_success = True

            except Exception as git_err:

                print(f"Git auto-push failure: {git_err}")



        status_msg = f"Project '{proj_name}' successfully added."

        if git_success:

            status_msg += " Pushed live on GitHub Pages!"

        else:

            status_msg += " (Local files updated; Git push failed/skipped)."



        response_payload = {

            'success': True,

            'message': status_msg,

            'project': {

                'name': proj_name,

                'category': proj_category,

                'description': proj_desc,

                'stack': proj_stack

            }

        }



        return jsonify(response_payload), 200



    except Exception as e:

        return make_error_response("INTERNAL_ERROR", str(e), 500)



# V1 Delete Showcase Project (with Git Locks)

@app.route('/api/v1/admin/projects/delete', methods=['POST'])

@app.route('/api/admin/projects/delete', methods=['POST'])

@require_admin()

def admin_delete_project():

    try:

        data = request.get_json()

        if not data or 'name' not in data:

            return make_error_response("VALIDATION_ERROR", "Project name is required.", 400)



        proj_name = data.get('name')



        html_files = ["index.html", "about.html", "projects.html", "skills.html", "experience.html", "certifications.html", "contact.html"]

        removed_count = 0

        for filename in html_files:

            filepath = os.path.join(app.root_path, filename)

            if os.path.exists(filepath):

                if remove_project_from_file(filepath, proj_name):

                    removed_count += 1



        if removed_count == 0:

            return make_error_response("RESOURCE_NOT_FOUND", f"Project '{proj_name}' not found.", 404)



        # Trigger Git push serialized by global lock

        git_success = False

        with git_lock:

            try:

                import subprocess

                subprocess.run(["git", "add", "."], cwd=app.root_path, check=True)

                subprocess.run(["git", "commit", "--no-gpg-sign", "-m", f"Automated project card: Delete {proj_name}"], cwd=app.root_path, check=True)

                subprocess.run(["git", "push", "origin", "main"], cwd=app.root_path, check=True)

                git_success = True

            except Exception as git_err:

                print(f"Git auto-push failure: {git_err}")



        msg = f"Project '{proj_name}' removed from all {removed_count} pages."

        if git_success:

            msg += " Changes pushed live!"

        else:

            msg += " (Local files updated; Git push failed/skipped)."



        return jsonify({'success': True, 'message': msg}), 200

    except Exception as e:

        return make_error_response("INTERNAL_ERROR", str(e), 500)



# V1 Update Showcase Project Links (with Git Locks)

@app.route('/api/v1/admin/projects/update', methods=['POST'])

@app.route('/api/admin/projects/update', methods=['POST'])

@require_admin()

def admin_update_project():

    try:

        data = request.get_json()

        if not data or not all(k in data for k in ['name', 'github_link', 'live_link']):

            return make_error_response("VALIDATION_ERROR", "Project name, github_link, and live_link are required.", 400)



        proj_name = data.get('name')

        new_github = data.get('github_link').strip()

        new_live = data.get('live_link').strip()



        # Validate URL formats

        github_match = GITHUB_URL_REGEX.match(new_github)

        if not github_match:

            return make_error_response("VALIDATION_ERROR", "Invalid GitHub link. Must match format 'https://github.com/owner/repo'.", 400)



        if not LIVE_URL_REGEX.match(new_live):

            return make_error_response("VALIDATION_ERROR", "Invalid Live Demo link. Must be a valid HTTP/HTTPS URL.", 400)



        html_files = ["index.html", "about.html", "projects.html", "skills.html", "experience.html", "certifications.html", "contact.html"]

        updated_count = 0

        for filename in html_files:

            filepath = os.path.join(app.root_path, filename)

            if os.path.exists(filepath):

                if update_project_links_in_file(filepath, proj_name, new_github, new_live):

                    updated_count += 1



        if updated_count == 0:

            return make_error_response("RESOURCE_NOT_FOUND", f"Project '{proj_name}' not found.", 404)



        # Trigger Git push serialized by global lock

        git_success = False

        with git_lock:

            try:

                import subprocess

                subprocess.run(["git", "add", "."], cwd=app.root_path, check=True)

                subprocess.run(["git", "commit", "--no-gpg-sign", "-m", f"Automated project card: Update links for {proj_name}"], cwd=app.root_path, check=True)

                subprocess.run(["git", "push", "origin", "main"], cwd=app.root_path, check=True)

                git_success = True

            except Exception as git_err:

                print(f"Git auto-push failure: {git_err}")



        msg = f"Project '{proj_name}' links successfully updated in all {updated_count} pages."

        if git_success:

            msg += " Changes pushed live!"

        else:

            msg += " (Local files updated; Git push failed/skipped)."



        return jsonify({'success': True, 'message': msg}), 200

    except Exception as e:

        return make_error_response("INTERNAL_ERROR", str(e), 500)



# --- 9. OPENAPI SPECIFICATION ENDPOINT (API Self-Documentation) ---

@app.route('/api/openapi.json', methods=['GET'])

@app.route('/api/v1/openapi.json', methods=['GET'])

def get_openapi_spec():

    openapi_spec = {

        "openapi": "3.0.0",

        "info": {

            "title": "Krishna Gupta Portfolio Advanced API",

            "version": "1.0.0",

            "description": "Expert REST APIs with Token-Based Auth, Throttling, Idempotency keys, and Auto-Generation pipelines."

        },

        "servers": [

            {"url": "http://127.0.0.1:5000", "description": "Local Development Server"}

        ],

        "components": {

            "securitySchemes": {

                "BearerAuth": {

                    "type": "http",

                    "scheme": "bearer",

                    "bearerFormat": "JWT/API-Token"

                }

            }

        },

        "paths": {

            "/api/v1/admin/login": {

                "post": {

                    "summary": "Authenticate admin session",

                    "requestBody": {

                        "required": True,

                        "content": {

                            "application/json": {

                                "schema": {

                                    "type": "object",

                                    "properties": {

                                        "username": {"type": "string"},

                                        "password": {"type": "string"}

                                    },

                                    "required": ["username", "password"]

                                }

                            }

                        }

                    },

                    "responses": {

                        "200": {"description": "Authentication successful"},

                        "401": {"description": "Invalid credentials"}

                    }

                }

            },

            "/api/v1/admin/documents": {

                "get": {

                    "summary": "Retrieve document catalog (Paginated)",

                    "security": [{"BearerAuth": []}],

                    "parameters": [

                        {"name": "page", "in": "query", "schema": {"type": "integer"}, "description": "Page offset index"},

                        {"name": "limit", "in": "query", "schema": {"type": "integer"}, "description": "Total records per page"}

                    ],

                    "responses": {

                        "200": {"description": "List of documents returned"},

                        "401": {"description": "Access denied"}

                    }

                }

            },

            "/api/v1/admin/documents/upload": {

                "post": {

                    "summary": "Upload and register document",

                    "security": [{"BearerAuth": []}],

                    "parameters": [

                        {"name": "X-Idempotency-Key", "in": "header", "schema": {"type": "string"}, "required": False}

                    ],

                    "responses": {

                        "200": {"description": "File cataloged successfully"},

                        "401": {"description": "Access denied"}

                    }

                }

            },

            "/api/v1/admin/documents/delete": {

                "post": {

                    "summary": "Delete registered document",

                    "security": [{"BearerAuth": []}],

                    "responses": {

                        "200": {"description": "File deleted successfully"},

                        "401": {"description": "Access denied"}

                    }

                }

            },

            "/api/v1/admin/projects": {

                "get": {

                    "summary": "List all portfolio showcase projects",

                    "security": [{"BearerAuth": []}],

                    "responses": {

                        "200": {"description": "Projects returned successfully"},

                        "401": {"description": "Access denied"}

                    }

                }

            },

            "/api/v1/admin/projects/add": {

                "post": {

                    "summary": "Auto-generate a new showcase project card",

                    "security": [{"BearerAuth": []}],

                    "parameters": [

                        {"name": "X-Idempotency-Key", "in": "header", "schema": {"type": "string"}, "required": False}

                    ],

                    "responses": {

                        "200": {"description": "Showcase card auto-generated"},

                        "401": {"description": "Access denied"}

                    }

                }

            },

            "/api/v1/admin/projects/delete": {

                "post": {

                    "summary": "Delete portfolio showcase project card",

                    "security": [{"BearerAuth": []}],

                    "responses": {

                        "200": {"description": "Project removed successfully"},

                        "401": {"description": "Access denied"}

                    }

                }

            },

            "/api/v1/admin/projects/update": {

                "post": {

                    "summary": "Update portfolio showcase project links",

                    "security": [{"BearerAuth": []}],

                    "responses": {

                        "200": {"description": "Project links updated successfully"},

                        "401": {"description": "Access denied"}

                    }

                }

            }

        }

    }

    return jsonify(openapi_spec), 200



# Helpers to read/write templates (same logic as get_existing_projects but robust for class replacement)

# Helper function to parse all projects from projects.html

def get_existing_projects():

    filepath = os.path.join(app.root_path, "projects.html")

    if not os.path.exists(filepath):

        return []

    with open(filepath, 'r', encoding='utf-8') as f:

        content = f.read()



    import re

    import hashlib

    # Match any project card container block

    card_pattern = r'<div class="project-card-container">.*?</div>\s*</div>\s*</div>'

    cards = re.findall(card_pattern, content, re.DOTALL)



    projects = []

    for card in cards:

        name_match = re.search(r'<h4 class="preview-title">([^<]+)</h4>', card)

        name = name_match.group(1).strip() if name_match else ""



        live_match = re.search(r'<iframe src="([^"]+)"', card)

        live_link = live_match.group(1).strip() if live_match else ""



        git_match = re.search(r'href="([^"]+)"[^>]*aria-label="GitHub"', card)

        if not git_match:

            git_match = re.search(r'aria-label="GitHub"[^>]*href="([^"]+)"', card)

        github_link = git_match.group(1).strip() if git_match else ""



        if name:

            projects.append({

                "id": hashlib.md5(name.encode('utf-8')).hexdigest(),

                "name": name,

                "github_link": github_link,

                "live_link": live_link,

                "raw_html": card

            })

    return projects



# Helper function to remove a project card from a file

def remove_project_from_file(filepath, project_name):

    with open(filepath, 'r', encoding='utf-8') as f:

        content = f.read()



    normalized_content = content.replace('\r\n', '\n')

    pattern = r'(<!--\s*Project:[^*]*?-->\s*)?<div class="project-card-container">.*?</div>\s*</div>\s*</div>'



    matches = list(re.finditer(pattern, normalized_content, re.DOTALL))

    target_match = None

    for m in matches:

        block = m.group(0)

        if f'<h4 class="preview-title">{project_name}</h4>' in block:

            target_match = m

            break



    if target_match:

        start, end = target_match.span()

        new_content = normalized_content[:start] + normalized_content[end:]

        content = new_content.replace('\n', '\r\n')

        with open(filepath, 'w', encoding='utf-8') as f:

            f.write(content)

        return True

    return False



# Helper function to update project links in a file

def update_project_links_in_file(filepath, project_name, new_github, new_live):

    with open(filepath, 'r', encoding='utf-8') as f:

        content = f.read()



    normalized_content = content.replace('\r\n', '\n')

    pattern = r'<div class="project-card-container">.*?</div>\s*</div>\s*</div>'



    matches = list(re.finditer(pattern, normalized_content, re.DOTALL))

    target_match = None

    for m in matches:

        block = m.group(0)

        if f'<h4 class="preview-title">{project_name}</h4>' in block:

            target_match = m

            break



    if target_match:

        block_text = target_match.group(0)

        block_text = re.sub(r'iframe src="[^"]+"', f'iframe src="{new_live}"', block_text)

        block_text = re.sub(r'href="[^"]+"([^>]*aria-label="Live Demo")', f'href="{new_live}"\\1', block_text)

        block_text = re.sub(r'(aria-label="Live Demo"[^>]*)href="[^"]+"', f'\\1href="{new_live}"', block_text)

        block_text = re.sub(r'href="[^"]+"([^>]*aria-label="GitHub")', f'href="{new_github}"\\1', block_text)

        block_text = re.sub(r'(aria-label="GitHub"[^>]*)href="[^"]+"', f'\\1href="{new_github}"', block_text)



        start, end = target_match.span()

        new_content = normalized_content[:start] + block_text + normalized_content[end:]

        content = new_content.replace('\n', '\r\n')

        with open(filepath, 'w', encoding='utf-8') as f:

            f.write(content)

        return True

    return False



if __name__ == '__main__':

    app.run(debug=False, host='127.0.0.1', port=5000)

