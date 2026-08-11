/**
 * MB DESIGNS PORTFOLIO
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sticky Navbar ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for fixed navbar
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Intersection Observer for Fade-up and Reveal Animations ---
    const animationOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated in
                // observer.unobserve(entry.target); 
            }
        });
    }, animationOptions);

    // Select all elements that should animate in
    const animatedElements = document.querySelectorAll('.fade-up, .reveal-image');
    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // --- Form Handling ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        let isSubmitting = false;
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (isSubmitting) return;

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const projectType = document.getElementById('project-type').value;
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            let formMessage = document.getElementById('form-message');
            if (!formMessage) {
                formMessage = document.createElement('div');
                formMessage.id = 'form-message';
                formMessage.style.marginTop = '1rem';
                formMessage.style.fontSize = '0.95rem';
                formMessage.style.fontWeight = '500';
                formMessage.style.textAlign = 'center';
                contactForm.appendChild(formMessage);
            }
            formMessage.textContent = '';
            
            isSubmitting = true;
            submitBtn.textContent = 'Sending...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, projectType, message })
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.error || 'Error sending email.');
                }

                formMessage.textContent = 'Thanks! Your message has been sent successfully.';
                formMessage.style.color = '#2e7d32'; // a clean green
                
                submitBtn.style.backgroundColor = 'var(--color-terracotta)';
                submitBtn.style.color = 'var(--color-white)';
                
                contactForm.reset();
            } catch (error) {
                formMessage.textContent = error.message || 'Failed to send message. Please try again later.';
                formMessage.style.color = '#d32f2f'; // a clean red
            } finally {
                isSubmitting = false;
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.color = '';
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    if(formMessage) formMessage.textContent = '';
                }, 5000);
            }
        });
    }
});
