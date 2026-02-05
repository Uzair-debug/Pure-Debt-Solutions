# PureDebt Solutions - Static Website

A premium, conversion-focused static website built with HTML, CSS, and JavaScript. Optimized for speed, performance, and maintainability.

## Recent Improvements

✅ **Code Organization**
- Centralized configuration in `js/config.js`
- Modular JavaScript functions
- Organized CSS with clear sections
- Utility classes for common patterns

✅ **Maintainability**
- Removed inline styles (moved to CSS)
- Consistent code structure
- Better error handling
- Comprehensive documentation

✅ **SEO & Accessibility**
- Open Graph meta tags
- Twitter Card support
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly

✅ **Performance**
- Debounced scroll events
- Lazy loading support
- Respects `prefers-reduced-motion`
- Optimized animations

## Features

- **7 Pages**: Home, About, Debt Removal, How It Works, FAQs, Contact, Privacy Policy
- **Mobile-First Design**: Fully responsive with mobile-optimized navigation
- **Speed Optimized**: Minimal JavaScript, optimized CSS, lazy loading ready
- **Premium Design**: Clean, modern UI with professional typography
- **Contact Form**: Ready for Resend email integration
- **WhatsApp Integration**: Click-to-chat WhatsApp buttons
- **Click-to-Call**: Phone number links for easy calling
- **SEO Optimized**: Proper meta tags, semantic HTML

## Project Structure

```
├── index.html              # Home page
├── about.html              # About page
├── debt-removal.html       # Debt Removal service page
├── how-it-works.html       # How It Works page
├── faqs.html              # FAQs page
├── contact.html            # Contact page with form
├── privacy-policy.html     # Privacy Policy (POPIA compliant)
├── css/
│   └── styles.css          # Main stylesheet (optimized)
├── js/
│   ├── config.js           # Configuration constants
│   ├── main.js             # Main JavaScript (modular, organized)
│   ├── header-footer.js    # Shared components (optional)
│   └── seo-meta.js         # SEO helper (optional)
├── api/
│   └── contact.js          # Serverless function for contact form
└── README.md
```

## Getting Started

### Local Development

1. **Open the website:**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (with http-server)
     npx http-server
     
     # PHP
     php -S localhost:8000
     ```

2. **Access the site:**
   - Open `http://localhost:8000` in your browser

### Deployment

This static site can be deployed to:
- **Netlify** (recommended for static sites)
- **Vercel**
- **GitHub Pages**
- **Cloudflare Pages**
- Any static hosting service

## Configuration

### Update Contact Information

**Easy Update:** Edit `js/config.js` - all pages will use the new values automatically.

```javascript
const CONFIG = {
    phone: '+27 73 384 0515',
    email: 'mogamaduzair@gmail.com',
    // ... other settings
};
```

This is the single source of truth for contact information.

### Contact Form Setup

The contact form requires a serverless function to send emails. Options:

#### Option 1: Use the Provided Serverless Function

1. **Deploy to Vercel:**
   - Create `api/contact.js` (already provided)
   - Set environment variables in Vercel:
     - `RESEND_API_KEY=re_your_key_here`
     - `RESEND_FROM_EMAIL=PureDebt Solutions <noreply@yourdomain.com>`
     - `RESEND_TO_EMAIL=mogamaduzair@gmail.com`

2. **Deploy to Netlify:**
   - Create `netlify/functions/contact.js` (copy from `api/contact.js`)
   - Set environment variables in Netlify dashboard

#### Option 2: Use Formspree (Easiest)

1. Sign up at [Formspree.io](https://formspree.io)
2. Create a new form
3. Update `js/main.js` line with your Formspree endpoint:
   ```javascript
   const apiUrl = 'https://formspree.io/f/YOUR_FORM_ID';
   ```

#### Option 3: Use Resend Directly (Client-Side - Not Recommended for Production)

⚠️ **Warning:** Exposing API keys client-side is insecure. Only use for testing.

Update `js/main.js` to use Resend API directly (see commented code).

## Speed Optimizations

This site is optimized for speed:

- ✅ Minimal JavaScript (only essential interactivity)
- ✅ CSS variables for performance
- ✅ Optimized font loading (preconnect)
- ✅ No external dependencies (except Google Fonts)
- ✅ Semantic HTML for better parsing
- ✅ Mobile-first responsive design
- ✅ Lazy loading ready (for images if added)
- ✅ Reduced motion support for accessibility

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Colors

Edit CSS variables in `css/styles.css`:

```css
:root {
    --primary-600: #0284c7;  /* Main brand color */
    --primary-700: #0369a1;  /* Hover states */
    --accent-500: #22c55e;   /* Accent color */
    --whatsapp: #25D366;     /* WhatsApp green */
}
```

### Fonts

The site uses Inter font from Google Fonts. To change:

1. Update the font link in HTML `<head>`
2. Update `--font-inter` in CSS

## SEO Features

- Unique meta titles and descriptions per page
- Proper heading hierarchy (H1, H2, H3)
- Semantic HTML structure
- Mobile-friendly responsive design
- Fast loading times

## License

All rights reserved - PureDebt Solutions

## Support

For questions or issues, contact: mogamaduzair@gmail.com
