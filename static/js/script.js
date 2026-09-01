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



    // 0. Initialize Lenis Smooth Scroll Engine (Disabled for instant scroll response)
    /*
    try {
        initLenisScroll();
    } catch (e) {
        console.error("Lenis scroll initialization failed:", e);
    }
    */



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
        if (window.innerWidth < 768) {
            // Mobile: Position in subtle upper-right background, scaled small, low ambient opacity
            shapeMesh.position.set(1.5, 3.2, -3.5);
            initialY = 3.2;
            shapeMesh.scale.set(0.4, 0.4, 0.4);
            shapeMat.opacity = 0.07;
        } else if (window.innerWidth < 992) {
            // Tablet
            shapeMesh.position.set(2.2, 2.0, -2.0);
            initialY = 2.0;
            shapeMesh.scale.set(0.65, 0.65, 0.65);
            shapeMat.opacity = 0.11;
        } else {
            // Desktop
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

        // Adjust mesh Y position based on document scroll (3D parallax) with smooth damping
        const scrollFraction = window.scrollY / Math.max(window.innerHeight, 1);
        const visibleHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
        const scrollFactor = window.innerWidth < 768 ? 0.3 : 1.0;
        shapeMesh.position.y = initialY - (scrollFraction * visibleHeight * scrollFactor);

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







function initLenisScroll() {







    const lenis = new Lenis({







        duration: 0.8, // Snappier duration for instant responsiveness







        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),







        direction: 'vertical',







        gestureDirection: 'vertical',







        smooth: true,







        mouseMultiplier: 1,







        smoothTouch: false,







    });















    lenis.on('scroll', ScrollTrigger.update);















    function raf(time) {







        lenis.raf(time);







        requestAnimationFrame(raf);







    }







    requestAnimationFrame(raf);







}















function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // A. Hero text elements entrance
    gsap.fromTo(".hero-content > *", 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power1.out" }
    );

    // B. Hero visual layout code terminal
    gsap.fromTo(".hero-visual", 
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power1.out", delay: 0.15 }
    );

    // C. Section Headers on scroll
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.fromTo(header, 
            { opacity: 0, y: 15 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.3, 
                scrollTrigger: {
                    trigger: header,
                    start: "top 95%",
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
                duration: 0.35, 
                stagger: 0.05, 
                ease: "power1.out", 
                scrollTrigger: {
                    trigger: ".projects-grid",
                    start: "top 95%",
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
                    duration: 0.35, 
                    ease: "power1.out", 
                    scrollTrigger: {
                        trigger: item,
                        start: "top 95%",
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
                duration: 0.3, 
                stagger: 0.03, 
                ease: "power1.out", 
                scrollTrigger: {
                    trigger: ".skills-grid",
                    start: "top 95%",
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
                duration: 0.3, 
                stagger: 0.04, 
                ease: "power1.out", 
                scrollTrigger: {
                    trigger: ".certifications-grid",
                    start: "top 95%",
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
            { opacity: 0, y: 15 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.35, 
                ease: "power1.out", 
                scrollTrigger: isHero ? null : {
                    trigger: el,
                    start: "top 95%",
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







    







    // Dynamic Math Captcha Generator (Spambot defense)







    const num1 = Math.floor(Math.random() * 10) + 1;







    const num2 = Math.floor(Math.random() * 10) + 1;







    const captchaAnswer = (num1 + num2).toString();















    // Dynamically insert Captcha field in the form above the submit button







    const captchaGroup = document.createElement('div');







    captchaGroup.className = 'form-group';







    captchaGroup.id = 'captchaGroup';







    captchaGroup.innerHTML = `







        <label for="captchaCode">Human Verification: What is ${num1} + ${num2}?</label>







        <input type="text" id="captchaCode" placeholder="Enter answer" required style="text-align: center; font-size: 1rem; font-weight: bold;">







    `;







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







            generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();















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















/* ==========================================================







   7. Log visitor analytics to Firebase Firestore







   ========================================================== */







function logVisitor() {







    if (typeof db === 'undefined') return;















    // Use session storage to prevent logging duplicate requests from the same tab session







    if (sessionStorage.getItem('portfolio_visited')) return;







    sessionStorage.setItem('portfolio_visited', 'true');















    // Fetch geolocation data from ipapi.co (free public IP/Geo API)







    fetch('https://ipapi.co/json/')







        .then(response => response.json())







        .then(geoData => {







            const visitorData = {







                ip: geoData.ip || 'Unknown',







                city: geoData.city || 'Unknown',







                region: geoData.region || 'Unknown',







                country: geoData.country_name || 'Unknown',







                org: geoData.org || 'Unknown',







                userAgent: navigator.userAgent,







                language: navigator.language || 'Unknown',







                screenSize: `${window.innerWidth}x${window.innerHeight}`,







                referrer: document.referrer || 'Direct / Bookmark',







                page: window.location.pathname,







                timestamp: firebase.firestore.FieldValue.serverTimestamp()







            };















            db.collection("visitor_logs").add(visitorData)







                .then(() => console.log("Visitor analytics logged successfully."))







                .catch(err => console.error("Error logging analytics:", err));







        })







        .catch(err => {







            // Fallback if IP API fails or is blocked by an adblocker







            const visitorData = {







                ip: 'Blocked/Failed',







                city: 'Unknown',







                region: 'Unknown',







                country: 'Unknown',







                org: 'Unknown',







                userAgent: navigator.userAgent,







                language: navigator.language || 'Unknown',







                screenSize: `${window.innerWidth}x${window.innerHeight}`,







                referrer: document.referrer || 'Direct / Bookmark',







                page: window.location.pathname,







                timestamp: firebase.firestore.FieldValue.serverTimestamp()







            };















            db.collection("visitor_logs").add(visitorData)







                .then(() => console.log("Visitor metadata logged (sans geo)."))







                .catch(dbErr => console.error("Error logging metadata:", dbErr));







        });







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















        // Append User Message







        appendMessage(text, 'user');







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







                appendMessage(data.message, 'bot');







            } else {







                const localResponse = generateAIResponse(text);







                appendMessage(localResponse, 'bot');







            }







        })







        .catch(err => {







            console.log("Using client-side fallback AI matching:", err);







            removeTypingIndicator();







            const localResponse = generateAIResponse(text);







            appendMessage(localResponse, 'bot');







        });







    }















    function appendMessage(text, sender) {







        const msgDiv = document.createElement('div');







        msgDiv.className = `chat-message ${sender}`;







        msgDiv.innerHTML = `<p>${text}</p>`;







        







        // Remove existing quick replies block if bot sends a new message







        const oldReplies = chatMessages.querySelector('.chat-quick-replies');







        if (oldReplies && sender === 'user') {







            oldReplies.remove();







        }















        chatMessages.appendChild(msgDiv);







        chatMessages.scrollTop = chatMessages.scrollHeight;







    }















    function showTypingIndicator() {







        const typingDiv = document.createElement('div');







        typingDiv.className = 'chat-message bot typing';







        typingDiv.id = 'chat-typing-indicator';







        typingDiv.innerHTML = `







            <span class="typing-dot"></span>







            <span class="typing-dot"></span>







            <span class="typing-dot"></span>







        `;







        chatMessages.appendChild(typingDiv);







        chatMessages.scrollTop = chatMessages.scrollHeight;







    }















    function removeTypingIndicator() {







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















        // 2. KALKI 1.5







        if (cleanQuery.includes('kalki') || cleanQuery.includes('intelligence operating system') || cleanQuery.includes('ios')) {







            return `<strong>KALKI 1.5</strong> is Krishna's flagship project! It is an <em>Enterprise Intelligence Operating System</em> that integrates LLMs, Vision Language Models (VLMs), and autonomous multi-agent workflows.







            <br><br>Key Features:







            <br>• Hybrid RAG pipeline to optimize search speeds.







            <br>• Agentic safety protocols and defensive cybersecurity layers.







            <br>• Repository: <a href="https://github.com/KGupta171025/KALKI-1.5" target="_blank" style="color:#06b6d4;text-decoration:underline;">KALKI 1.5 on GitHub</a>`;







        }















        // 3. RevU Social







        if (cleanQuery.includes('revu') || cleanQuery.includes('revu social') || cleanQuery.includes('opinion-play')) {







            return `<strong>RevU Social</strong> is a full-stack social review and analytics platform engineered by Krishna.







            <br><br>Stack: React.js, Node.js, Express.js, MySQL, and PostgreSQL.







            <br>• Live Demo: <a href="https://www.revu.social/" target="_blank" style="color:#06b6d4;text-decoration:underline;">revu.social</a>







            <br>• Repository: <a href="https://github.com/srohatgi01/opinion-play-earn" target="_blank" style="color:#06b6d4;text-decoration:underline;">opinion-play-earn</a>`;







        }















        // 4. Skills







        if (cleanQuery.includes('skill') || cleanQuery.includes('technolog') || cleanQuery.includes('languages') || cleanQuery.includes('programming')) {







            return `Krishna's technical skillset includes:







            <br>• <strong>Programming</strong>: Python, SQL, JavaScript (ES6+), C++.







            <br>• <strong>AI & Machine Learning</strong>: PyTorch, TensorFlow, LLMs, NLP, Prompt Engineering.







            <br>• <strong>Web & APIs</strong>: FastAPI, Flask, React.js, Node.js, Express.js.







            <br>• <strong>Databases & Tools</strong>: PostgreSQL, MySQL, Supabase, Git, Docker, AWS.`;







        }















        // 5. Experience







        if (cleanQuery.includes('experience') || cleanQuery.includes('job') || cleanQuery.includes('work') || cleanQuery.includes('intern')) {







            return `Krishna has completed two key internships:







            <br><br>1. <strong>Ethara AI</strong> (Feb 2026 – May 2026): <em>LLM Post Training Intern</em>. Evaluated 50,000+ LLM responses and built automated Python pipelines.







            <br>2. <strong>Kanchan Pvt Ltd</strong> (Oct 2025 – Feb 2026): <em>Full Stack Development Intern</em>. Built the core architecture of RevU Social.`;







        }















        // 6. Certifications







        if (cleanQuery.includes('certificat') || cleanQuery.includes('credential') || cleanQuery.includes('aws')) {







            return `Krishna holds several prominent certifications:







            <br>• <strong>AWS Certified Developer Associate</strong> (Infosys Springboard, Jun 2026)







            <br>• <strong>Machine Learning with Python</strong> (IBM SkillsBuild, Jun 2026)







            <br>• <strong>Data Science & Analytics</strong> (HP LIFE, Jun 2026)







            <br>• <strong>Tata Data Visualisation</strong> (Forage, Sep 2025)`;







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







