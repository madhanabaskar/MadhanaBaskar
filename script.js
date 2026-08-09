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
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // In a real application, you would send this data to a backend or service like Formspree
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Simulate sending state
            submitBtn.textContent = 'Sending...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.backgroundColor = 'var(--color-terracotta)';
                submitBtn.style.color = 'var(--color-white)';
                
                // Reset form
                contactForm.reset();
                
                // Revert button after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
});
