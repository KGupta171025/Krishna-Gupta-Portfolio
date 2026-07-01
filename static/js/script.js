// ==========================================
// Krishna Gupta - Interactive Web Engine
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Three.js WebGL Particle Background
    initThreeBackground();

    // 2. Initialize 3D Card Tilt Effects
    initCardTiltEffects();

    // 3. Scroll Reveal Animation Engine (Intersection Observer)
    initScrollReveal();

    // 4. Core UI / Theme Toggling / Mobile Nav / Form Handler
    initCoreUI();

    // 5. Stats Counter Animation Engine
    initStatsCounter();
});

/* ==========================================================
   1. Three.js Background Constellation
   ========================================================== */
function initThreeBackground() {
    const canvas = document.getElementById('three-bg');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // WebGL Renderer with alpha transparency enabled
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle nodes setup
    const count = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 15;
        positions[i + 1] = (Math.random() - 0.5) * 15;
        positions[i + 2] = (Math.random() - 0.5) * 15;

        // Random velocities
        velocities.push((Math.random() - 0.5) * 0.003);
        velocities.push((Math.random() - 0.5) * 0.003);
        velocities.push((Math.random() - 0.5) * 0.003);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Materials
    const material = new THREE.PointsMaterial({
        size: 0.07,
        color: 0x818cf8,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Torus Knot floating wireframe mesh for 3D depth showcase
    const shapeGeom = new THREE.TorusKnotGeometry(0.8, 0.22, 100, 16);
    const shapeMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending
    });
    const shapeMesh = new THREE.Mesh(shapeGeom, shapeMat);
    scene.add(shapeMesh);

    function updateShapePosition() {
        if (window.innerWidth < 991) {
            shapeMesh.position.set(0, -2.4, -2.5);
            shapeMesh.scale.set(0.65, 0.65, 0.65);
        } else {
            shapeMesh.position.set(3, 1, -1);
            shapeMesh.scale.set(1, 1, 1);
        }
    }
    updateShapePosition();

    camera.position.z = 6;

    // Mouse movement physics
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5);
        mouseY = (e.clientY / window.innerHeight - 0.5);
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Smooth camera damping/inertia
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Slow automatic particle spin
        points.rotation.y += 0.0006;
        points.rotation.x += 0.0003;

        // Move camera slightly to warp the perspective
        camera.position.x = targetX * 3.5;
        camera.position.y = -targetY * 3.5;
        camera.lookAt(scene.position);

        // Spin the Torus Knot mesh with cursor parallax inertia
        shapeMesh.rotation.x += 0.004 + (targetY * 0.015);
        shapeMesh.rotation.y += 0.004 + (targetX * 0.015);

        renderer.render(scene, camera);
    }
    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        updateShapePosition();
    });
}

/* ==========================================================
   2. Custom 3D Card Tilt & Glare Reflections
   ========================================================== */
function initCardTiltEffects() {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    tiltCards.forEach(card => {
        // Create a shining glare overlay inside the card
        const glare = document.createElement('div');
        glare.className = 'card-glare';
        glare.style.position = 'absolute';
        glare.style.top = '0';
        glare.style.left = '0';
        glare.style.width = '100%';
        glare.style.height = '100%';
        glare.style.pointerEvents = 'none';
        glare.style.borderRadius = 'inherit';
        glare.style.background = 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 80%)';
        glare.style.opacity = '0';
        glare.style.transition = 'opacity 0.25s ease';
        glare.style.zIndex = '5';
        card.style.position = 'relative';
        card.appendChild(glare);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            // Mouse coordinate relative to the card bounds
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Normalize coordinate between -0.5 and 0.5
            const normX = (x / rect.width) - 0.5;
            const normY = (y / rect.top - rect.bottom) - 0.5; // wait, simple calculation:
            const relY = (y / rect.height) - 0.5;

            // Tilt limit factor in degrees
            const maxTilt = 8;
            const tiltX = -relY * maxTilt;
            const tiltY = normX * maxTilt;

            // Apply 3D transforms
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Align glare position
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
            glare.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            // Reset transforms with smooth ease
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            glare.style.opacity = '0';
        });
    });
}

/* ==========================================================
   3. Scroll Reveal Animation Engine
   ========================================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null,
        threshold: 0.12, // Element is 12% visible
        rootMargin: '0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, observerOptions);

    reveals.forEach(el => revealObserver.observe(el));
}

/* ==========================================================
   4. Core UI Controllers
   ========================================================== */
function initCoreUI() {
    // A. Theme Switcher
    const body = document.body;
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = themeToggleBtn.querySelector('i');

    const savedTheme = localStorage.getItem('theme') || 'dark-theme';
    body.className = savedTheme;
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light-theme');
            updateThemeIcon('light-theme');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark-theme');
            updateThemeIcon('dark-theme');
        }
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark-theme') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    // B. Mobile Responsive Navigation Toggle
    const navHamburger = document.getElementById('navHamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    navHamburger.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const icon = navHamburger.querySelector('i');
        if (navMenu.classList.contains('open')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navHamburger.querySelector('i').className = 'fas fa-bars';
        });
    });

    // C. Sticky Navbar sizing on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // D. ScrollSpy Active navigation highlight
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 160)) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
            }
        });
    });

    // E. Skills Category tab filters
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPane = btn.getAttribute('data-tab');
            document.getElementById(targetPane).classList.add('active');
        });
    });

    // F. Contact Form Submission Handling
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const btnText = document.getElementById('btnText');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        formFeedback.className = 'form-feedback hidden';

        const nameVal = document.getElementById('name').value;
        const emailVal = document.getElementById('email').value;
        const msgVal = document.getElementById('message').value;

        // Determine if we submit to our local Flask API or use a web form fallback (for static hosting like GitHub Pages)
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        if (isLocalhost) {
            // Send to Flask local API endpoint (handles Twilio SMS + optional SMTP email)
            const localPayload = {
                name: nameVal,
                email: emailVal,
                message: msgVal
            };

            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(localPayload)
            })
            .then(res => res.json())
            .then(data => {
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
                if (data.success) {
                    formFeedback.textContent = 'Success! Your message was received, and notifications were forwarded to Krishna.';
                    formFeedback.className = 'form-feedback success';
                    contactForm.reset();
                } else {
                    formFeedback.textContent = 'Error: ' + data.message;
                    formFeedback.className = 'form-feedback error';
                }
            })
            .catch(err => {
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
                formFeedback.textContent = 'Error connecting to local server: ' + err.message;
                formFeedback.className = 'form-feedback error';
            });
        } else {
            // Fallback for GitHub Pages static hosting using Web3Forms
            // Web3Forms sends submissions directly to krishna.official.gupta@gmail.com
            // (Note: replace access_key below with your free Web3Forms key to enable emails in production)
            const web3FormsPayload = {
                access_key: '71e95101-47ab-4f82-a128-f044979facce', 
                name: nameVal,
                email: emailVal,
                message: msgVal,
                subject: `New Message from Portfolio: ${nameVal}`
            };

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(web3FormsPayload)
            })
            .then(res => res.json())
            .then(data => {
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
                if (data.success) {
                    formFeedback.textContent = 'Thank you! Your message was successfully sent to Krishna.';
                    formFeedback.className = 'form-feedback success';
                    contactForm.reset();
                } else {
                    formFeedback.textContent = 'Form submission failed: ' + data.message + ' (Check your Web3Forms access key!)';
                    formFeedback.className = 'form-feedback error';
                }
            })
            .catch(err => {
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
                formFeedback.textContent = 'Error sending form: ' + err.message;
                formFeedback.className = 'form-feedback error';
            });
        }
    });
}

/* ==========================================================
   5. Stats Counter Animation Engine (Scroll Triggered)
   ========================================================== */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        root: null,
        threshold: 0.25
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = +stat.getAttribute('data-target');
                const suffix = stat.getAttribute('data-suffix') || '';
                let current = 0;
                const increment = target / 70; // Animate over roughly 70 frames
                
                const animate = () => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target + suffix;
                    } else {
                        stat.textContent = Math.floor(current) + suffix;
                        requestAnimationFrame(animate);
                    }
                };
                
                animate();
                observer.unobserve(stat);
            }
        });
    }, observerOptions);

    stats.forEach(stat => statsObserver.observe(stat));
}
