document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       1. Custom Cursor
       ========================================= */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Only run if cursor elements exist (hidden on mobile via CSS, but JS might still run)
    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows exactly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with slight delay
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effect to clickable elements
        const clickables = document.querySelectorAll('a, button, input, textarea, .project-card, .social-icon');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    /* =========================================
       2. Typing Effect for Subtitle
       ========================================= */
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const roles = ["Java Developer", "MERN Stack Specialist", "Creative Problem Solver", "Full Stack Dev"];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typeEffect = () => {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                // Remove character
                typingText.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                // Add character
                typingText.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            // Speed of typing
            let typeSpeed = isDeleting ? 50 : 100;

            // Reached end of word
            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // Finished deleting
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before typing next
            }

            setTimeout(typeEffect, typeSpeed);
        };

        // Start typing effect
        setTimeout(typeEffect, 1000);
    }

    /* =========================================
       3. Navbar Scroll Effect & Mobile Menu
       ========================================= */
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        // Navbar transparency
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll progress bar
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        if (scrollProgress) scrollProgress.style.width = `${progress}%`;

        // Back to top button
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Mobile Hamburger
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.querySelector('i').classList.toggle('fa-times');
            hamburger.querySelector('i').classList.toggle('fa-bars');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.querySelector('i').classList.add('fa-bars');
                hamburger.querySelector('i').classList.remove('fa-times');
            });
        });
    }

    /* =========================================
       4. Scroll Reveal (Intersection Observer)
       ========================================= */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Animate skill bars specifically if container is revealed
                if (entry.target.classList.contains('skill-category')) {
                    const bars = entry.target.querySelectorAll('.skill-bar-fill');
                    bars.forEach(bar => {
                        const targetWidth = bar.parentElement.previousElementSibling.lastElementChild.textContent;
                        bar.style.width = targetWidth;
                    });
                }

                // Observer can stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(revealCallback, revealOptions);
        revealElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    /* =========================================
       5. Section Active State Spy
       ========================================= */
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    /* =========================================
       6. 3D Tilt Effect for Project Cards
       ========================================= */
    const tiltCards = document.querySelectorAll('.tilt-card');

    if (window.matchMedia("(pointer: fine)").matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element.
                const y = e.clientY - rect.top;  // y position within the element.

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Max rotation in degrees
                const maxRotation = 10;

                const rotateX = ((y - centerY) / centerY) * -maxRotation;
                const rotateY = ((x - centerX) / centerX) * maxRotation;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

                // Add a subtle glare effect based on mouse position
                const content = card.querySelector('.project-content');
                if (content) {
                    content.style.transform = `translateZ(40px)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                const content = card.querySelector('.project-content');
                if (content) {
                    content.style.transform = `translateZ(30px)`;
                }
            });
        });
    }

    /* =========================================
       7. Contact Form Demo Handler
       ========================================= */
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.submit-btn span');
            const originalText = btn.textContent;

            btn.textContent = 'Sending...';

            // Simulate network request
            setTimeout(() => {
                contactForm.reset();
                formSuccess.style.display = 'block';
                btn.textContent = originalText;

                setTimeout(() => {
                    formSuccess.style.display = 'none';
                }, 5000);
            }, 1500);
        });
    }
});
