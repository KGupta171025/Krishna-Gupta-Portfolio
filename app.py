import os
import streamlit as st
import plotly.graph_objects as go
import numpy as np

# Page Configuration
st.set_page_config(
    page_title="Krishna Gupta | Data Scientist & Developer Portfolio",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS for Advanced UI/UX Styling & Streamlit Element Overrides
st.markdown("""
<style>
    /* Premium Styling */
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }
    
    h1, h2, h3, h4, h5, h6 {
        font-family: 'Outfit', sans-serif;
        font-weight: 700;
    }
    
    /* Full-Page Background Transparency Overrides */
    .stApp {
        background: transparent !important;
    }
    [data-testid="stAppViewContainer"] {
        background: transparent !important;
    }
    [data-testid="stHeader"] {
        background: transparent !important;
    }
    .main {
        background: transparent !important;
    }
    body {
        background-color: #0b0f19 !important; /* Fallback dark theme */
    }
    
    /* Title Gradient */
    .hero-title {
        font-size: 3.8rem !important;
        font-weight: 900 !important;
        background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 5px;
        letter-spacing: -1px;
    }
    
    .hero-tagline {
        font-size: 1.35rem;
        color: #818cf8;
        font-weight: 600;
        margin-bottom: 25px;
        letter-spacing: 0.5px;
    }
    
    /* Glassmorphism Containers with Hover Scaling & Neon Border Reflex */
    .glass-card {
        background: rgba(17, 24, 39, 0.7) !important;
        backdrop-filter: blur(14px) !important;
        -webkit-backdrop-filter: blur(14px) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 16px;
        padding: 26px;
        margin-bottom: 22px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3) !important;
        transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), border-color 0.3s ease, box-shadow 0.3s ease !important;
    }
    
    .glass-card:hover {
        transform: translateY(-5px) !important;
        border-color: rgba(99, 102, 241, 0.3) !important;
        box-shadow: 0 12px 40px 0 rgba(99, 102, 241, 0.18) !important;
    }
    
    /* Stat Badge */
    .stat-number {
        font-size: 2.3rem;
        font-weight: 900;
        color: #6366f1;
        margin-bottom: 0px;
        font-family: 'Outfit', sans-serif;
    }
    .stat-text {
        font-size: 0.85rem;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        font-weight: 600;
    }
    
    /* Technical Lists Custom Bullet point styling */
    .glass-card ul {
        list-style-type: none !important;
        padding-left: 0 !important;
    }
    
    .glass-card ul li {
        position: relative !important;
        padding-left: 22px !important;
        margin-bottom: 12px !important;
        color: #d1d5db !important;
        font-size: 0.95rem !important;
    }
    
    .glass-card ul li::before {
        content: "✦" !important;
        position: absolute !important;
        left: 0 !important;
        color: #6366f1 !important;
        font-weight: bold !important;
    }
    
    /* Advanced Overrides for Streamlit Buttons (Submit & Downloads) */
    .stButton > button, div[data-testid="stDownloadButton"] > button {
        background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%) !important;
        color: white !important;
        font-family: 'Outfit', sans-serif !important;
        font-weight: 700 !important;
        font-size: 0.95rem !important;
        padding: 12px 28px !important;
        border-radius: 30px !important;
        border: none !important;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        box-shadow: 0 4px 15px rgba(79, 70, 229, 0.35) !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        letter-spacing: 0.5px;
    }
    
    .stButton > button:hover, div[data-testid="stDownloadButton"] > button:hover {
        transform: translateY(-2.5px) !important;
        box-shadow: 0 8px 25px rgba(79, 70, 229, 0.55) !important;
        background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%) !important;
    }
    
    .stButton > button:active, div[data-testid="stDownloadButton"] > button:active {
        transform: translateY(0px) !important;
    }
    
    /* Redesign Streamlit Tabs into Pill Glass selectors */
    div[data-baseweb="tab-list"] {
        background: rgba(17, 24, 39, 0.45) !important;
        border-radius: 12px !important;
        padding: 6px !important;
        border: 1px solid rgba(255, 255, 255, 0.05) !important;
        gap: 8px !important;
    }
    
    div[data-baseweb="tab"] {
        color: #9ca3af !important;
        font-family: 'Outfit', sans-serif !important;
        font-weight: 600 !important;
        font-size: 0.95rem !important;
        padding: 10px 20px !important;
        border-radius: 8px !important;
        border: none !important;
        background: transparent !important;
        transition: all 0.3s ease !important;
    }
    
    div[data-baseweb="tab"]:hover {
        color: #fff !important;
        background: rgba(255, 255, 255, 0.04) !important;
    }
    
    div[data-baseweb="tab"][aria-selected="true"] {
        color: #fff !important;
        background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%) !important;
        box-shadow: 0 4px 15px rgba(79, 70, 229, 0.28) !important;
    }
    
    /* Hide default tab line bar */
    div[data-baseweb="tab-highlight"] {
        background-color: transparent !important;
    }
    
    /* Forms, Inputs and Textareas */
    .stTextInput input, .stTextArea textarea {
        background: rgba(17, 24, 39, 0.6) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 10px !important;
        color: #f3f4f6 !important;
        font-family: 'Inter', sans-serif !important;
        padding: 12px 16px !important;
        outline: none !important;
        transition: border-color 0.3s ease, box-shadow 0.3s ease !important;
    }
    
    .stTextInput input:focus, .stTextArea textarea:focus {
        border-color: #6366f1 !important;
        box-shadow: 0 0 10px rgba(99, 102, 241, 0.28) !important;
    }
    
    /* Hide Streamlit Default Elements */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    /* Highlight Badge */
    .cert-badge {
        background-color: rgba(99, 102, 241, 0.15);
        color: #818cf8;
        border: 1px solid rgba(99, 102, 241, 0.25);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        display: inline-block;
        margin-bottom: 8px;
    }
</style>
""", unsafe_allow_html=True)

# Inject Document-Level Three.js 3D WebGL background
st.markdown("""
<div id="three-bg-loader"></div>
<script>
    if (!window.THREE) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = initThreeBG;
        document.head.appendChild(script);
    } else {
        initThreeBG();
    }

    function initThreeBG() {
        if (document.getElementById('three-bg')) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'three-bg';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '-2';
        canvas.style.pointerEvents = 'none';
        document.body.prepend(canvas);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const count = 180;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 15;
            positions[i + 1] = (Math.random() - 0.5) * 15;
            positions[i + 2] = (Math.random() - 0.5) * 15;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 0.08,
            color: 0x818cf8,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        camera.position.z = 6;

        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5);
            mouseY = (e.clientY / window.innerHeight - 0.5);
        });

        function animate() {
            requestAnimationFrame(animate);

            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;

            points.rotation.y += 0.0006;
            points.rotation.x += 0.0003;

            camera.position.x = targetX * 3.5;
            camera.position.y = -targetY * 3.5;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
</script>
""", unsafe_allow_html=True)

# Helper Function to construct the 3D Neural Network Plotly chart
def create_3d_neural_network():
    layers = [5, 8, 8, 3]
    x_nodes = []
    y_nodes = []
    z_nodes = []
    node_text = []
    node_color = []
    node_size = []
    
    layer_names = ["Input Layer", "Hidden Layer 1", "Hidden Layer 2", "Output Layer"]
    layer_colors = ["#10b981", "#6366f1", "#06b6d4", "#f59e0b"]
    
    for layer_idx, num_nodes in enumerate(layers):
        x_val = layer_idx * 4
        y_vals = np.linspace(-3, 3, num_nodes)
        
        for node_idx, y_val in enumerate(y_vals):
            z_val = np.sin(node_idx) * 1.5
            
            x_nodes.append(x_val)
            y_nodes.append(y_val)
            z_nodes.append(z_val)
            
            node_text.append(f"{layer_names[layer_idx]} - Node {node_idx + 1}")
            node_color.append(layer_colors[layer_idx])
            node_size.append(12 if layer_idx in [0, 3] else 10)

    edge_x = []
    edge_y = []
    edge_z = []
    
    node_offsets = [0] + list(np.cumsum(layers))
    
    for layer_idx in range(len(layers) - 1):
        start_curr = node_offsets[layer_idx]
        end_curr = node_offsets[layer_idx + 1]
        
        start_next = node_offsets[layer_idx + 1]
        end_next = node_offsets[layer_idx + 2]
        
        for c_node in range(start_curr, end_curr):
            for n_node in range(start_next, end_next):
                edge_x.extend([x_nodes[c_node], x_nodes[n_node], None])
                edge_y.extend([y_nodes[c_node], y_nodes[n_node], None])
                edge_z.extend([z_nodes[c_node], z_nodes[n_node], None])
                
    edge_trace = go.Scatter3d(
        x=edge_x, y=edge_y, z=edge_z,
        mode='lines',
        line=dict(color='rgba(255, 255, 255, 0.15)', width=1.5),
        hoverinfo='none'
    )
    
    node_trace = go.Scatter3d(
        x=x_nodes, y=y_nodes, z=z_nodes,
        mode='markers',
        marker=dict(
            size=node_size,
            color=node_color,
            opacity=0.9,
            line=dict(color='rgba(255,255,255,0.2)', width=1)
        ),
        text=node_text,
        hoverinfo='text'
    )
    
    layout = go.Layout(
        showlegend=False,
        scene=dict(
            xaxis=dict(showbackground=False, showgrid=False, zeroline=False, showticklabels=False, title=''),
            yaxis=dict(showbackground=False, showgrid=False, zeroline=False, showticklabels=False, title=''),
            zaxis=dict(showbackground=False, showgrid=False, zeroline=False, showticklabels=False, title=''),
            camera=dict(
                eye=dict(x=1.3, y=1.3, z=1.3)
            )
        ),
        margin=dict(l=0, r=0, t=0, b=0),
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
    )
    
    fig = go.Figure(data=[edge_trace, node_trace], layout=layout)
    return fig

# Title Banner
st.markdown('<h1 class="hero-title">Krishna Gupta</h1>', unsafe_allow_html=True)
st.markdown('<p class="hero-tagline">B.Tech Data Science Student | Data Engineer | AI/ML Developer</p>', unsafe_allow_html=True)

# Layout division: Left profile, Right 3D Visual
col1, col2 = st.columns([1.1, 0.9])

with col1:
    st.markdown("""
    <div class="glass-card">
        <h3>Profile Summary</h3>
        <p>B.Tech Data Science student skilled in Data Engineering, AI/ML, and Software Development. Proficient in Python, SQL, REST APIs, PostgreSQL, and MySQL, with experience in data pipelines, full-stack development, LLM evaluation, and workflow automation.</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Quick info grid
    st.markdown("""
    <div class="glass-card">
        <h3>Contact Details</h3>
        <p>📧 <b>Email:</b> <a href="mailto:hg497kg@gmail.com">hg497kg@gmail.com</a></p>
        <p>📞 <b>Phone:</b> +91-9993153109</p>
        <p>📍 <b>Location:</b> Bhopal, India (Open to Remote)</p>
        <p>🔗 <b>LinkedIn:</b> <a href="https://linkedin.com/in/krishnaofficialgupta" target="_blank">linkedin.com/in/krishnaofficialgupta</a></p>
        <p>💻 <b>GitHub:</b> <a href="https://github.com/KGupta171025" target="_blank">github.com/KGupta171025</a></p>
    </div>
    """, unsafe_allow_html=True)

    # Resume Download Button
    resume_path = "static/assets/KG__Resume.pdf"
    if os.path.exists(resume_path):
        with open(resume_path, "rb") as f:
            resume_data = f.read()
        st.download_button(
            label="📥 Download Resume PDF",
            data=resume_data,
            file_name="Krishna_Gupta_Resume.pdf",
            mime="application/pdf"
        )
    else:
        st.warning("Resume file not found locally.")

with col2:
    st.markdown("### Interactive 3D Neural Network Model")
    st.write("Drag to spin, scroll to zoom, hover to inspect node details.")
    fig_nn = create_3d_neural_network()
    st.plotly_chart(fig_nn, use_container_width=True, config={"displayModeBar": False})
    st.caption("This interactive 3D model is rendered dynamically using pure Python (Plotly + Streamlit).")

st.write("---")

# Stats Grid (Highlights)
sc1, sc2, sc3, sc4 = st.columns(4)
with sc1:
    st.markdown('<div class="glass-card" style="text-align:center;"><p class="stat-number">50K+</p><p class="stat-text">LLM Outputs Evaluated</p></div>', unsafe_allow_html=True)
with sc2:
    st.markdown('<div class="glass-card" style="text-align:center;"><p class="stat-number">2+</p><p class="stat-text">Paid Internships</p></div>', unsafe_allow_html=True)
with sc3:
    st.markdown('<div class="glass-card" style="text-align:center;"><p class="stat-number">7+</p><p class="stat-text">Certifications</p></div>', unsafe_allow_html=True)
with sc4:
    st.markdown('<div class="glass-card" style="text-align:center;"><p class="stat-number">100%</p><p class="stat-text">Python Driven</p></div>', unsafe_allow_html=True)

# Technical Skills Tabs
st.markdown("## Technical Skills")
tab1, tab2, tab3, tab4 = st.tabs(["AI & Machine Learning", "Data Engineering", "Web Development", "Databases & Tools"])

with tab1:
    tc1, tc2 = st.columns(2)
    with tc1:
        st.markdown("### Machine Learning & AI")
        st.write("- **Supervised & Unsupervised Learning**")
        st.write("- **Large Language Models (LLMs) & Model Evaluation**")
        st.write("- **LLM Post-Training workflows**")
        st.write("- **Predictive Modeling & Data Mining**")
    with tc2:
        st.markdown("### Libraries & Toolkits")
        st.write("- **Pandas, NumPy**")
        st.write("- **Scikit-learn**")
        st.write("- **Python (Core logic and analytics)**")

with tab2:
    tc1, tc2 = st.columns(2)
    with tc1:
        st.markdown("### Engineering Workflows")
        st.write("- **ETL Pipelines (Extract, Transform, Load)**")
        st.write("- **Data Processing & Validation workflows**")
    with tc2:
        st.markdown("### Quality Assurance")
        st.write("- **Data Quality Assurance**")
        st.write("- **Workflow Automation**")

with tab3:
    tc1, tc2 = st.columns(2)
    with tc1:
        st.markdown("### Frontend & UI")
        st.write("- **React**")
        st.write("- **JavaScript (ES6+)**")
        st.write("- **HTML5 & CSS3**")
    with tc2:
        st.markdown("### Backend Systems")
        st.write("- **Node.js, ExpressJS**")
        st.write("- **Flask (Python)**")
        st.write("- **RESTful APIs**")

with tab4:
    tc1, tc2 = st.columns(2)
    with tc1:
        st.markdown("### Databases & Storage")
        st.write("- **PostgreSQL, MySQL**")
        st.write("- **Supabase**")
        st.write("- **Database Design & SQL Query Optimization**")
    with tc2:
        st.markdown("### Development Tools")
        st.write("- **Amazon Web Services (AWS)**")
        st.write("- **Git & GitHub**")
        st.write("- **Linux Terminal & VS Code**")

st.write("---")

# Internship Work Experience
st.markdown("## Internship Work Experience")
exp_col1, exp_col2 = st.columns(2)

with exp_col1:
    st.markdown("""
    <div class="glass-card">
        <span class="cert-badge">Paid Internship</span>
        <h3>LLM Post Training Intern</h3>
        <p style="color:#06b6d4;"><b>Ethara AI</b> | Remote | Feb 2026 – May 2026</p>
        <ul>
            <li>Processed and evaluated 50,000+ Large Language Model (LLM) outputs, improving response quality, data consistency, and AI system performance through large-scale validation and analysis.</li>
            <li>Developed Python-based data processing and validation workflows to automate anomaly detection and text preprocessing, reducing manual verification effort and accelerating evaluation cycles.</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)

with exp_col2:
    st.markdown("""
    <div class="glass-card">
        <span class="cert-badge">Paid Internship</span>
        <h3>Full Stack Development Intern</h3>
        <p style="color:#06b6d4;"><b>Kanchan Pvt Ltd – Web Dev Wing (Sapphire)</b> | Remote | Oct 2025 – Feb 2026</p>
        <ul>
            <li>Designed and developed scalable full-stack web applications, REST APIs, and database-driven solutions using MySQL and PostgreSQL, improving application performance and data management efficiency.</li>
            <li>Built and deployed the RevU Social platform (revu.social) and leveraged GenAI-assisted development practices to accelerate feature delivery and streamline workflows.</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)

st.write("---")

# Projects Section
st.markdown("## Projects")
p_col1, p_col2 = st.columns(2)

with p_col1:
    st.markdown("""
    <div class="glass-card">
        <h3>RevU Social – Full-Stack Review & Analytics Platform</h3>
        <p style="color:#10b981;"><b>React, Node.js, MySQL, REST APIs</b> (Oct 2025 - Feb 2026)</p>
        <p>Developed a full-stack social review platform for community engagement and content management. Designed scalable database schemas and backend services for secure data storage, validation, and high-performance data retrieval. Implemented analytics and reporting workflows to support structured insights and user-driven interactions.</p>
    </div>
    """, unsafe_allow_html=True)

with p_col2:
    st.markdown("""
    <div class="glass-card">
        <h3>AYU – Modular AI Personal Assistant</h3>
        <p style="color:#10b981;"><b>Python, Workflow Automation, APIs</b> (2023 – Present)</p>
        <p>Built a modular AI personal assistant in Python with workflow automation, database integration, and extensible service-oriented architecture. Developed intelligent task automation modules with structured logging, data validation, and background processing capabilities. Engineered a scalable, multi-component system supporting API integrations.</p>
    </div>
    """, unsafe_allow_html=True)

st.write("---")

# Featured / All Certifications & Downloads
st.markdown("## Certifications & Credentials")

certs_dir = "static/assets/certificates"

def render_cert_card(title, issuer, desc, date, filename):
    file_path = os.path.join(certs_dir, filename)
    st.markdown(f"#### {title}")
    st.markdown(f"**Issuer:** {issuer} | **Date:** {date}")
    st.markdown(f"*{desc}*")
    
    if os.path.exists(file_path):
        with open(file_path, "rb") as f:
            file_data = f.read()
        mime_type = "image/png" if filename.endswith(".png") else "application/pdf"
        st.download_button(
            label=f"📥 Download {filename.split('.')[-1].upper()}",
            data=file_data,
            file_name=filename,
            mime=mime_type,
            key=filename
        )
    else:
        st.caption("Certificate file not found locally.")
    st.write("")

# Display grid
cc1, cc2 = st.columns(2)

with cc1:
    st.markdown("### Top Credentials")
    
    st.markdown('<div class="glass-card">', unsafe_allow_html=True)
    render_cert_card(
        "AWS Certified Developer - Associate",
        "Infosys Springboard",
        "Covers AWS services, cloud deployment, serverless scaling, database integration, and cloud-native architecture.",
        "June 2026",
        "AWS_Certified_Developer.pdf"
    )
    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown('<div class="glass-card">', unsafe_allow_html=True)
    render_cert_card(
        "Machine Learning with Python",
        "IBM SkillsBuild (ML0101EN)",
        "Covers supervised & unsupervised ML models, Scikit-learn, regression, classification, clustering, and recommender systems.",
        "June 2026",
        "IBM_ML0101EN_Certificate.pdf"
    )
    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown('<div class="glass-card">', unsafe_allow_html=True)
    render_cert_card(
        "Data Science & Analytics",
        "HP LIFE (HP Foundation)",
        "Focuses on basic data analytics, data-driven decision making, business intelligence, and storytelling with data.",
        "June 2026",
        "HP_LIFE_Data_Science_Analytics.pdf"
    )
    st.markdown('</div>', unsafe_allow_html=True)

with cc2:
    st.markdown("### Other Certifications")
    
    st.markdown('<div class="glass-card">', unsafe_allow_html=True)
    render_cert_card(
        "Learning SQL Programming",
        "LinkedIn Learning",
        "Database design, queries, table joins, indexing, and SQL optimization techniques.",
        "Course Completion",
        "Learning_SQL_Programming.pdf"
    )
    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown('<div class="glass-card">', unsafe_allow_html=True)
    render_cert_card(
        "Neural Networks & CNNs Essential Training",
        "LinkedIn Learning",
        "Covers deep neural networks, backpropagation math, activation functions, and Convolutional Neural Networks.",
        "Course Completion",
        "Neural_Networks_CNN_Essential_Training.pdf"
    )
    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown('<div class="glass-card">', unsafe_allow_html=True)
    render_cert_card(
        "Gemini for Google Workspace Workshop",
        "Google",
        "Interactive workshop focused on prompt engineering, generative workflow automations, and AI code assistance.",
        "Workshop Completion",
        "Gemini_for_Google_Workshop.png"
    )
    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown('<div class="glass-card">', unsafe_allow_html=True)
    render_cert_card(
        "Internship Completion Certificate",
        "Professional Internship",
        "Official certificate validating core developer accomplishments, demonstrating execution of engineering capabilities.",
        "Internship Verified",
        "Internship_Completion_Certificate.pdf"
    )
    st.markdown('</div>', unsafe_allow_html=True)

st.write("---")

# Education & Coursework
st.markdown("## Education & Coursework")
ec_col1, ec_col2 = st.columns(2)

with ec_col1:
    st.markdown("""
    <div class="glass-card">
        <h3>Academic History</h3>
        <p>🎓 <b>B.Tech in Data Science</b> (2023 - 2027)<br>
        Oriental Institute of Science and Technology, Bhopal</p>
        <p>🏫 <b>Higher Secondary Education Class X & XII</b> (2021 - 2023)<br>
        Bardsley English Medium Senior Secondary School, Katni</p>
    </div>
    """, unsafe_allow_html=True)

with ec_col2:
    st.markdown("""
    <div class="glass-card">
        <h3>Relevant Coursework</h3>
        <p>Core subjects covering key data and engineering concepts:</p>
        <ul>
            <li>Data Structures & Algorithms (DSA)</li>
            <li>Database Management Systems (DBMS)</li>
            <li>Data Mining & Analytics</li>
            <li>Machine Learning</li>
            <li>Software Engineering (SDLC)</li>
            <li>Operating Systems (OS)</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)

st.write("---")

# Contact Form
st.markdown("## Contact Me")
contact_col, info_col = st.columns([1.2, 0.8])

with contact_col:
    with st.form("contact_form", clear_on_submit=True):
        st.write("Send a message directly to Krishna Gupta")
        name = st.text_input("Full Name", placeholder="John Doe")
        email = st.text_input("Email Address", placeholder="john@example.com")
        message = st.text_area("Message", placeholder="Write your message here...")
        
        submitted = st.form_submit_button("✉️ Send Message")
        if submitted:
            if name and email and message:
                st.success("Thank you for reaching out, Krishna will respond to you shortly!")
            else:
                st.error("Please fill out all fields before submitting.")

with info_col:
    st.markdown("""
    <div class="glass-card" style="height: 100%;">
        <h3>Open for Opportunities</h3>
        <p>I am actively seeking internships, entry-level, or remote roles in <b>Data Engineering</b>, <b>AI/ML Development</b>, and <b>Software Engineering</b>.</p>
        <p>Feel free to reach out via the email or contact form, or connect with me directly on LinkedIn or GitHub.</p>
    </div>
    """, unsafe_allow_html=True)
