// SEO Meta Tags Helper
// Provides Open Graph and Twitter Card meta tags

function generateSEOMeta(pageData) {
    const baseUrl = 'https://puredebtsolutions.africa'; // Update with actual domain
    const defaultImage = `${baseUrl}/images/PDlogo.jpeg`;
    
    const meta = {
        title: pageData.title || 'PureDebt Solutions - Professional Debt Removal Services',
        description: pageData.description || 'Professional debt removal services in South Africa. Transparent, lawful, and assessment-based solutions.',
        image: pageData.image || defaultImage,
        url: `${baseUrl}${pageData.path || ''}`,
        type: pageData.type || 'website'
    };
    
    return `
        <!-- Primary Meta Tags -->
        <title>${meta.title}</title>
        <meta name="title" content="${meta.title}">
        <meta name="description" content="${meta.description}">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="${meta.type}">
        <meta property="og:url" content="${meta.url}">
        <meta property="og:title" content="${meta.title}">
        <meta property="og:description" content="${meta.description}">
        <meta property="og:image" content="${meta.image}">
        <meta property="og:site_name" content="PureDebt Solutions">
        <meta property="og:locale" content="en_ZA">
        
        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="${meta.url}">
        <meta property="twitter:title" content="${meta.title}">
        <meta property="twitter:description" content="${meta.description}">
        <meta property="twitter:image" content="${meta.image}">
        
        <!-- Additional SEO -->
        <meta name="robots" content="index, follow">
        <meta name="author" content="PureDebt Solutions">
        <link rel="canonical" href="${meta.url}">
    `;
}

// Make available globally
if (typeof window !== 'undefined') {
    window.generateSEOMeta = generateSEOMeta;
}
