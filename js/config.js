// PureDebt Solutions - Configuration Constants
// Centralized configuration for easy maintenance

const CONFIG = {
    // Contact Information
    phone: '+27 73 384 0515',
    email: 'mogamaduzair@gmail.com',
    whatsappMessage: 'Hello,%20I%20would%20like%20to%20learn%20more%20about%20debt%20removal%20services.',
    
    // Business Hours
    businessHours: {
        weekdays: 'Mon-Fri: 8:00 AM - 5:00 PM',
        saturday: 'Sat: 9:00 AM - 1:00 PM'
    },
    
    // URLs
    whatsappUrl: function() {
        return `https://wa.me/${this.phone.replace(/\s/g, '')}?text=${this.whatsappMessage}`;
    },
    
    phoneUrl: function() {
        return `tel:${this.phone.replace(/\s/g, '')}`;
    },
    
    emailUrl: function() {
        return `mailto:${this.email}`;
    },
    
    // API
    apiUrl: '/api/contact',
    
    // Company Info
    companyName: 'PureDebt Solutions',
    tagline: 'Professional debt removal assistance you can trust. Transparent, lawful, and assessment-based solutions.'
};

// Make config available globally
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
