// ==========================================
// Krishna Gupta - Interactive Scripts
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle Logic
    const body = document.body;
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = themeToggleBtn.querySelector('i');

    // Load theme preference from localStorage or default to dark
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

    // 2. Mobile Responsive Menu
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

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navHamburger.querySelector('i').className = 'fas fa-bars';
        });
    });

    // 3. Navbar scroll layout change
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Skills Tab Filter
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active to current click
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // 5. ScrollSpy (Active nav link highlighting)
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // 6. Contact Form Mock Submission
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const btnText = document.getElementById('btnText');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Loading state
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        formFeedback.className = 'form-feedback hidden';

        // Simulate AJAX request
        setTimeout(() => {
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
            
            // Show custom success feedback
            formFeedback.textContent = 'Thank you for reaching out, Krishna will respond to you shortly!';
            formFeedback.className = 'form-feedback success';

            // Reset form fields
            contactForm.reset();
        }, 1500);
    });
});
