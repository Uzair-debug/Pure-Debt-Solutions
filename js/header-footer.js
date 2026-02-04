// Shared header and footer loader (optional enhancement)
// This allows for easier maintenance of shared components

function loadHeader() {
    return `
        <header class="header" id="header">
            <nav class="nav container">
                <a href="index.html" class="logo">
                    <img src="images/PDbgrlogo.png" alt="PureDebt Solutions Logo" class="logo-image">
                    <span class="logo-text">PureDebt <span class="logo-accent">Solutions</span></span>
                </a>
                <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <ul class="nav-menu" id="navMenu">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="debt-removal.html">Debt Removal</a></li>
                    <li><a href="how-it-works.html">How It Works</a></li>
                    <li><a href="faqs.html">FAQs</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
                <a href="contact.html" class="btn btn-primary nav-cta">Get Free Assessment</a>
            </nav>
        </header>
    `;
}

function loadFooter() {
    const currentYear = new Date().getFullYear();
    return `
        <footer class="footer">
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-col">
                        <div class="footer-logo">
                            <img src="images/PDbgrlogo.png" alt="PureDebt Solutions Logo" class="logo-image">
                            <span class="logo-text">PureDebt <span class="logo-accent">Solutions</span></span>
                        </div>
                        <p>Professional debt removal assistance you can trust. Transparent, lawful, and assessment-based solutions.</p>
                    </div>
                    <div class="footer-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li><a href="about.html">About Us</a></li>
                            <li><a href="debt-removal.html">Debt Removal</a></li>
                            <li><a href="how-it-works.html">How It Works</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Resources</h4>
                        <ul>
                            <li><a href="faqs.html">FAQs</a></li>
                            <li><a href="contact.html">Contact Us</a></li>
                            <li><a href="privacy-policy.html">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Contact</h4>
                        <ul>
                            <li><a href="tel:+27733840515">+27 73 384 0515</a></li>
                            <li><a href="mailto:mogamaduzair@gmail.com">mogamaduzair@gmail.com</a></li>
                            <li class="footer-hours">
                                <strong>Business Hours:</strong><br>
                                Mon-Fri: 8:00 AM - 5:00 PM<br>
                                Sat: 9:00 AM - 1:00 PM
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p><strong>Disclaimer:</strong> Results vary. Assessment required. PureDebt Solutions provides lawful debt removal assistance based on individual circumstances. We do not guarantee specific outcomes. All services are subject to assessment and applicable laws and regulations.</p>
                    <p>&copy; ${currentYear} PureDebt Solutions. All rights reserved. | <a href="privacy-policy.html">Privacy Policy</a></p>
                </div>
            </div>
        </footer>
    `;
}
