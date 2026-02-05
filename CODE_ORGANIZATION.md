# Code Organization & Maintenance Guide

## Overview
This document outlines the code structure, organization principles, and maintenance guidelines for the PureDebt Solutions website.

## Project Structure

```
PureDebt Solutions/
├── index.html              # Homepage
├── about.html              # About page
├── debt-removal.html       # Service page
├── how-it-works.html       # Process page
├── faqs.html              # FAQ page
├── contact.html            # Contact page
├── privacy-policy.html     # Privacy policy
├── css/
│   └── styles.css         # Main stylesheet (organized by sections)
├── js/
│   ├── config.js          # Configuration constants
│   ├── main.js            # Main JavaScript (modular functions)
│   ├── header-footer.js   # Shared components (optional)
│   └── seo-meta.js        # SEO helper (optional)
├── images/                 # All images
├── api/
│   └── contact.js         # Serverless function for contact form
└── README.md              # Project documentation
```

## Code Organization Principles

### 1. CSS Organization
- **Variables First**: All CSS variables defined at the top
- **Logical Sections**: Code organized by component/feature
- **Mobile-First**: Base styles for mobile, then desktop enhancements
- **Utility Classes**: Common patterns extracted to reusable classes
- **No Inline Styles**: All styles in CSS file for maintainability

### 2. JavaScript Organization
- **Modular Functions**: Each feature in its own function
- **Configuration Centralized**: All constants in `config.js`
- **Error Handling**: Try-catch blocks and graceful degradation
- **Accessibility**: ARIA attributes and keyboard navigation
- **Performance**: Debouncing, lazy loading, passive event listeners

### 3. HTML Structure
- **Semantic HTML**: Proper use of semantic elements
- **Accessibility**: ARIA labels, alt text, proper headings
- **SEO**: Meta tags, Open Graph, structured data
- **Consistency**: Same structure across all pages

## Key Improvements Made

### Configuration Management
- Created `js/config.js` for centralized constants
- Phone numbers, emails, URLs defined once
- Easy to update contact information

### CSS Improvements
- Extracted inline styles to CSS classes
- Added utility classes for common patterns
- Better organization with section comments
- FAQ styles moved from inline to CSS

### JavaScript Improvements
- Modular function structure
- Better error handling
- Accessibility improvements (ARIA, keyboard navigation)
- Performance optimizations (debouncing, lazy loading)
- Respects `prefers-reduced-motion`

### SEO Enhancements
- Open Graph meta tags
- Twitter Card meta tags
- Canonical URLs
- Proper meta descriptions

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly

## Maintenance Guidelines

### Adding New Pages
1. Copy structure from existing page
2. Update meta tags (title, description, Open Graph)
3. Update navigation active state
4. Follow existing HTML structure

### Updating Contact Information
1. Update `js/config.js` - single source of truth
2. All pages will automatically use new values

### Adding New Styles
1. Add to appropriate section in `css/styles.css`
2. Use existing utility classes when possible
3. Follow mobile-first approach
4. Add comments for complex styles

### Adding New JavaScript Features
1. Create new function in `js/main.js`
2. Add to `init()` function
3. Include error handling
4. Consider accessibility

## Best Practices

### Performance
- Lazy load images
- Use CSS for animations when possible
- Debounce scroll/resize events
- Minimize JavaScript execution

### Accessibility
- Always include alt text for images
- Use semantic HTML
- Ensure keyboard navigation works
- Test with screen readers

### SEO
- Unique titles and descriptions per page
- Proper heading hierarchy (H1 → H2 → H3)
- Open Graph tags for social sharing
- Canonical URLs

### Code Quality
- Consistent indentation (spaces, not tabs)
- Meaningful variable/class names
- Comments for complex logic
- No inline styles in HTML

## Common Tasks

### Update Phone Number
Edit `js/config.js`:
```javascript
phone: '+27 73 384 0515'
```

### Update Email
Edit `js/config.js`:
```javascript
email: 'newemail@example.com'
```

### Add New Utility Class
Add to utility section in `css/styles.css`:
```css
.my-utility {
    /* styles */
}
```

### Add New Page
1. Create new HTML file
2. Copy structure from existing page
3. Update navigation in all pages
4. Add to footer links if needed

## File Naming Conventions
- HTML: kebab-case (e.g., `how-it-works.html`)
- CSS: kebab-case (e.g., `styles.css`)
- JavaScript: camelCase (e.g., `main.js`)
- Images: descriptive names (e.g., `PDbgrlogo.png`)

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

## Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

## Future Improvements
- [ ] Add structured data (JSON-LD)
- [ ] Implement service worker for offline support
- [ ] Add analytics integration
- [ ] Create component library documentation
- [ ] Add automated testing
