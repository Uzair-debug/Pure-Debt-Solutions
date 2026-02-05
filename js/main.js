// PureDebt Solutions - Main JavaScript
// Minimal, performance-focused, well-organized

(function() {
    'use strict';
    
    // ============================================
    // Configuration & Constants
    // ============================================
    const CONFIG = window.CONFIG || {
        phone: '+27 73 384 0515',
        email: 'mogamaduzair@gmail.com',
        apiUrl: '/api/contact'
    };
    
    // ============================================
    // Utility Functions
    // ============================================
    const utils = {
        // Debounce function for performance
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Check if element is in viewport
        isInViewport: function(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },
        
        // Safe query selector
        $: function(selector, context = document) {
            try {
                return context.querySelector(selector);
            } catch (e) {
                console.warn('Invalid selector:', selector);
                return null;
            }
        },
        
        // Safe query selector all
        $$: function(selector, context = document) {
            try {
                return Array.from(context.querySelectorAll(selector));
            } catch (e) {
                console.warn('Invalid selector:', selector);
                return [];
            }
        }
    };

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    function initMobileMenu() {
        const mobileMenuToggle = utils.$('#mobileMenuToggle');
        const navMenu = utils.$('#navMenu');
        const body = document.body;
        
        if (!mobileMenuToggle || !navMenu) return;
        
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = this.classList.contains('active');
            
            if (isActive) {
                // Close menu
                this.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            } else {
                // Open menu
                this.classList.add('active');
                navMenu.classList.add('active');
                body.classList.add('menu-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'true');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active')) {
                if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    mobileMenuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    body.classList.remove('menu-open');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.focus();
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ============================================
    // Header Scroll Effect (Disabled - header is static)
    // ============================================
    function initHeaderScroll() {
        // Header is now static, no scroll effect needed
        return;
    }

    // ============================================
    // Set Current Year
    // ============================================
    function initCurrentYear() {
        const yearElements = utils.$$('#currentYear');
        const currentYear = new Date().getFullYear();
        yearElements.forEach(el => {
            if (el) el.textContent = currentYear;
        });
    }

    // FAQ Accordion (handled inline in faqs.html for better performance)

    // ============================================
    // Form Validation & Submission
    // ============================================
    function initContactForm() {
        const contactForm = utils.$('#contactForm');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!data.name || !data.email || !data.phone || !data.message) {
                showFormError('Please fill in all required fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showFormError('Please enter a valid email address.');
                return;
            }
            
            // Phone validation (basic)
            const phoneRegex = /^[\d\s\+\-\(\)]+$/;
            if (!phoneRegex.test(data.phone) || data.phone.length < 10) {
                showFormError('Please enter a valid phone number.');
                return;
            }

            // Disable submit button
            const submitBtn = this.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            submitBtn.setAttribute('aria-busy', 'true');

            try {
                const response = await fetch(CONFIG.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showFormSuccess(result.message || 'Thank you! We\'ve received your message and will contact you soon.');
                    this.reset();
                } else {
                    throw new Error(result.error || 'Failed to send message');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showFormError('Something went wrong. Please try again or contact us directly via phone or WhatsApp.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.removeAttribute('aria-busy');
            }
        });
    }

    // ============================================
    // Form Message Display
    // ============================================
    function showFormError(message) {
        const errorDiv = utils.$('#formError');
        const successDiv = utils.$('#formSuccess');
        
        if (successDiv) successDiv.style.display = 'none';
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            errorDiv.setAttribute('role', 'alert');
            errorDiv.setAttribute('aria-live', 'polite');
            
            // Scroll to error message
            errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            setTimeout(() => {
                errorDiv.style.display = 'none';
                errorDiv.removeAttribute('role');
                errorDiv.removeAttribute('aria-live');
            }, 5000);
        }
    }

    function showFormSuccess(message) {
        const successDiv = utils.$('#formSuccess');
        const errorDiv = utils.$('#formError');
        
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
            successDiv.setAttribute('role', 'status');
            successDiv.setAttribute('aria-live', 'polite');
            
            setTimeout(() => {
                successDiv.style.display = 'none';
                successDiv.removeAttribute('role');
                successDiv.removeAttribute('aria-live');
            }, 5000);
        }
    }

    // ============================================
    // Lazy Loading for Images
    // ============================================
    function initLazyLoading() {
        if (!('IntersectionObserver' in window)) return;
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });

        utils.$$('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // Scroll-Triggered Animations
    // ============================================
    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: show all elements immediately
            utils.$$('.animate-on-scroll').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }
        
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Skip animations for users who prefer reduced motion
            utils.$$('.animate-on-scroll').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }
        
        const animateObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }, index * 100);
                    animateObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Animate cards and sections
        utils.$$('.card, .step-card, .faq-item, .section').forEach((el) => {
            if (!el.classList.contains('hero')) {
                el.classList.add('animate-on-scroll');
                el.style.transform = 'translateY(30px)';
                el.style.opacity = '0';
                animateObserver.observe(el);
            }
        });
    }

    // ============================================
    // Parallax Effect (Optional, subtle)
    // ============================================
    function initParallax() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return; // Skip parallax for users who prefer reduced motion
        }
        
        const heroContent = utils.$('.hero-content');
        if (!heroContent) return;
        
        const handleParallax = utils.debounce(function() {
            const currentScroll = window.pageYOffset;
            if (currentScroll < window.innerHeight) {
                const parallax = currentScroll * 0.3;
                heroContent.style.transform = `translateY(${parallax}px)`;
                heroContent.style.opacity = Math.max(0.5, 1 - (currentScroll / window.innerHeight) * 0.5);
            }
        }, 10);
        
        window.addEventListener('scroll', handleParallax, { passive: true });
    }
    
    // ============================================
    // Initialize All Features
    // ============================================
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        try {
            initMobileMenu();
            initHeaderScroll();
            initCurrentYear();
            initContactForm();
            initLazyLoading();
            initScrollAnimations();
            initParallax();
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }
    
    // Start initialization
    init();

})();
