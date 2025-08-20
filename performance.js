// Performance Optimization Script
document.addEventListener('DOMContentLoaded', function() {
    
    // Lazy Loading for Images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Smooth reveal animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add reveal animation to sections
    const revealElements = document.querySelectorAll('.hero-section, .about-section, .experience-section, .skills-section, .projects-section, .contact-section');
    revealElements.forEach(el => {
        el.classList.add('reveal-element');
        revealObserver.observe(el);
    });

    // Preload critical resources
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    preloadLink.as = 'style';
    document.head.appendChild(preloadLink);

    // Service Worker Registration (if available)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker registration failed, but that's okay
        });
    }

    // Performance monitoring
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.startTime);
                }
            }
        });
        observer.observe({type: 'largest-contentful-paint', buffered: true});
    }

    // Optimize scroll performance
    let ticking = false;
    
    function updateScrollEffects() {
        const scrollY = window.scrollY;
        const navbar = document.querySelector('.navbar');
        
        // Update navbar
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Parallax effect for hero section
        const hero = document.querySelector('.hero-section');
        if (hero && scrollY < window.innerHeight) {
            hero.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
        
        ticking = false;
    }
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    
    // Optimize resize handling
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Handle resize optimizations here
            updateScrollEffects();
        }, 250);
    }, { passive: true });

    // Prefetch important pages/resources on hover
    const importantLinks = document.querySelectorAll('a[href^="#"], .project-link');
    importantLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (link.href && !link.href.includes('#')) {
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = link.href;
                document.head.appendChild(prefetchLink);
            }
        }, { once: true });
    });
});

// Add CSS for reveal animations
const style = document.createElement('style');
style.textContent = `
    .reveal-element {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .reveal-element.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .lazy {
        filter: blur(5px);
        transition: filter 0.3s;
    }
    
    .lazy.loaded {
        filter: blur(0);
    }
`;
document.head.appendChild(style);
