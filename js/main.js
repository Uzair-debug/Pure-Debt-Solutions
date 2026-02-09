// PureDebt Solutions - Main JavaScript
// Minimal, performance-focused, well-organized

(function() {
    'use strict';
    
    // ============================================
    // Configuration & Constants
    // ============================================
    const CONFIG = window.CONFIG || {
        phone: '+27 73 384 0515',
        email: 'admin@puredebtsolutions.africa',
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
                return null;
            }
        },
        
        // Safe query selector all
        $$: function(selector, context = document) {
            try {
                return Array.from(context.querySelectorAll(selector));
            } catch (e) {
                return [];
            }
        }
    };

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    function initMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        const body = document.body;
        
        if (!mobileMenuToggle || !navMenu) return;
        
        // Ensure menu starts closed
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        body.classList.remove('menu-open');
        
        // Remove any existing listeners by cloning
        const newToggle = mobileMenuToggle.cloneNode(true);
        mobileMenuToggle.parentNode.replaceChild(newToggle, mobileMenuToggle);
        
        // Get fresh reference
        const toggle = document.getElementById('mobileMenuToggle');
        const menu = document.getElementById('navMenu');
        
        // Toggle menu function
        function toggleMenu() {
            const isActive = menu.classList.contains('active');
            if (isActive) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                body.classList.remove('menu-open');
                toggle.setAttribute('aria-expanded', 'false');
            } else {
                toggle.classList.add('active');
                menu.classList.add('active');
                body.classList.add('menu-open');
                toggle.setAttribute('aria-expanded', 'true');
            }
        }
        
        // Add click event listener
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
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

                let result;
                try {
                    result = await response.json();
                } catch (_) {
                    // Server returned non-JSON (e.g. 404 page when form backend isn't running)
                    if (!response.ok) {
                        showFormError('The form could not be sent. The contact form only works when the site is deployed on Netlify or when you run "netlify dev" locally. Please contact us by phone or WhatsApp instead.');
                        return;
                    }
                    throw new Error('Invalid response');
                }

                if (response.ok && result.success) {
                    showFormSuccess(result.message || 'Thank you! We\'ve received your message and will contact you soon.');
                    this.reset();
                } else {
                    showFormError(result.error || 'Failed to send message. Please try again or contact us by phone or WhatsApp.');
                }
            } catch (error) {
                if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
                    showFormError('The form could not be sent. The contact form only works when the site is deployed on Netlify or when you run "netlify dev" locally. Please contact us by phone or WhatsApp instead.');
                } else {
                    showFormError('Something went wrong. Please try again or contact us directly via phone or WhatsApp.');
                }
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

        // Animate cards and sections (skip on privacy policy so long content is visible immediately)
        if (document.body.classList.contains('page-privacy-policy')) return;

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
    // ============================================
    // WhatsApp ID Modal (required ID before opening WhatsApp)
    // ============================================
    function initWhatsAppModal() {
        const phone = (CONFIG.phone || '').replace(/\s/g, '');
        const defaultEncoded = (typeof CONFIG.whatsappMessage !== 'undefined' ? CONFIG.whatsappMessage : 'Hello,%20I%20would%20like%20to%20learn%20more%20about%20debt%20review%20removal%20services.');
        const baseUrl = 'https://wa.me/' + phone + '?text=';

        var pendingHref = '';
        var backdrop = null;
        var inputEl = null;
        var errorEl = null;

        function showIdError(msg) {
            if (!errorEl) return;
            errorEl.textContent = msg || '';
            errorEl.style.display = msg ? 'block' : 'none';
            if (inputEl) inputEl.setAttribute('aria-invalid', msg ? 'true' : 'false');
        }

        function createModal() {
            if (backdrop) return;
            var div = document.createElement('div');
            div.className = 'whatsapp-id-modal-backdrop';
            div.setAttribute('role', 'dialog');
            div.setAttribute('aria-modal', 'true');
            div.setAttribute('aria-labelledby', 'whatsapp-modal-title');
            div.setAttribute('aria-describedby', 'whatsapp-modal-desc');
            div.innerHTML =
                '<div class="whatsapp-id-modal">' +
                '<h3 id="whatsapp-modal-title">Contact us on WhatsApp</h3>' +
                '<p id="whatsapp-modal-desc">To help us assist you quickly, please enter your ID number. This helps us pull up your details when you message us.</p>' +
                '<label for="whatsapp-id-input">ID number <span class="required">*</span></label>' +
                '<input type="text" id="whatsapp-id-input" name="whatsapp-id" placeholder="e.g. 8001015001087" autocomplete="off" inputmode="numeric" pattern="[0-9\\s]*" maxlength="13" required aria-required="true" aria-describedby="whatsapp-id-error">' +
                '<div id="whatsapp-id-error" class="whatsapp-id-error" role="alert" aria-live="polite"></div>' +
                '<div class="whatsapp-id-modal-actions">' +
                '<button type="button" class="btn btn-primary" id="whatsapp-modal-continue">Continue to WhatsApp</button>' +
                '<button type="button" class="btn btn-secondary" id="whatsapp-modal-skip">I don\'t have my ID</button>' +
                '</div>' +
                '</div>';
            document.body.appendChild(div);
            backdrop = div;
            inputEl = div.querySelector('#whatsapp-id-input');
            errorEl = div.querySelector('#whatsapp-id-error');

            div.addEventListener('click', function(e) {
                if (e.target === div) closeModal();
            });
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && backdrop && backdrop.classList.contains('is-open')) closeModal();
            });
            if (inputEl) {
                inputEl.addEventListener('input', function() {
                    this.value = this.value.replace(/\D/g, '');
                    showIdError('');
                });
                inputEl.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        div.querySelector('#whatsapp-modal-continue').click();
                    }
                });
            }
            div.querySelector('#whatsapp-modal-continue').addEventListener('click', function() {
                var raw = (inputEl && inputEl.value) ? inputEl.value.trim() : '';
                var id = raw.replace(/\s/g, '');
                if (!id) {
                    showIdError('Please enter your ID number to continue.');
                    if (inputEl) inputEl.focus();
                    return;
                }
                if (id.length < 10) {
                    showIdError('Please enter a valid ID number (at least 10 digits).');
                    if (inputEl) inputEl.focus();
                    return;
                }
                showIdError('');
                var message = decodeURIComponent(defaultEncoded.replace(/\+/g, ' '));
                message += '\nMy ID number: ' + id;
                window.open(baseUrl + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
                closeModal();
            });
            div.querySelector('#whatsapp-modal-skip').addEventListener('click', function() {
                if (pendingHref) window.open(pendingHref, '_blank', 'noopener,noreferrer');
                closeModal();
            });
        }

        function openModal(linkHref) {
            pendingHref = linkHref || '';
            createModal();
            showIdError('');
            if (inputEl) {
                inputEl.value = '';
                inputEl.removeAttribute('aria-invalid');
                inputEl.focus();
            }
            backdrop.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            if (!backdrop) return;
            backdrop.classList.remove('is-open');
            document.body.style.overflow = '';
        }

        document.addEventListener('click', function(e) {
            var a = e.target && (e.target.closest ? e.target.closest('a[href*="wa.me"]') : null);
            if (!a || !a.href) return;
            e.preventDefault();
            e.stopPropagation();
            openModal(a.href);
        }, true);
    }

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
            initWhatsAppModal();
            initLazyLoading();
            initScrollAnimations();
            initParallax();
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }
    
    // Start initialization
    init();
    
    // Also try to initialize on window load as backup
    window.addEventListener('load', function() {
        const toggle = document.getElementById('mobileMenuToggle');
        const menu = document.getElementById('navMenu');
        if (toggle && menu) initMobileMenu();
    });

})();
