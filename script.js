document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       THEME MANAGER (DARK / LIGHT MODE)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;

    // Check for saved theme preference or default to dark-theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    
    if (savedTheme) {
        body.className = savedTheme;
    } else {
        body.className = 'dark-theme';
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('portfolio-theme', 'light-theme');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('portfolio-theme', 'dark-theme');
        }
    });

    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const navMenu = document.getElementById('nav-menu');
    const menuOpenIcon = menuToggleBtn.querySelector('.menu-open');
    const menuCloseIcon = menuToggleBtn.querySelector('.menu-close');

    function toggleMenu() {
        navMenu.classList.toggle('open');
        menuOpenIcon.classList.toggle('hidden');
        menuCloseIcon.classList.toggle('hidden');
    }

    menuToggleBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================================================
       DYNAMIC TYPEWRITER ANIMATION
       ========================================================================== */
    const typewriterElement = document.getElementById('typewriter');
    const words = [
        "IT Professional",
        "Cisco Certified",
        "Aspiring Digital Marketer",
        "Software Developer"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typewriterSpeed = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typewriterSpeed = 50; // Deleting is faster
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typewriterSpeed = 100; // Normal typing speed
        }

        if (!isDeleting && charIndex === currentWord.length) {
            // Word fully typed. Wait then delete.
            isDeleting = true;
            typewriterSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            // Word fully deleted. Move to next.
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typewriterSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typewriterSpeed);
    }

    if (typewriterElement) {
        setTimeout(typeEffect, 1000);
    }

    /* ==========================================================================
       INTERSECTION OBSERVER (SCROLL SPY & REVEAL ON SCROLL)
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    // Scroll Spy: Update navigation links active state
    const scrollSpyOptions = {
        root: null,
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: "-80px 0px 0px 0px" // Account for fixed header height
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, scrollSpyOptions);

    sections.forEach(section => {
        scrollSpyObserver.observe(section);
    });

    // Reveal elements on scroll
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve once revealed to optimize performance
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    scrollRevealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================================================
       CONTACT FORM VALIDATION & INTERACTIVE SUBMISSION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const successToast = document.getElementById('success-toast');
    const toastCloseBtn = document.getElementById('toast-close-btn');

    // Simple Email regex validator
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function checkField(inputElement, errorElement, validationFn) {
        const value = inputElement.value.trim();
        let isValid = true;
        
        if (validationFn) {
            isValid = validationFn(value);
        } else {
            isValid = value.length > 0;
        }

        const formGroup = inputElement.parentElement;
        if (!isValid) {
            formGroup.classList.add('invalid');
        } else {
            formGroup.classList.remove('invalid');
        }
        return isValid;
    }

    // Input elements
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');

    // Blur events for real-time validation
    nameInput.addEventListener('blur', () => checkField(nameInput));
    emailInput.addEventListener('blur', () => checkField(emailInput, null, validateEmail));
    subjectInput.addEventListener('blur', () => checkField(subjectInput));
    messageInput.addEventListener('blur', () => checkField(messageInput));

    // Submit handler
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = checkField(nameInput);
        const isEmailValid = checkField(emailInput, null, validateEmail);
        const isSubjectValid = checkField(subjectInput);
        const isMessageValid = checkField(messageInput);

        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            // Form is valid! Simulate API post
            const submitBtn = document.getElementById('form-submit-btn');
            const originalBtnContent = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i data-lucide="loader-2" class="spin-icon"></i> Sending...`;
            if (typeof lucide !== 'undefined') lucide.createIcons();

            // Simulate server network latency of 1 second
            setTimeout(() => {
                // Reset submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                if (typeof lucide !== 'undefined') lucide.createIcons();

                // Show success toast
                successToast.classList.remove('hidden');
                
                // Reset form fields
                contactForm.reset();
                document.querySelectorAll('.form-group').forEach(group => group.classList.remove('invalid'));

                // Auto-close toast after 5 seconds
                setTimeout(() => {
                    successToast.classList.add('hidden');
                }, 5000);

            }, 1000);
        }
    });

    // Close toast button
    toastCloseBtn.addEventListener('click', () => {
        successToast.classList.add('hidden');
    });

    /* ==========================================================================
       RESUME PRINT TRIGGER
       ========================================================================== */
    const printResumeBtn = document.getElementById('print-resume-btn');
    if (printResumeBtn) {
        printResumeBtn.addEventListener('click', () => {
            window.print();
        });
    }
});
