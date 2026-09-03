# 🌌 Krishna Gupta — Interactive Web 3D Portfolio

[![Live Demo](https://img.shields.io/badge/Live%20Demo-kgupta.is--a.dev-06b6d4?style=flat-square&logo=google-chrome&logoColor=white)](https://kgupta.is-a.dev)
[![GitHub license](https://img.shields.io/github/license/KGupta171025/Krishna-Gupta-Portfolio?color=818cf8&style=flat-square)](LICENSE)
[![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS%20%7C%20Three.js-0052cc?style=flat-square)](https://github.com/KGupta171025/Krishna-Gupta-Portfolio)
[![Backend Engine](https://img.shields.io/badge/Backend-Flask%20%7C%20Python-3776AB?logo=python&logoColor=white&style=flat-square)](https://github.com/KGupta171025/Krishna-Gupta-Portfolio)
[![Database](https://img.shields.io/badge/Database-Firebase%20Firestore-FFCA28?logo=firebase&logoColor=white&style=flat-square)](https://firebase.google.com/)

A premium, interactive, 3D WebGL-powered portfolio showcasing my expertise in **Data Science, AI/ML Engineering, LLM Post-Training, and Software Development**. This website features modern typography, glassmorphism UI cards, physical 3D animations, hybrid serverless telemetry, and hardened cyberdefense protections.

---

## 🌟 Key Features

### 🎨 Visual & Interaction Design
* **3D Particle Constellation**: Responsive WebGL backdrop rendering floating particle nodes and a rotating wireframe **Torus Knot** that dynamically reacts to mouse movements and page scrolling.
* **Glassmorphic Parallax Cards**: 3D cards equipped with cursor-based perspective tilt, shining light glare overlays, and fluid micro-animations.
* **Scroll-Reveal Engine**: Lazy-load animations powered by the browser's `Intersection Observer` for silky-smooth layouts.

### 🛡️ Double-Shield Contact Security
* **Math Captcha Shield**: Blocks spambots from trigger-spamming transactional API limits.
* **Email Verification (OTP)**: Validates inbox physical existence in real-time by generating a secure 6-digit verification code and sending it to the user via **EmailJS** before unlocking submit actions.
* **Cloud Firestore Storage**: Safe and reliable persistence of all validated inquiries under the `contact_submissions` collection.

### 📊 Real-Time Visitor Analytics
* **Geolocated Analytics Logs**: Automated tracker collecting visitor browser type, OS, screen size, page visited, and approximate geolocation data (IP, City, Country, ISP) powered by a lightweight public API. Saves telemetry directly to Firestore in the `visitor_logs` collection.

### 💻 Backend Cyberdefense Hardening
* **Anti-Denial of Service (DoS)**: High-latency tasks (SMTP, SMS API triggers) are handled asynchronously using worker thread pools.
* **IP Rate Limiter**: Thread-safe sliding window filter allowing a maximum of 3 endpoint hits per 60 seconds per IP.
* **Path Traversal Shield**: Strictly validates and cleans requested files, blocking folder navigation attacks.
* **Production Integrity**: Disabled Flask Werkzeug interactive debug shell, base64 API key obfuscation, and automated client-side HTTPS enforcement.

---

## 📂 Repository Structure

```directory
Krishna-Gupta-Portfolio/
├── .env.example              # Template for local environment variables
├── .gitignore                # Rules for excluded file tracking
├── app.py                    # Hardened local Flask server backend
├── about.html                # About page layout
├── certifications.html       # Official credentials tab
├── contact.html              # Contact form & verification interface
├── experience.html           # Professional experience timeline
├── index.html                # Main landing page
├── projects.html             # Interactive projects tab
├── requirements.txt          # Python dependencies manifest
├── skills.html               # Technical skill levels
├── deployment/               # Server orchestration blueprints
│   ├── monitor_backend.sh    # Linux bash auto-recovery daemon
│   ├── monitor_backend.ps1   # Windows PowerShell recovery supervisor
│   ├── nginx.conf            # Reverse-proxy hardening settings
│   └── portfolio.service     # Systemd system service manager
└── static/
    ├── assets/               # Downloadable certificates and PDF resume
    ├── css/                  # Styling templates & layout stylesheets
    └── js/                   # WebGL logic, Firebase client SDK, and verification
```

---

## 🚀 Running Locally (Windows / Linux)

For detailed local execution, review the private walkthrough document generated at `Local_Windows_Instructions.pdf` (or use the following quick start guide).

### 1. Clone & Set Up Environment
```bash
git clone https://github.com/KGupta171025/Krishna-Gupta-Portfolio.git
cd Krishna-Gupta-Portfolio
```

### 2. Configure Local Environment Variables
Create a local `.env` configuration file from the template:
```bash
copy .env.example .env
```
Update the placeholder configurations inside the `.env` file with your credentials (e.g., SMTP, Twilio parameters, and Gemini API keys) to enable email alerts, SMS forwarding, and AI agent integration.

### 3. Install & Start Server
```bash
pip install -r requirements.txt
python app.py
```
Open **`http://127.0.0.1:5000`** in your browser.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **3D Rendering** | Three.js (r128) | WebGL canvas drawing particle constellations. |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | Responsive responsive UI. |
| **Cloud Services** | Google Firebase, EmailJS | Serverless document storage & transactional OTP mailers. |
| **Server Engine** | Flask, Gunicorn | Lightweight WSGI Python container. |
| **Orchestration** | Nginx, Systemd | Reverse proxy router & service execution guard. |
