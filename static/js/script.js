// ==========================================
// Krishna Gupta - Interactive Web Engine
// ==========================================

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDo8ChYMXOHJzcmXfm27ooNXOggrZRaDmE",
  authDomain: "krishna-gupta--portfolio.firebaseapp.com",
  projectId: "krishna-gupta--portfolio",
  storageBucket: "krishna-gupta--portfolio.firebasestorage.app",
  messagingSenderId: "963185062473",
  appId: "1:963185062473:web:bc89e5774b9fdc9a5ec598",
  measurementId: "G-Z372F9BDJW"
};

// Initialize Firebase if compat SDK loaded
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
}

// Initialize EmailJS if SDK loaded
if (typeof emailjs !== 'undefined') {
    emailjs.init("QTI7kZcTA6MMVZrtv");
}

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

    // 6. Auto-scroll to contact section if URL path ends with /contact
    handleContactPathScroll();
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

    let initialY = 1;
    function updateShapePosition() {
        if (window.innerWidth < 991) {
            shapeMesh.position.set(0, -2.4, -2.5);
            initialY = -2.4;
            shapeMesh.scale.set(0.65, 0.65, 0.65);
        } else {
            shapeMesh.position.set(3, 1, -1);
            initialY = 1;
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

        // Adjust mesh Y position based on document scroll (3D parallax)
        const scrollFraction = window.scrollY / window.innerHeight;
        const visibleHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
        shapeMesh.position.y = initialY - (scrollFraction * visibleHeight);

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

    const basePath = window.location.pathname.startsWith('/Krishna-Gupta-Portfolio') ? '/Krishna-Gupta-Portfolio' : '';

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const targetId = href.includes('#') ? href.split('#')[1] : 'hero';
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Update URL path cleanly
                const targetPath = targetId === 'hero' ? (basePath || '/') : `${basePath}/${targetId}`;
                window.history.replaceState(null, null, targetPath);
            }
            
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

    // D. ScrollSpy Active navigation highlight & Dynamic URL updates
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 180)) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href.endsWith(`#${currentId}`)) {
                link.classList.add('active');
            }
        });

        // Update URL path dynamically as they scroll
        if (currentId && currentId !== 'hero') {
            const targetPath = `${basePath}/${currentId}`;
            if (window.location.pathname !== targetPath && window.location.pathname !== targetPath + '/') {
                window.history.replaceState(null, null, targetPath);
            }
        } else if (currentId === 'hero') {
            const rootPath = basePath || '/';
            if (window.location.pathname !== rootPath) {
                window.history.replaceState(null, null, rootPath);
            }
        }
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
    const emailInput = document.getElementById('email');

    // Create and style real-time validation feedback status element
    const emailStatus = document.createElement('div');
    emailStatus.className = 'email-status-feedback';
    emailStatus.style.fontSize = '0.8rem';
    emailStatus.style.marginTop = '4px';
    emailStatus.style.fontWeight = '600';
    emailStatus.style.transition = 'all 0.3s ease';
    emailInput.parentNode.appendChild(emailStatus);

    let isEmailValid = false;
    let emailTimeout = null;

    const verifyEmailRealtime = (emailVal) => {
        emailStatus.textContent = 'Verifying email address...';
        emailStatus.style.color = '#818cf8'; // Indigo load state

        fetch(`https://disify.com/api/email/${encodeURIComponent(emailVal)}`)
        .then(res => res.json())
        .then(emailCheck => {
            if (!emailCheck.format || !emailCheck.dns) {
                emailStatus.textContent = '✗ Email domain does not exist or has inactive DNS.';
                emailStatus.style.color = '#ef4444'; // Red error
                isEmailValid = false;
                return;
            }

            if (emailCheck.disposable) {
                emailStatus.textContent = '✗ Temporary or disposable email addresses are not allowed.';
                emailStatus.style.color = '#ef4444';
                isEmailValid = false;
                return;
            }

            emailStatus.textContent = '✓ Email address exists and is active.';
            emailStatus.style.color = '#10b981'; // Green active
            isEmailValid = true;
        })
        .catch(err => {
            console.warn('Real-time verification service unavailable:', err);
            // Fallback: If verification api is down, trust syntax formatting
            emailStatus.textContent = '✓ Syntax format is correct.';
            emailStatus.style.color = '#10b981';
            isEmailValid = true;
        });
    };

    emailInput.addEventListener('input', () => {
        isEmailValid = false;
        clearTimeout(emailTimeout);
        emailStatus.textContent = '';

        const emailVal = emailInput.value.trim();
        if (!emailVal) return;

        // Local regex validation check (instant feedback)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
            emailStatus.textContent = '✗ Invalid email format.';
            emailStatus.style.color = '#ef4444';
            return;
        }

        // Debounce actual server DNS verification for 600ms
        emailTimeout = setTimeout(() => {
            verifyEmailRealtime(emailVal);
        }, 600);
    });

    emailInput.addEventListener('blur', () => {
        const emailVal = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailVal && emailRegex.test(emailVal) && !isEmailValid) {
            verifyEmailRealtime(emailVal);
        }
    });
    
    let generatedOtp = null;
    let isOtpSent = false;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameVal = document.getElementById('name').value;
        const emailVal = emailInput.value.trim();
        const msgVal = document.getElementById('message').value;

        // If OTP has not been sent yet, trigger the OTP sending process
        if (!isOtpSent) {
            submitBtn.disabled = true;
            btnText.textContent = 'Sending verification code...';
            formFeedback.className = 'form-feedback hidden';

            // Generate a secure 6-digit verification code
            generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

            // Send OTP directly to the visitor's email address
            const otpParams = {
                email: emailVal,
                name: nameVal,
                otp: generatedOtp
            };

            // Send using your connected Gmail Service and a dedicated OTP Template ID
            // NOTE: Replace "YOUR_OTP_TEMPLATE_ID" with your second template ID once created.
            emailjs.send("service_jaq73yp", "template_otp", otpParams)
            .then(() => {
                submitBtn.disabled = false;
                btnText.textContent = 'Verify & Send Message';
                formFeedback.textContent = 'A 6-digit verification code has been sent to your email. Please check your inbox and enter it below.';
                formFeedback.className = 'form-feedback success';

                // Dynamically inject the verification input code field if not already present
                if (!document.getElementById('otpGroup')) {
                    const otpGroup = document.createElement('div');
                    otpGroup.className = 'form-group';
                    otpGroup.id = 'otpGroup';
                    otpGroup.innerHTML = `
                        <label for="otpCode">Verification Code</label>
                        <input type="text" id="otpCode" placeholder="Enter 6-digit code" required maxlength="6" style="text-align: center; font-size: 1.1rem; font-weight: bold; letter-spacing: 4px;">
                    `;
                    // Insert right above the submit button
                    contactForm.insertBefore(otpGroup, submitBtn);
                }
                isOtpSent = true;
            })
            .catch(err => {
                console.error('Error sending verification code:', err);
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
                formFeedback.textContent = 'Error sending verification code. Please make sure the email is valid and try again.';
                formFeedback.className = 'form-feedback error';
            });
            return;
        }

        // If OTP has been sent, verify it
        const userOtp = document.getElementById('otpCode').value.trim();
        if (userOtp !== generatedOtp) {
            formFeedback.textContent = 'Error: Incorrect verification code. Please check your email inbox.';
            formFeedback.className = 'form-feedback error';
            return;
        }

        // OTP is correct! Proceed with final database submission and notification email
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';

        const performSubmission = () => {
            if (typeof db !== 'undefined') {
                // 1. Submit to Google Firebase (Firestore Database - 100% Free on Spark Plan)
                const dbPromise = db.collection("contact_submissions").add({
                    name: nameVal,
                    email: emailVal,
                    message: msgVal,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });

                // 2. Send email notification to you
                const emailPromise = sendNotificationEmail();

                Promise.all([dbPromise, emailPromise])
                .then(() => {
                    submitBtn.disabled = false;
                    btnText.textContent = 'Send Message';
                    formFeedback.textContent = 'Thank you! Your message was securely saved in Firebase and forwarded to Krishna.';
                    formFeedback.className = 'form-feedback success';
                    contactForm.reset();
                    isEmailValid = false; // Reset verification states
                    emailStatus.textContent = '';
                    isOtpSent = false;
                    generatedOtp = null;
                    const otpGroup = document.getElementById('otpGroup');
                    if (otpGroup) otpGroup.remove();
                })
                .catch(err => {
                    console.error('Submission error:', err);
                    submitBtn.disabled = false;
                    btnText.textContent = 'Verify & Send Message';
                    formFeedback.textContent = 'Error completing submission. Please try again.';
                    formFeedback.className = 'form-feedback error';
                });
            } else {
                fallbackSubmission();
            }
        };

        const sendNotificationEmail = () => {
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

            if (isLocalhost) {
                const localPayload = {
                    name: nameVal,
                    email: emailVal,
                    message: msgVal
                };

                return fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(localPayload)
                })
                .then(res => res.json())
                .then(data => {
                    if (!data.success) {
                        throw new Error(data.message);
                    }
                });
            } else {
                // Use EmailJS for production notification
                const templateParams = {
                    name: nameVal,
                    email: emailVal,
                    message: msgVal,
                    time: new Date().toLocaleString(),
                    title: `Message from ${nameVal}`
                };

                return emailjs.send("service_jaq73yp", "template_xxqt4qj", templateParams);
            }
        };

        const fallbackSubmission = () => {
            sendNotificationEmail()
            .then(() => {
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
                formFeedback.textContent = 'Thank you! Your message has been sent to Krishna.';
                formFeedback.className = 'form-feedback success';
                contactForm.reset();
                isEmailValid = false;
                emailStatus.textContent = '';
                isOtpSent = false;
                generatedOtp = null;
                const otpGroup = document.getElementById('otpGroup');
                if (otpGroup) otpGroup.remove();
            })
            .catch(err => {
                submitBtn.disabled = false;
                btnText.textContent = 'Verify & Send Message';
                formFeedback.textContent = 'Error sending form: ' + err.message;
                formFeedback.className = 'form-feedback error';
            });
        };

        performSubmission();
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

/* ==========================================================
   6. Auto-scroll to Section based on URL Path on load
   ========================================================== */
function handleContactPathScroll() {
    const path = window.location.pathname;
    const sections = ['about', 'skills', 'experience', 'projects', 'certifications', 'contact'];
    for (const sectionId of sections) {
        if (path.endsWith('/' + sectionId) || path.endsWith('/' + sectionId + '/') || path.endsWith('/' + sectionId + '.html')) {
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                setTimeout(() => {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 600); // 600ms allows the initial fade-in animations to load
            }
            break;
        }
    }
}
