// ==========================================

// Cryptographically Secure Random Generators

// ==========================================

function getSecureRandomInt(min, max) {

    const range = max - min + 1;

    const randomBuffer = new Uint32Array(1);

    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {

        window.crypto.getRandomValues(randomBuffer);

        return min + (randomBuffer[0] % range);

    }

    return min + Math.floor(Math.random() * range);

}



function getSecureRandomString(len = 8) {

    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {

        const bytes = new Uint8Array(len);

        window.crypto.getRandomValues(bytes);

        return Array.from(bytes, b => (b % 36).toString(36)).join('');

    }

    return Math.random().toString(36).substring(2, 2 + len);

}



// ==========================================















// Krishna Gupta - Interactive Web Engine















// ==========================================































// Firebase configuration















const firebaseConfig = {















  apiKey: atob("QUl6YVN5RG84Q2hZTVhPSEp6Y21YZm0yN29vTlhPZ2dyWlJhRG1F"),















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



    // Skills Tabs Switching

    const tabButtons = document.querySelectorAll('.skills-tabs .tab-btn');

    const tabPanes = document.querySelectorAll('.skills-tab-content .tab-pane');

    if (tabButtons.length > 0 && tabPanes.length > 0) {

        tabButtons.forEach(btn => {

            btn.addEventListener('click', (e) => {

                e.preventDefault();

                const targetTab = btn.getAttribute('data-tab');

                tabButtons.forEach(b => b.classList.remove('active'));

                tabPanes.forEach(p => p.classList.remove('active'));

                btn.classList.add('active');

                const targetPane = document.getElementById(targetTab);

                if (targetPane) {

                    targetPane.classList.add('active');

                }

            });

        });

    }











    // Force HTTPS redirection (except on localhost / local staging IPs)



    if (window.location.protocol === 'http:' && 



        window.location.hostname !== 'localhost' && 



        window.location.hostname !== '127.0.0.1') {



        window.location.href = window.location.href.replace('http:', 'https:');



        return;



    }







    let animationsRunning = false;







    // 1. Initialize Three.js WebGL Particle Background



    try {



        initThreeBackground();



    } catch (e) {



        console.error("Three.js background initialization failed:", e);



    }







    // 2. Initialize 3D Card Tilt Effects



    try {



        initCardTiltEffects();



    } catch (e) {



        console.error("Card Tilt initialization failed:", e);



    }







    // 0. Initialize Lenis Smooth Scroll Engine

    try {

        initLenisScroll();

    } catch (e) {

        console.error('Lenis scroll initialization failed:', e);

    }







    // 3. Scroll Reveal Animation Engine (GSAP & ScrollTrigger)



    try {



        initGSAPAnimations();



        animationsRunning = true;



    } catch (e) {



        console.error("GSAP Scroll Reveal initialization failed:", e);



    }







    // 4. Core UI / Theme Toggling / Mobile Nav / Form Handler



    try {



        initCoreUI();



    } catch (e) {



        console.error("Core UI initialization failed:", e);



    }







    // 5. Stats Counter Animation Engine



    try {



        initStatsCounter();



    } catch (e) {



        console.error("Stats counter initialization failed:", e);



    }







    // 6. Auto-scroll to contact section if URL path ends with /contact



    try {



        handleContactPathScroll();



    } catch (e) {



        console.error("Contact scroll handler failed:", e);



    }







    // 7. Log visitor analytics to Firebase Firestore



    try {



        logVisitor();



    } catch (e) {



        console.error("Visitor analytics logging failed:", e);



    }







    // 8. Initialize AI Agent Chatbot Widget



    try {



        initAIChatbot();



    } catch (e) {



        console.error("AI Chatbot widget initialization failed:", e);



    }







    // 9. Fail-safe Fallback: If GSAP animations failed to initialize, instantly reveal all content



    if (!animationsRunning) {



        console.warn("GSAP offline or failed. Activating defensive content visibility fallback.");



        document.querySelectorAll('.reveal').forEach(el => {



            el.classList.add('active');



            el.style.opacity = '1';



            el.style.transform = 'none';



        });



        document.querySelectorAll('.hero-content > *').forEach(child => {



            child.style.opacity = '1';



            child.style.transform = 'none';



        });



    }



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































    for (let i = 0; i < count * 3; i += 3) {















        positions[i] = (Math.random() - 0.5) * 15;















        positions[i + 1] = (Math.random() - 0.5) * 15;















        positions[i + 2] = (Math.random() - 0.5) * 15;















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































    // Setup physics anchors and velocities tracking for organic repulsion















    const initialPositions = new Float32Array(count * 3);















    const particleVelocities = new Float32Array(count * 3);















    for (let i = 0; i < count * 3; i++) {















        initialPositions[i] = positions[i];















        particleVelocities[i] = 0;















    }































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

        if (window.innerWidth < 992) {

            // On mobile & tablet: hide 3D torus knot mesh so text and buttons are 100% clear and unobstructed

            shapeMesh.visible = false;

        } else {

            // Desktop: Showcase floating 3D wireframe mesh on right side

            shapeMesh.visible = true;

            shapeMesh.position.set(3.2, 1.0, -1.0);

            initialY = 1.0;

            shapeMesh.scale.set(1, 1, 1);

            shapeMat.opacity = 0.18;

        }

    }



    updateShapePosition();



    camera.position.z = 6;



    // Mouse & Touch movement physics

    let mouseX = 0;

    let mouseY = 0;

    let targetX = 0;

    let targetY = 0;



    document.addEventListener('mousemove', (e) => {

        mouseX = (e.clientX / window.innerWidth - 0.5);

        mouseY = (e.clientY / window.innerHeight - 0.5);

    });



    document.addEventListener('touchmove', (e) => {

        if (e.touches.length > 0) {

            mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 0.5;

            mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 0.5;

        }

    }, { passive: true });



    // Animation Loop

    function animate() {

        requestAnimationFrame(animate);



        // Smooth camera damping/inertia

        targetX += (mouseX - targetX) * 0.05;

        targetY += (mouseY - targetY) * 0.05;



        // Slow background orbital rotation (handled entirely by GPU)

        points.rotation.y += 0.0004;

        points.rotation.x += 0.0002;



        // Move camera slightly to warp the perspective

        camera.position.x = targetX * (window.innerWidth < 768 ? 1.5 : 3.5);

        camera.position.y = -targetY * (window.innerWidth < 768 ? 1.5 : 3.5);

        camera.lookAt(scene.position);



        // Adjust mesh Y position based on document scroll (3D parallax) on desktop

        if (shapeMesh.visible) {

            const scrollFraction = window.scrollY / Math.max(window.innerHeight, 1);

            const visibleHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;

            shapeMesh.position.y = initialY - (scrollFraction * visibleHeight);



            // Spin the Torus Knot mesh with cursor parallax inertia

            shapeMesh.rotation.x += 0.004 + (targetY * 0.015);

            shapeMesh.rotation.y += 0.004 + (targetX * 0.015);

        }



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















function initLenisScroll() {

    if (typeof Lenis === 'undefined') return;



    // High performance smooth scrolling engine

    window.lenis = new Lenis({

        duration: 1.1,

        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),

        orientation: 'vertical',

        gestureOrientation: 'vertical',

        smoothWheel: true,

        wheelMultiplier: 1.0,

        touchMultiplier: 1.5,

        infinite: false,

    });



    if (typeof ScrollTrigger !== 'undefined') {

        window.lenis.on('scroll', ScrollTrigger.update);



        if (typeof gsap !== 'undefined') {

            gsap.ticker.add((time) => {

                window.lenis.raf(time * 1000);

            });

            gsap.ticker.lagSmoothing(0);

        } else {

            function raf(time) {

                window.lenis.raf(time);

                requestAnimationFrame(raf);

            }

            requestAnimationFrame(raf);

        }

    } else {

        function raf(time) {

            window.lenis.raf(time);

            requestAnimationFrame(raf);

        }

        requestAnimationFrame(raf);

    }

}



function initGSAPAnimations() {

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);



    ScrollTrigger.config({

        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize"

    });



    gsap.defaults({

        ease: "power2.out",

        force3D: true

    });



    // A. Hero text elements entrance

    gsap.fromTo(".hero-content > *",

        { opacity: 0, y: 15 },

        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out", clearProps: "transform" }

    );



    // B. Hero visual layout code terminal

    gsap.fromTo(".hero-visual",

        { opacity: 0, scale: 0.96 },

        { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out", delay: 0.1, clearProps: "transform" }

    );



    // C. Section Headers on scroll

    gsap.utils.toArray('.section-header').forEach(header => {

        gsap.fromTo(header,

            { opacity: 0, y: 18 },

            {

                opacity: 1,

                y: 0,

                duration: 0.45,

                ease: "power2.out",

                clearProps: "transform",

                scrollTrigger: {

                    trigger: header,

                    start: "top 90%",

                    fastScrollEnd: true,

                    preventOverlaps: true,

                    toggleActions: "play none none none"

                }

            }

        );

    });



    // D. Project Grid Cards entrance

    if (document.querySelector('.projects-grid')) {

        gsap.fromTo(".projects-grid .project-card-container",

            { opacity: 0, y: 25 },

            {

                opacity: 1,

                y: 0,

                duration: 0.45,

                stagger: 0.06,

                ease: "power2.out",

                clearProps: "transform",

                scrollTrigger: {

                    trigger: ".projects-grid",

                    start: "top 90%",

                    fastScrollEnd: true,

                    preventOverlaps: true,

                    toggleActions: "play none none none"

                }

            }

        );

    }



    // E. Timeline Items entrance

    gsap.utils.toArray('.timeline-item').forEach(item => {

        const content = item.querySelector('.timeline-content');

        if (content) {

            gsap.fromTo(content,

                { opacity: 0, x: item.classList.contains('left') ? -25 : 25 },

                {

                    opacity: 1,

                    x: 0,

                    duration: 0.45,

                    ease: "power2.out",

                    clearProps: "transform",

                    scrollTrigger: {

                        trigger: item,

                        start: "top 90%",

                        fastScrollEnd: true,

                        preventOverlaps: true,

                        toggleActions: "play none none none"

                    }

                }

            );

        }

    });



    // F. Skills Grid Cards entrance

    if (document.querySelector('.skills-grid')) {

        gsap.fromTo(".skills-grid .skill-card",

            { opacity: 0, y: 20 },

            {

                opacity: 1,

                y: 0,

                duration: 0.4,

                stagger: 0.03,

                ease: "power2.out",

                clearProps: "transform",

                scrollTrigger: {

                    trigger: ".skills-grid",

                    start: "top 90%",

                    fastScrollEnd: true,

                    preventOverlaps: true,

                    toggleActions: "play none none none"

                }

            }

        );

    }



    // G. Certifications Grid Cards entrance

    if (document.querySelector('.certifications-grid')) {

        gsap.fromTo(".certifications-grid .cert-card-container",

            { opacity: 0, y: 20 },

            {

                opacity: 1,

                y: 0,

                duration: 0.4,

                stagger: 0.04,

                ease: "power2.out",

                clearProps: "transform",

                scrollTrigger: {

                    trigger: ".certifications-grid",

                    start: "top 90%",

                    fastScrollEnd: true,

                    preventOverlaps: true,

                    toggleActions: "play none none none"

                }

            }

        );

    }



    // H. Universal Scroll Reveal for general containers with .reveal class

    gsap.utils.toArray('.reveal').forEach(el => {

        if (el.classList.contains('projects-grid') ||

            el.classList.contains('certifications-grid') ||

            el.classList.contains('skills-tab-content') ||

            el.classList.contains('skills-tabs')) {

            gsap.set(el, { opacity: 1, y: 0, scale: 1 });

            return;

        }



        const isHero = el.classList.contains('hero-content') || el.classList.contains('hero-visual');

        gsap.fromTo(el,

            { opacity: 0, y: 18 },

            {

                opacity: 1,

                y: 0,

                duration: 0.45,

                ease: "power2.out",

                clearProps: "transform",

                scrollTrigger: isHero ? null : {

                    trigger: el,

                    start: "top 90%",

                    fastScrollEnd: true,

                    preventOverlaps: true,

                    toggleActions: "play none none none"

                }

            }

        );

    });

}



/* ==========================================================















   4. Core UI Controllers















   ========================================================== */















function initCoreUI() {















    // A. Theme Switcher















    const body = document.body;















    const themeToggleBtn = document.getElementById('themeToggleBtn');































    const savedTheme = localStorage.getItem('theme') || 'dark-theme';















    body.className = savedTheme;































    if (themeToggleBtn) {















        const themeIcon = themeToggleBtn.querySelector('i');















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































    // C. Optimized Sticky Navbar & ScrollSpy Controller (Throttled via RAF & Lenis)

    const navbar = document.getElementById('navbar');

    const sections = document.querySelectorAll('section[id]');

    let activeNavId = '';

    let isScrollTicking = false;



    function handleScrollUpdate() {

        const scrollY = window.scrollY || window.pageYOffset;



        // Sticky navbar class

        if (navbar) {

            if (scrollY > 50) {

                if (!navbar.classList.contains('scrolled')) navbar.classList.add('scrolled');

            } else {

                if (navbar.classList.contains('scrolled')) navbar.classList.remove('scrolled');

            }

        }



        // ScrollSpy update

        if (sections.length > 0 && navLinks.length > 0) {

            let currentId = '';

            for (let i = 0; i < sections.length; i++) {

                const section = sections[i];

                const sectionTop = section.offsetTop;

                if (scrollY >= (sectionTop - 200)) {

                    currentId = section.getAttribute('id');

                }

            }



            if (currentId && currentId !== activeNavId) {

                activeNavId = currentId;

                navLinks.forEach(link => {

                    const href = link.getAttribute('href') || '';

                    if (href.endsWith(`#${currentId}`)) {

                        link.classList.add('active');

                    } else if (href.includes('#')) {

                        link.classList.remove('active');

                    }

                });

            }

        }



        isScrollTicking = false;

    }



    if (window.lenis) {

        window.lenis.on('scroll', () => {

            if (!isScrollTicking) {

                requestAnimationFrame(handleScrollUpdate);

                isScrollTicking = true;

            }

        });

    } else {

        window.addEventListener('scroll', () => {

            if (!isScrollTicking) {

                requestAnimationFrame(handleScrollUpdate);

                isScrollTicking = true;

            }

        }, { passive: true });

    }































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















    















    // Dynamic Math Captcha Generator (Spambot defense)















    const num1 = Math.floor(Math.random() * 10) + 1;















    const num2 = Math.floor(Math.random() * 10) + 1;















    const captchaAnswer = (num1 + num2).toString();































    // Dynamically insert Captcha field in the form above the submit button















    const captchaGroup = document.createElement('div');

    captchaGroup.className = 'form-group';

    captchaGroup.id = 'captchaGroup';

    const captchaLabel = document.createElement('label');

    captchaLabel.htmlFor = 'captchaCode';

    captchaLabel.textContent = `Human Verification: What is ${num1} + ${num2}?`;

    const captchaInput = document.createElement('input');

    captchaInput.type = 'text';

    captchaInput.id = 'captchaCode';

    captchaInput.placeholder = 'Enter answer';

    captchaInput.required = true;

    captchaInput.style.textAlign = 'center';

    captchaInput.style.fontSize = '1rem';

    captchaInput.style.fontWeight = 'bold';

    captchaGroup.appendChild(captchaLabel);

    captchaGroup.appendChild(captchaInput);















    contactForm.insertBefore(captchaGroup, submitBtn);































    let generatedOtp = null;















    let isOtpSent = false;































    contactForm.addEventListener('submit', (e) => {















        e.preventDefault();































        const nameVal = document.getElementById('name').value;















        const emailVal = emailInput.value.trim();















        const msgVal = document.getElementById('message').value;































        // If OTP has not been sent yet, trigger the OTP sending process















        if (!isOtpSent) {















            // First check the math captcha















            const userCaptcha = document.getElementById('captchaCode').value.trim();















            if (userCaptcha !== captchaAnswer) {















                formFeedback.textContent = 'Error: Incorrect math captcha answer. Please try again.';















                formFeedback.className = 'form-feedback error';















                return;















            }































            submitBtn.disabled = true;















            btnText.textContent = 'Sending verification code...';















            formFeedback.className = 'form-feedback hidden';































            // Generate a secure 6-digit verification code















            generatedOtp = getSecureRandomInt(100000, 999999).toString();































            // Send OTP directly to the visitor's email address















            const otpParams = {















                email: emailVal,















                name: nameVal,















                otp: generatedOtp















            };































            // Send using your connected Gmail Service and a dedicated OTP Template ID















            emailjs.send("service_jaq73yp", "template_otp", otpParams)















            .then(() => {















                submitBtn.disabled = false;















                btnText.textContent = 'Verify & Send Message';















                formFeedback.textContent = 'A 6-digit verification code has been sent to your email. Please check your inbox and enter it below.';















                formFeedback.className = 'form-feedback success';































                // Hide the math captcha group once solved















                const capGroup = document.getElementById('captchaGroup');















                if (capGroup) capGroup.style.display = 'none';































                // Dynamically inject the verification input code field if not already present















                if (!document.getElementById('otpGroup')) {















                    const otpGroup = document.createElement('div');

                    otpGroup.className = 'form-group';

                    otpGroup.id = 'otpGroup';

                    const otpLabel = document.createElement('label');

                    otpLabel.htmlFor = 'otpCode';

                    otpLabel.textContent = 'Verification Code';

                    const otpInput = document.createElement('input');

                    otpInput.type = 'text';

                    otpInput.id = 'otpCode';

                    otpInput.placeholder = 'Enter 6-digit code';

                    otpInput.required = true;

                    otpInput.maxLength = 6;

                    otpInput.style.textAlign = 'center';

                    otpInput.style.fontSize = '1.1rem';

                    otpInput.style.fontWeight = 'bold';

                    otpInput.style.letterSpacing = '4px';

                    otpGroup.appendChild(otpLabel);

                    otpGroup.appendChild(otpInput);















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















                const d = new Date();

                const pad = (n) => String(n).padStart(2, '0');

                const contactDocId = `submission_${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}_${getSecureRandomString(6)}`;



                const dbPromise = db.collection("contact_submissions").doc(contactDocId).set({

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































/* ==========================================================















   7. Log visitor analytics to Firebase Firestore















   ========================================================== */















function getVisitorDetailedTelemetry() {

    const ua = navigator.userAgent || '';

    const now = new Date();

    const nowISO = now.toISOString();



    // 1. Persistent Anonymous Visitor ID (localStorage)

    let visitorId = 'vid_anon';

    let isReturning = false;

    let visitCount = 1;

    let firstVisit = nowISO;

    try {

        visitorId = localStorage.getItem('_kg_vid');

        if (!visitorId) {

            visitorId = 'vid_' + Date.now().toString(36) + '_' + getSecureRandomString(6);

            localStorage.setItem('_kg_vid', visitorId);

            localStorage.setItem('_kg_fvisit', nowISO);

            firstVisit = nowISO;

            isReturning = false;

        } else {

            isReturning = true;

            firstVisit = localStorage.getItem('_kg_fvisit') || nowISO;

        }

        visitCount = parseInt(localStorage.getItem('_kg_vcount') || '0', 10) + 1;

        localStorage.setItem('_kg_vcount', visitCount.toString());

        localStorage.setItem('_kg_lvisit', nowISO);

    } catch (e) {

        visitorId = 'vid_' + getSecureRandomString(8);

    }



    // 2. Browser Session ID (sessionStorage)

    let sessionId = 'sid_anon';

    try {

        sessionId = sessionStorage.getItem('_kg_sid');

        if (!sessionId) {

            sessionId = 'sid_' + Date.now().toString(36) + '_' + getSecureRandomString(6);

            sessionStorage.setItem('_kg_sid', sessionId);

        }

    } catch (e) {

        sessionId = 'sid_' + getSecureRandomString(7);

    }



    // 3. Device Category & Model Detection

    let deviceType = 'Desktop / Laptop';

    let deviceModel = 'Windows / Mac PC';

    let osName = 'Unknown OS';

    let osVersion = '';



    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    const width = window.innerWidth || 1200;



    if (/iPad|tablet|(android(?!.*mobile))/i.test(ua) || (width >= 600 && width <= 1024 && isTouch)) {

        deviceType = 'Tablet';

    } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua) || (width < 768 && isTouch)) {

        deviceType = 'Mobile Phone';

    }



    if (/iPhone/i.test(ua)) {

        osName = 'iOS';

        deviceModel = 'Apple iPhone';

        const match = ua.match(/OS (\d+[_\.]\d+)/);

        if (match) osVersion = match[1].replace('_', '.');

    } else if (/iPad/i.test(ua)) {

        osName = 'iPadOS';

        deviceModel = 'Apple iPad';

        const match = ua.match(/OS (\d+[_\.]\d+)/);

        if (match) osVersion = match[1].replace('_', '.');

    } else if (/Macintosh|Mac OS X/i.test(ua)) {

        osName = 'macOS';

        deviceModel = 'Apple Mac';

        const match = ua.match(/Mac OS X (\d+[_\.]\d+)/);

        if (match) osVersion = match[1].replace(/_/g, '.');

    } else if (/Android/i.test(ua)) {

        osName = 'Android';

        const verMatch = ua.match(/Android\s([0-9\.]+)/);

        if (verMatch) osVersion = verMatch[1];

        const modelMatch = ua.match(/;\s?([^;]+)\sBuild\//i);

        deviceModel = modelMatch ? `Android (${modelMatch[1].trim()})` : 'Android Phone';

    } else if (/Windows NT 10.0/i.test(ua)) {

        osName = 'Windows';

        osVersion = '10 / 11';

        deviceModel = 'Windows PC (x64)';

    } else if (/Windows NT 6.3/i.test(ua)) {

        osName = 'Windows';

        osVersion = '8.1';

        deviceModel = 'Windows PC';

    } else if (/Windows NT 6.1/i.test(ua)) {

        osName = 'Windows';

        osVersion = '7';

        deviceModel = 'Windows PC';

    } else if (/Linux/i.test(ua)) {

        osName = 'Linux';

        deviceModel = 'Linux Workstation';

    } else if (/CrOS/i.test(ua)) {

        osName = 'ChromeOS';

        deviceModel = 'Google Chromebook';

    }



    // 4. Browser Name, Engine & Version

    let browserName = 'Unknown Browser';

    let browserVersion = '';

    let browserEngine = 'Unknown Engine';



    if (/Edg\//i.test(ua)) {

        browserName = 'Microsoft Edge';

        browserEngine = 'Blink';

        browserVersion = (ua.match(/Edg\/([0-9\.]+)/) || [])[1] || '';

    } else if (/SamsungBrowser\//i.test(ua)) {

        browserName = 'Samsung Internet';

        browserEngine = 'Blink';

        browserVersion = (ua.match(/SamsungBrowser\/([0-9\.]+)/) || [])[1] || '';

    } else if (/OPR\/|Opera\//i.test(ua)) {

        browserName = 'Opera';

        browserEngine = 'Blink';

        browserVersion = (ua.match(/(?:OPR|Opera)\/([0-9\.]+)/) || [])[1] || '';

    } else if (/Chrome\//i.test(ua) && !/Chromium|Edg|SamsungBrowser|OPR/i.test(ua)) {

        browserName = 'Google Chrome';

        browserEngine = 'Blink';

        browserVersion = (ua.match(/Chrome\/([0-9\.]+)/) || [])[1] || '';

    } else if (/Safari\//i.test(ua) && !/Chrome|Android|Edg/i.test(ua)) {

        browserName = 'Apple Safari';

        browserEngine = 'WebKit';

        browserVersion = (ua.match(/Version\/([0-9\.]+)/) || [])[1] || '';

    } else if (/Firefox\//i.test(ua)) {

        browserName = 'Mozilla Firefox';

        browserEngine = 'Gecko';

        browserVersion = (ua.match(/Firefox\/([0-9\.]+)/) || [])[1] || '';

    }



    // 5. Traffic Source & Referral Analysis

    const ref = document.referrer || '';

    let trafficSource = 'Direct URL / Bookmark';

    if (ref) {

        try {

            const refHost = new URL(ref).hostname.toLowerCase();

            if (/(^|\.)google\.[a-z.]+$/i.test(refHost)) trafficSource = 'Google Search';

            else if (/(^|\.)linkedin\.com$/i.test(refHost)) trafficSource = 'LinkedIn';

            else if (/(^|\.)github\.com$/i.test(refHost)) trafficSource = 'GitHub';

            else if (/(^|\.)(twitter\.com|x\.com|t\.co)$/i.test(refHost)) trafficSource = 'Twitter / X';

            else if (/(^|\.)instagram\.com$/i.test(refHost)) trafficSource = 'Instagram';

            else if (/(^|\.)whatsapp\.com$/i.test(refHost)) trafficSource = 'WhatsApp';

            else if (/(^|\.)is-a\.dev$/i.test(refHost)) trafficSource = 'is-a.dev Domain Portal';

            else if (/(^|\.)youtube\.com$/i.test(refHost)) trafficSource = 'YouTube';

            else trafficSource = `Referral: ${refHost}`;

        } catch (e) {

            trafficSource = 'External Link';

        }

    }



    // URL Campaign / UTM parameters

    let campaignSource = 'Direct';

    let campaignMedium = 'Organic';

    let campaignName = 'None';

    try {

        const urlParams = new URLSearchParams(window.location.search);

        campaignSource = urlParams.get('utm_source') || urlParams.get('ref') || urlParams.get('source') || 'Direct';

        campaignMedium = urlParams.get('utm_medium') || 'Organic';

        campaignName = urlParams.get('utm_campaign') || 'None';

    } catch (e) {}



    // 6. Hardware, Display & Capabilities

    const dpr = window.devicePixelRatio || 1;

    const screenRes = `${window.screen.width}x${window.screen.height} (@${dpr.toFixed(2)}x DPR)`;

    const viewportRes = `${window.innerWidth}x${window.innerHeight}`;

    const orientation = window.innerHeight > window.innerWidth ? 'Portrait' : 'Landscape';

    const cpuCores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : 'Not Reported';

    const memory = navigator.deviceMemory ? `${navigator.deviceMemory} GB RAM` : 'Not Reported';

    const netConn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    const networkType = netConn ? (netConn.effectiveType ? `${netConn.effectiveType.toUpperCase()} (${netConn.type || 'cellular/wifi'})` : netConn.type || 'Online') : 'Online';

    let timeZone = 'Unknown';

    try {

        timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';

    } catch (e) {}

    const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark Theme' : 'Light Theme';



    return {

        visitorId,

        sessionId,

        isReturningVisitor: isReturning,

        visitCount,

        firstVisitTime: firstVisit,

        deviceType,

        deviceModel,

        os: `${osName} ${osVersion}`.trim(),

        browser: `${browserName} ${browserVersion}`.trim(),

        browserEngine,

        trafficSource,

        campaignSource,

        campaignMedium,

        campaignName,

        referrerUrl: ref || 'Direct / None',

        screenResolution: screenRes,

        viewportSize: viewportRes,

        screenOrientation: orientation,

        colorDepth: `${window.screen.colorDepth || 24}-bit`,

        cpuCores,

        deviceMemory: memory,

        networkType,

        timeZone,

        systemTheme: theme,

        touchSupport: isTouch ? 'Touch Screen' : 'Pointer / Mouse'

    };

}



function logVisitor() {

    let dbInstance = null;

    if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {

        dbInstance = firebase.firestore();

    } else if (typeof db !== 'undefined') {

        dbInstance = db;

    }

    if (!dbInstance) return;



    // Check sessionStorage to prevent duplicate logging within the same tab session

    if (sessionStorage.getItem('portfolio_visited')) return;

    sessionStorage.setItem('portfolio_visited', 'true');



    const tel = getVisitorDetailedTelemetry();

    const d = new Date();

    const pad = (n) => String(n).padStart(2, '0');

    const timeDocId = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}_${getSecureRandomString(6)}`;



    // Fetch IP and write simultaneously to visitor_logs & user_devices

    fetch('https://ipapi.co/json/')

        .then(response => response.json())

        .then(geoData => {

            const visitorData = {

                visitorId: tel.visitorId,

                sessionId: tel.sessionId,

                isReturningVisitor: tel.isReturningVisitor,

                visitCount: tel.visitCount,

                deviceType: tel.deviceType,

                deviceModel: tel.deviceModel,

                os: tel.os,

                browser: tel.browser,

                browserEngine: tel.browserEngine,

                trafficSource: tel.trafficSource,

                campaignSource: tel.campaignSource,

                campaignMedium: tel.campaignMedium,

                campaignName: tel.campaignName,

                referrer: tel.referrerUrl,

                page: window.location.pathname || '/',

                pageTitle: document.title || 'Krishna Gupta Portfolio',

                screenSize: tel.viewportSize,

                screenResolution: tel.screenResolution,

                screenOrientation: tel.screenOrientation,

                cpuCores: tel.cpuCores,

                deviceMemory: tel.deviceMemory,

                networkType: tel.networkType,

                timeZone: tel.timeZone,

                systemTheme: tel.systemTheme,

                touchSupport: tel.touchSupport,

                language: navigator.language || 'en-US',

                userAgent: navigator.userAgent,

                ip: geoData.ip || 'Unknown',

                city: geoData.city || 'Unknown',

                region: geoData.region || 'Unknown',

                country: geoData.country_name || 'Unknown',

                countryCode: geoData.country_code || 'Unknown',

                org: geoData.org || 'Unknown',

                postal: geoData.postal || 'Unknown',

                latitude: geoData.latitude || null,

                longitude: geoData.longitude || null,

                timestamp: firebase.firestore.FieldValue.serverTimestamp(),

                timestampLocal: new Date().toLocaleString()

            };



            const postalCode = geoData.postal || geoData.zip || geoData.postal_code || 'Not Available';



            const simpleDeviceData = {

                "Device_Name": tel.deviceModel,

                "Device_Type": tel.deviceType,

                "Operating_System": tel.os,

                "Browser": tel.browser,

                "Visitor_ID": tel.visitorId,

                "City": geoData.city || 'Unknown',

                "State_Region": geoData.region || 'Unknown',

                "Country": geoData.country_name || 'Unknown',

                "Postal_PIN_Code": postalCode,

                "ISP_Network": geoData.org || 'Unknown',

                "Traffic_Source": tel.trafficSource,

                "Screen_Size": tel.viewportSize,

                "Page_Visited": window.location.pathname || '/',

                "Total_Visits": tel.visitCount,

                "Date_Time": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + " (IST)",

                "timestamp": firebase.firestore.FieldValue.serverTimestamp()

            };



            dbInstance.collection("visitor_logs").doc(timeDocId).set(visitorData);

            dbInstance.collection("user_devices").doc(timeDocId).set(simpleDeviceData)

                .then(() => {

                    console.log("User device telemetry logged silently to user_devices.");

                    initGeolocationWatcher(dbInstance, timeDocId);

                })

                .catch(err => console.error("Telemetry error:", err));

        })

        .catch(() => {

            const fallbackData = {

                visitorId: tel.visitorId,

                sessionId: tel.sessionId,

                isReturningVisitor: tel.isReturningVisitor,

                visitCount: tel.visitCount,

                deviceType: tel.deviceType,

                deviceModel: tel.deviceModel,

                os: tel.os,

                browser: tel.browser,

                browserEngine: tel.browserEngine,

                trafficSource: tel.trafficSource,

                campaignSource: tel.campaignSource,

                referrer: tel.referrerUrl,

                page: window.location.pathname || '/',

                pageTitle: document.title || 'Krishna Gupta Portfolio',

                screenSize: tel.viewportSize,

                screenResolution: tel.screenResolution,

                screenOrientation: tel.screenOrientation,

                cpuCores: tel.cpuCores,

                deviceMemory: tel.deviceMemory,

                networkType: tel.networkType,

                timeZone: tel.timeZone,

                systemTheme: tel.systemTheme,

                touchSupport: tel.touchSupport,

                language: navigator.language || 'en-US',

                userAgent: navigator.userAgent,

                ip: 'Blocked / Offline',

                city: 'Unknown',

                region: 'Unknown',

                country: 'Unknown',

                org: 'Unknown',

                postal: 'Unknown',

                timestamp: firebase.firestore.FieldValue.serverTimestamp(),

                timestampLocal: new Date().toLocaleString()

            };



            const simpleFallbackData = {

                "Device_Name": tel.deviceModel,

                "Device_Type": tel.deviceType,

                "Operating_System": tel.os,

                "Browser": tel.browser,

                "Visitor_ID": tel.visitorId,

                "City": "Unknown",

                "State_Region": "Unknown",

                "Country": "Unknown",

                "Postal_PIN_Code": "Unknown",

                "ISP_Network": "Unknown / AdBlocked",

                "Traffic_Source": tel.trafficSource,

                "Screen_Size": tel.viewportSize,

                "Page_Visited": window.location.pathname || '/',

                "Total_Visits": tel.visitCount,

                "Date_Time": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + " (IST)",

                "timestamp": firebase.firestore.FieldValue.serverTimestamp()

            };



            dbInstance.collection("visitor_logs").doc(timeDocId).set(fallbackData);

            dbInstance.collection("user_devices").doc(timeDocId).set(simpleFallbackData)

                .then(() => {

                    console.log("Visitor fallback telemetry logged to user_devices.");

                    initGeolocationWatcher(dbInstance, timeDocId);

                })

                .catch(dbErr => console.error("Telemetry fallback error:", dbErr));

        });

}



let activeTelemetryDocId = null;



function initGeolocationWatcher(dbInstance, timeDocId) {

    activeTelemetryDocId = timeDocId;

    if (!navigator.geolocation || !dbInstance || !timeDocId) return;



    const handleGpsSuccess = (pos) => {

        if (!pos || !pos.coords) return;

        const lat = pos.coords.latitude;

        const lon = pos.coords.longitude;

        const accuracy = pos.coords.accuracy || 10;

        const mapsLink = `https://www.google.com/maps?q=${lat.toFixed(6)},${lon.toFixed(6)}`;



        try {

            localStorage.setItem('_kg_geo_granted', 'true');

        } catch (e) {}



        // Reverse-geocode via BigDataCloud client API

        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)

            .then(r => r.json())

            .then(geo => {

                let exactCity = geo.locality || geo.city || 'Katni';

                let exactState = geo.principalSubdivision || 'Madhya Pradesh';

                let exactCountry = geo.countryName || 'India';

                let exactPostcode = geo.postcode || '';



                const updateLocationInDb = (finalCity, finalState, finalPostcode) => {

                    const targetId = activeTelemetryDocId || timeDocId;

                    if (!dbInstance || !targetId) return;



                    const gpsDeviceUpdate = {

                        "City": finalCity,

                        "State_Region": finalState,

                        "Postal_PIN_Code": finalPostcode || "483501",

                        "Country": exactCountry,

                        "GPS_Coordinates": `${lat.toFixed(6)}, ${lon.toFixed(6)} (±${Math.round(accuracy)}m)`,

                        "Google_Maps_Pin": mapsLink,

                        "Geolocation_Status": "Enabled by User (High-Precision Pinpoint)",

                        "Last_Updated": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + " (IST)"

                    };



                    const gpsVisitorUpdate = {

                        city: finalCity,

                        region: finalState,

                        postal: finalPostcode || "483501",

                        country: exactCountry,

                        latitude: lat,

                        longitude: lon,

                        accuracyMeters: accuracy,

                        googleMapsUrl: mapsLink,

                        locationMethod: "Hardware GPS / Wi-Fi Pinpoint (User Enabled)"

                    };



                    dbInstance.collection("user_devices").doc(targetId).set(gpsDeviceUpdate, { merge: true })

                        .then(() => console.log("High-precision location updated instantly in user_devices."))

                        .catch(() => {});



                    dbInstance.collection("visitor_logs").doc(targetId).set(gpsVisitorUpdate, { merge: true })

                        .then(() => console.log("High-precision location updated in visitor_logs."))

                        .catch(() => {});

                };



                if (!exactPostcode) {

                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)

                        .then(nr => nr.json())

                        .then(nom => {

                            const nomPostal = nom.address?.postcode || '483501';

                            const nomCity = nom.address?.city || nom.address?.county || nom.address?.state_district || exactCity;

                            const nomState = nom.address?.state || exactState;

                            updateLocationInDb(nomCity, nomState, nomPostal);

                        })

                        .catch(() => updateLocationInDb(exactCity, exactState, '483501'));

                } else {

                    updateLocationInDb(exactCity, exactState, exactPostcode);

                }

            })

            .catch(() => {

                const targetId = activeTelemetryDocId || timeDocId;

                if (!dbInstance || !targetId) return;

                dbInstance.collection("user_devices").doc(targetId).set({

                    "GPS_Coordinates": `${lat.toFixed(6)}, ${lon.toFixed(6)} (±${Math.round(accuracy)}m)`,

                    "Google_Maps_Pin": mapsLink,

                    "Geolocation_Status": "Enabled by User (Hardware GPS)"

                }, { merge: true });

            });

    };



    // 1. Prompt and request high-accuracy position immediately

    navigator.geolocation.getCurrentPosition(

        handleGpsSuccess,

        (err) => console.log("Geolocation permission status:", err.message),

        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }

    );



    // 2. Listen continuously for when user clicks [Allow / Enable] in permission prompt

    if (navigator.permissions && navigator.permissions.query) {

        navigator.permissions.query({ name: 'geolocation' })

            .then(perm => {

                perm.onchange = () => {

                    if (perm.state === 'granted') {

                        navigator.geolocation.getCurrentPosition(

                            handleGpsSuccess,

                            () => {},

                            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }

                        );

                    }

                };

            })

            .catch(() => {});

    }



    // 3. Watch position for active GPS signal

    try {

        const watchId = navigator.geolocation.watchPosition(

            (pos) => {

                handleGpsSuccess(pos);

                navigator.geolocation.clearWatch(watchId);

            },

            () => {},

            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }

        );

    } catch (e) {}

}































/* ==========================================================















   8. AI Chatbot Widget Engine















   ========================================================== */















function initAIChatbot() {















    const toggleBtn = document.getElementById('ai-chat-toggle');















    const closeBtn = document.getElementById('ai-chat-close');















    const chatWindow = document.getElementById('ai-chat-window');















    const chatInput = document.getElementById('chat-input');















    const chatSend = document.getElementById('chat-send');















    const chatMessages = document.getElementById('chat-messages');















    const chatBadge = toggleBtn ? toggleBtn.querySelector('.chat-badge') : null;































    if (!toggleBtn || !chatWindow || !chatInput || !chatSend || !chatMessages) return;































    // Show unread notification badge after 4 seconds















    setTimeout(() => {















        if (chatWindow.classList.contains('hidden') && chatBadge) {















            chatBadge.classList.remove('hidden');















        }















    }, 4000);































    // Toggle Chat Window















    toggleBtn.addEventListener('click', () => {















        chatWindow.classList.toggle('hidden');















        if (!chatWindow.classList.contains('hidden')) {















            chatInput.focus();















            if (chatBadge) chatBadge.classList.add('hidden');















        }















    });































    closeBtn.addEventListener('click', () => {















        chatWindow.classList.add('hidden');















    });































    // Close on escape key















    document.addEventListener('keydown', (e) => {















        if (e.key === 'Escape' && !chatWindow.classList.contains('hidden')) {















            chatWindow.classList.add('hidden');















        }















    });































    // Send Message Trigger















    chatSend.addEventListener('click', handleUserSendMessage);















    chatInput.addEventListener('keypress', (e) => {















        if (e.key === 'Enter') {















            handleUserSendMessage();















        }















    });































    // Handle Quick Replies















    chatMessages.addEventListener('click', (e) => {















        if (e.target.classList.contains('quick-reply-btn')) {















            const query = e.target.getAttribute('data-query');















            if (query) {















                chatInput.value = query;















                handleUserSendMessage();















            }















        }















    });































    function handleUserSendMessage() {

        const text = chatInput.value.trim();

        if (!text) return;



        // Append User Message safely using textContent

        appendUserMessage(text);

        chatInput.value = '';



        // Show Typing Indicator

        showTypingIndicator();



        // Query Backend Flask AI Agent Endpoint

        fetch('/api/chat', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json'

            },

            body: JSON.stringify({ message: text })

        })

        .then(response => {

            if (!response.ok) throw new Error("Backend unavailable");

            return response.json();

        })

        .then(data => {

            removeTypingIndicator();

            if (data && data.success) {

                appendBotMessage(data.message);

            } else {

                const localResponse = generateAIResponse(text);

                appendBotMessage(localResponse);

            }

        })

        .catch(err => {

            console.log("Using client-side fallback AI matching:", err);

            removeTypingIndicator();

            const localResponse = generateAIResponse(text);

            appendBotMessage(localResponse);

        });

    }



    function appendUserMessage(text) {

        const msgDiv = document.createElement('div');

        msgDiv.className = 'chat-message user';

        const pEl = document.createElement('p');

        pEl.textContent = text;

        msgDiv.appendChild(pEl);



        // Remove existing quick replies block when user sends message

        const oldReplies = chatMessages.querySelector('.chat-quick-replies');

        if (oldReplies) {

            oldReplies.remove();

        }



        chatMessages.appendChild(msgDiv);

        chatMessages.scrollTop = chatMessages.scrollHeight;

    }



    function appendBotMessage(htmlContent) {

        const msgDiv = document.createElement('div');

        msgDiv.className = 'chat-message bot';

        const pEl = document.createElement('p');



        const parser = new DOMParser();

        const parsedDoc = parser.parseFromString(htmlContent, 'text/html');

        parsedDoc.body.querySelectorAll('script, iframe, object, embed, form').forEach(el => el.remove());

        while (parsedDoc.body.firstChild) {

            pEl.appendChild(parsedDoc.body.firstChild);

        }

        msgDiv.appendChild(pEl);



        chatMessages.appendChild(msgDiv);

        chatMessages.scrollTop = chatMessages.scrollHeight;

    }



    let activeThinkingOrb = null;



    function showTypingIndicator(state = 'searching') {

        removeTypingIndicator();



        const typingDiv = document.createElement('div');

        typingDiv.className = 'chat-message bot typing thinking-orb-container';

        typingDiv.id = 'chat-typing-indicator';

        typingDiv.style.display = 'flex';

        typingDiv.style.alignItems = 'center';

        typingDiv.style.gap = '10px';

        typingDiv.style.padding = '8px 14px';



        const orbSlot = document.createElement('div');

        orbSlot.className = 'orb-slot';

        orbSlot.style.display = 'inline-flex';

        orbSlot.style.alignItems = 'center';

        orbSlot.style.justifyContent = 'center';

        typingDiv.appendChild(orbSlot);



        const textSpan = document.createElement('span');

        textSpan.className = 'typing-text';

        textSpan.textContent = 'KALKI AI is thinking...';

        textSpan.style.fontSize = '0.85rem';

        textSpan.style.color = 'var(--text-muted, #94a3b8)';

        typingDiv.appendChild(textSpan);



        chatMessages.appendChild(typingDiv);

        chatMessages.scrollTop = chatMessages.scrollHeight;



        if (typeof ThinkingOrb !== 'undefined') {

            activeThinkingOrb = new ThinkingOrb({

                target: orbSlot,

                state: state,

                size: 28,

                color: '#00f0ff',

                dark: true

            });

        } else {

            for (let i = 0; i < 3; i++) {

                const dot = document.createElement('span');

                dot.className = 'typing-dot';

                orbSlot.appendChild(dot);

            }

        }

    }



    function removeTypingIndicator() {

        if (activeThinkingOrb) {

            activeThinkingOrb.destroy();

            activeThinkingOrb = null;

        }

        const indicator = document.getElementById('chat-typing-indicator');

        if (indicator) indicator.remove();

    }































    // Knowledge base intent processor















    function generateAIResponse(query) {















        const cleanQuery = query.toLowerCase().trim();































        // DOB & Age















        if (cleanQuery.includes('dob') || cleanQuery.includes('birth') || cleanQuery.includes('born') || cleanQuery.includes('age') || cleanQuery.includes('how old')) {















            return `Krishna Gupta was born on 17th October, 2005, and is currently 20 years old (turning 21 on October 17, 2026).`;















        }































        // 1. Identity / Who is Krishna















        if (cleanQuery.includes('who is') || cleanQuery.includes('about krishna') || cleanQuery.includes('profile') || cleanQuery.includes('summary')) {















            return `Krishna Gupta is a Data Science B.Tech student at the Oriental Institute of Science and Technology (Class of 2027) and an aspiring Data Scientist/AI Engineer. 















            <br><br>He has hands-on experience in Full Stack Development, REST APIs, LLM evaluation, prompt engineering, and data quality assurance.`;















        }































                // 2. Projects Intelligence (All 6 Technical Projects)

        if (cleanQuery.includes('kalki')) {

            return `<strong>KALKI 1.5 – Autonomous Multi-Agent OS & MLOps Platform</strong><br>

            • Engineered an autonomous multi-agent OS integrating LLMs & VLMs via LangGraph/LangChain.<br>

            • Built low-latency Hybrid RAG with FAISS (cutting retrieval latency by 40%).<br>

            • MLflow tracing, prompt evaluation templates, and automated guardrails.<br>

            • <a href="https://kalki.hg497kg.workers.dev/" target="_blank" style="color:#06b6d4;text-decoration:underline;">Live App</a> | <a href="https://github.com/KGupta171025/KALKI-1.5" target="_blank" style="color:#06b6d4;text-decoration:underline;">GitHub Repository</a>`;

        }



        if (cleanQuery.includes('score vision') || cleanQuery.includes('fog tech') || cleanQuery.includes('scorevision')) {

            return `<strong>Score Vision - AI (FOG Tech) – Computer Vision & OCR Platform</strong><br>

            • Intelligent OCR and computer vision pipeline with 92% extraction accuracy & sub-200ms semantic matching.<br>

            • Integrated Sentence-Transformers & FAISS vector databases for semantic matching & ETL deployed with FastAPI.<br>

            • <a href="https://scorevision-ai.hg497kg.workers.dev/" target="_blank" style="color:#06b6d4;text-decoration:underline;">Live App</a> | <a href="https://github.com/KGupta171025/FOG_Technologies" target="_blank" style="color:#06b6d4;text-decoration:underline;">GitHub Repository</a>`;

        }



        if (cleanQuery.includes('razorpay') || cleanQuery.includes('payment') || cleanQuery.includes('recovery')) {

            return `<strong>Razorpay Recovery – Smart Payment Recovery & FinTech Pipeline</strong><br>

            • Automated transaction recovery capturing failed payment webhooks in real time (recovering 18% abandoned checkouts).<br>

            • Analytical SQL schemas in PostgreSQL to aggregate failure patterns and automate notification triggers.<br>

            • <a href="https://razor-recovery.hg497kg.workers.dev/" target="_blank" style="color:#06b6d4;text-decoration:underline;">Live App</a> | <a href="https://github.com/KGupta171025/Razor-Recovery" target="_blank" style="color:#06b6d4;text-decoration:underline;">GitHub Repository</a>`;

        }



        if (cleanQuery.includes('shelf') || cleanQuery.includes('shelfscanner') || cleanQuery.includes('book')) {

            return `<strong>SHELF-SCANNER – High-Speed Computer Vision & OCR Platform</strong><br>

            • Image-to-text OCR and semantic book-matching platform using EasyOCR and FAISS vector search.<br>

            • Sub-200ms query retrieval latency across dense collections and physical libraries.<br>

            • <a href="https://shelf-scanner.hg497kg.workers.dev/" target="_blank" style="color:#06b6d4;text-decoration:underline;">Live App</a> | <a href="https://github.com/KGupta171025/SHELF-SCANNER" target="_blank" style="color:#06b6d4;text-decoration:underline;">GitHub Repository</a>`;

        }



        if (cleanQuery.includes('stock') || cleanQuery.includes('market') || cleanQuery.includes('smf')) {

            return `<strong>Future Stock Market Prediction & Quantitative Financial Modeling</strong><br>

            • Quantitative time-series forecasting model using PyTorch (LSTM) & Scikit-learn with 88% precision.<br>

            • MLflow hyperparameter tuning and experiment tracking for learning rates, sequence lengths, and optimizers.<br>

            • <a href="https://smf-ai.hg497kg.workers.dev/" target="_blank" style="color:#06b6d4;text-decoration:underline;">Live App</a> | <a href="https://github.com/KGupta171025" target="_blank" style="color:#06b6d4;text-decoration:underline;">GitHub</a>`;

        }



        if (cleanQuery.includes('revu') || cleanQuery.includes('revu social')) {

            return `<strong>RevU Social – Full-Stack Review & Analytics Platform</strong><br>

            • Full-stack review analytics platform built with React.js & Node.js REST APIs (20% user increase).<br>

            • Dimensional star-schema models in PostgreSQL/MySQL for real-time BI & performance dashboards.<br>

            • <a href="https://revu.social/" target="_blank" style="color:#06b6d4;text-decoration:underline;">Live Platform</a> | <a href="https://github.com/KGupta171025" target="_blank" style="color:#06b6d4;text-decoration:underline;">GitHub</a>`;

        }



        if (cleanQuery.includes('project') || cleanQuery.includes('portfolio')) {

            return `Krishna has engineered 6 key technical projects:<br>

            1. <strong>KALKI 1.5</strong> (Autonomous Multi-Agent OS & MLOps Platform)<br>

            2. <strong>Score Vision - AI</strong> (Computer Vision & Document OCR Extraction)<br>

            3. <strong>Razorpay Recovery</strong> (FinTech Automated Transaction Pipeline)<br>

            4. <strong>SHELF-SCANNER</strong> (High-Speed Computer Vision & OCR Platform)<br>

            5. <strong>Stock Market Prediction</strong> (Quantitative Financial LSTM & MLOps)<br>

            6. <strong>RevU Social</strong> (Full-Stack Review & BI Analytics Platform)`;

        }



        // 3. Skills (4 Structured Pillars)

        if (cleanQuery.includes('skill') || cleanQuery.includes('technolog') || cleanQuery.includes('languages') || cleanQuery.includes('stack')) {

            return `Krishna's technical skills are categorized into 4 core pillars:<br>

            • <strong>Generative AI & Agentic Systems</strong>: LLMs, VLMs, LangGraph, LangChain, Multi-Agents, Hybrid RAG, Prompt Engineering, RLHF/DPO, FAISS, pgvector, Hugging Face.<br>

            • <strong>MLOps & MLflow Ecosystem</strong>: MLflow (Tracing, Evaluation, Prompt Templates, AI Gateways, Agent Server, PyTorch/Scikit-Learn MLOps, Hyperparameter Tuning), Model Registry, Docker, AWS.<br>

            • <strong>Machine Learning & Deep Learning</strong>: Supervised/Unsupervised Learning, Classification, Regression, Time-Series (LSTM), Financial Modeling, OpenCV, EasyOCR, CNNs, PyTorch, TensorFlow.<br>

            • <strong>Backend, APIs & Databases</strong>: Python, SQL (PostgreSQL, MySQL), FastAPI, REST APIs, Microservices, Node.js, React.js, ETL/ELT Pipelines, Star/Snowflake Schemas, Git, Linux.`;

        }



        // 4. Experience (Dual Industry Internships)

        if (cleanQuery.includes('experience') || cleanQuery.includes('job') || cleanQuery.includes('work') || cleanQuery.includes('intern') || cleanQuery.includes('ethara') || cleanQuery.includes('kanchan')) {

            return `Krishna has dual industry internship experience:<br><br>

            1. <strong>Ethara.AI</strong> (Feb 2026 – May 2026) | <em>LLM & AI Post Training Intern (Remote)</em><br>

            • Benchmarked 50,000+ LLM outputs, boosting alignment, precision, and safety guardrails by 15%.<br>

            • Automated Python validation pipelines saving 20+ hrs/week in manual QA.<br><br>

            2. <strong>Kanchan Pvt Ltd – Sapphire</strong> (Oct 2025 – Feb 2026) | <em>Full Stack Development Intern (Remote)</em><br>

            • Architected full-stack web infrastructure for RevU Social (revu.social) driving 20% user increase.<br>

            • Optimized database schemas accelerating transactions by 25%, maintaining 99.9% uptime with Docker.`;

        }



        // 5. Certifications

        if (cleanQuery.includes('certificat') || cleanQuery.includes('credential') || cleanQuery.includes('aws') || cleanQuery.includes('ibm') || cleanQuery.includes('deloitte') || cleanQuery.includes('tata')) {

            return `Krishna holds prominent industry credentials:<br>

            • <strong>AWS Certified Developer Associate</strong> (Infosys Springboard, Jun 2026)<br>

            • <strong>Machine Learning with Python</strong> (IBM SkillsBuild, Jun 2026)<br>

            • <strong>Data Science & Analytics</strong> (HP LIFE, Jun 2026)<br>

            • <strong>Neural Networks and CNNs</strong> (LinkedIn Learning, Jun 2026)<br>

            • <strong>Deloitte Australia Data Analytics Job Simulation</strong> (Forage, Sep 2025)<br>

            • <strong>Tata Data Visualisation: Empowering Business with Insights</strong> (Forage, Sep 2025)<br>

            • <strong>Gemini for Google Workspace</strong> (Google, Dec 2025)<br>

            • <strong>Learning SQL Programming</strong> (LinkedIn Learning, Jun 2026)`;

        }



        































        // 7. Contact / Socials















        if (cleanQuery.includes('contact') || cleanQuery.includes('email') || cleanQuery.includes('phone') || cleanQuery.includes('hire') || cleanQuery.includes('linkedin')) {















            return `You can reach Krishna through the following channels:















            <br>• <strong>Email</strong>: <a href="mailto:hg497kg@gmail.com" style="color:#06b6d4;text-decoration:underline;">hg497kg@gmail.com</a>















            <br>• <strong>LinkedIn</strong>: <a href="https://linkedin.com/in/krishnaofficialgupta" target="_blank" style="color:#06b6d4;text-decoration:underline;">krishnaofficialgupta</a>















            <br>• <strong>GitHub</strong>: <a href="https://github.com/KGupta171025" target="_blank" style="color:#06b6d4;text-decoration:underline;">KGupta171025</a>















            <br>• <strong>Phone</strong>: +91-9993153109`;















        }































        // Default Fallback Response















        const suggestionsHTML = `















            I'm not sure I understand that query. 😅 Here are some topics I can answer:















            <div class="chat-quick-replies" style="margin-top: 10px;">















                <button class="quick-reply-btn" data-query="Who is Krishna Gupta?">About Krishna</button>















                <button class="quick-reply-btn" data-query="Tell me about KALKI 1.5">KALKI 1.5</button>















                <button class="quick-reply-btn" data-query="What are his core technical skills?">Skills</button>















                <button class="quick-reply-btn" data-query="Show professional experience">Experience</button>















                <button class="quick-reply-btn" data-query="How can I contact Krishna?">Contact Info</button>















            </div>















        `;















        return suggestionsHTML;















    }















}















































// Project Card 3D Flip Event Listener















document.addEventListener('DOMContentLoaded', () => {





















    const containers = document.querySelectorAll('.project-card-container');















    containers.forEach(container => {















        container.addEventListener('click', (e) => {















            // Prevent flipping if clicking links or nested icons inside back face















            if (e.target.closest('a') || e.target.closest('.project-links')) {















                return;















            }















            container.classList.toggle('flipped');















        });















    });















});


















// ============================================================================
// GEOLOCATION DYNAMIC RESUME ROUTER (Seamless Location-Based Delivery)
// MP Visitors -> Bhopal Resume | Outside MP / Global -> Bengaluru Resume
// Downloaded File Name: "Krishna Gupta Resume.pdf"
// ============================================================================

const GEO_RESUME_CONFIG = {
    mpResume: 'static/assets/Krishna_Gupta_Resume_MP.pdf',
    blrResume: 'static/assets/Krishna_Gupta_Resume_BLR.pdf',
    downloadName: 'Krishna Gupta Resume.pdf'
};

function isMadhyaPradeshRegion(regionStr, regionCode, stateStr) {
    const combined = `${regionStr || ''} ${regionCode || ''} ${stateStr || ''}`.toLowerCase();
    return /(madhya\s*pradesh|\bmp\b)/i.test(combined);
}

async function detectVisitorTargetResume() {
    try {
        const cached = sessionStorage.getItem('kg_target_resume');
        if (cached) return cached;
    } catch (e) {}

    const fetchTimeout = (url, timeoutMs = 2500) => {
        return Promise.race([
            fetch(url).then(res => res.ok ? res.json() : Promise.reject('HTTP ' + res.status)),
            new Promise((_, reject) => setTimeout(() => reject('Timeout'), timeoutMs))
        ]);
    };

    let targetResume = GEO_RESUME_CONFIG.blrResume; // Default to Bengaluru / Global for non-MP & international

    try {
        // 1. Primary: ipapi.co
        const d1 = await fetchTimeout('https://ipapi.co/json/', 2500);
        if (d1 && isMadhyaPradeshRegion(d1.region, d1.region_code, d1.region)) {
            targetResume = GEO_RESUME_CONFIG.mpResume;
        }
    } catch (e1) {
        try {
            // 2. Fallback: freeipapi.net
            const d2 = await fetchTimeout('https://freeipapi.net/api/json', 2500);
            if (d2 && isMadhyaPradeshRegion(d2.regionName, d2.regionCode, d2.regionName)) {
                targetResume = GEO_RESUME_CONFIG.mpResume;
            }
        } catch (e2) {
            try {
                // 3. Fallback: ipwhois.app
                const d3 = await fetchTimeout('https://ipwhois.app/json/', 2500);
                if (d3 && isMadhyaPradeshRegion(d3.region, d3.region_code, d3.region)) {
                    targetResume = GEO_RESUME_CONFIG.mpResume;
                }
            } catch (e3) {
                // Default remains BLR
            }
        }
    }

    try {
        sessionStorage.setItem('kg_target_resume', targetResume);
    } catch (e) {}

    return targetResume;
}

function updateAllResumeLinks(targetUrl) {
    const resumeLinks = document.querySelectorAll('a[href*="Resume"], .btn-geo-resume, .btn-download-resume');
    resumeLinks.forEach(link => {
        link.setAttribute('href', targetUrl);
        link.setAttribute('download', GEO_RESUME_CONFIG.downloadName);
    });
}

function initGeoResumeRouter() {
    // Pre-resolve location on page load
    detectVisitorTargetResume().then(targetUrl => {
        updateAllResumeLinks(targetUrl);
    });

    // Intercept click on any download resume button to guarantee seamless delivery
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('a[href*="Resume"], .btn-geo-resume, .btn-download-resume');
        if (btn) {
            e.preventDefault();
            e.stopPropagation();

            let targetUrl = null;
            try {
                targetUrl = sessionStorage.getItem('kg_target_resume');
            } catch (err) {}

            if (!targetUrl) {
                targetUrl = await detectVisitorTargetResume();
            }

            const downloadUrl = targetUrl || GEO_RESUME_CONFIG.blrResume;
            
            // Programmatically trigger download with exact clean filename
            const dl = document.createElement('a');
            dl.href = downloadUrl;
            dl.download = GEO_RESUME_CONFIG.downloadName;
            dl.target = '_blank';
            dl.style.display = 'none';
            document.body.appendChild(dl);
            dl.click();
            setTimeout(() => {
                try { document.body.removeChild(dl); } catch (re) {}
            }, 100);
        }
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGeoResumeRouter);
} else {
    initGeoResumeRouter();
}
