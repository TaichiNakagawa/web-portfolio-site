document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';

            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 50);
        });

        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
            follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        // Hover effect for links
        const links = document.querySelectorAll('a, button, .work-card');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.backgroundColor = 'transparent';
                cursor.style.border = '1px solid var(--primary-color)';
                follower.style.opacity = '0';
            });
            link.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'var(--primary-color)';
                cursor.style.border = 'none';
                follower.style.opacity = '1';
            });
        });
    }

    // Scroll Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');

        // Animate burger menu
        const bars = document.querySelectorAll('.bar');
        if (nav.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close menu when link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');

            // Reset burger menu
            const bars = document.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    // Scroll Reveal Animation
    const sections = document.querySelectorAll('.section');

    const revealSection = () => {
        const triggerBottom = window.innerHeight * 0.8;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;

            if (sectionTop < triggerBottom) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial styles for sections
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 1s ease';
    });

    // Run once on load
    revealSection();

    // Run on scroll
    window.addEventListener('scroll', revealSection);

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const workImages = document.querySelectorAll('.work-image img');
    const closeBtn = document.querySelector('.lightbox-close');

    workImages.forEach(image => {
        image.style.cursor = 'zoom-in';
        image.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent other click events
            lightboxImg.src = image.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable scroll
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Enable scroll
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', closeLightbox);

    // Back to Top functionality
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Reset status
            formStatus.className = 'form-status';
            formStatus.textContent = 'Sending...';
            formStatus.style.display = 'block';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                // NOTE: Using the user's actual Formspree endpoint
                const response = await fetch('https://formspree.io/f/xbdaakro', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.classList.add('success');
                    formStatus.textContent = 'ありがとうございます！メッセージは正常に送信されました。';
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        formStatus.textContent = data['errors'].map(error => error['message']).join(', ');
                    } else {
                        formStatus.textContent = 'エラーが発生しました。時間をおいて再度お試しください。';
                    }
                    formStatus.classList.add('error');
                }
            } catch (error) {
                formStatus.classList.add('error');
                formStatus.textContent = 'ネットワークエラーが発生しました。接続を確認してください。';
            } finally {
                submitBtn.disabled = false;
            }
        });
    }
});
