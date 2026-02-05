// Netlify Function for handling contact form submissions
// Based on api/contact.js for serverless email via Resend

const fs = require('fs');
const path = require('path');

function getEmailHtml(name, email, phone, message, date) {
    const escape = (s) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const escapedMessage = (message || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br>');
    try {
        const templatePath = path.join(__dirname, 'emails', 'contact.html');
        let html = fs.readFileSync(templatePath, 'utf8');
        return html
            .replace(/\{\{name\}\}/g, escape(name))
            .replace(/\{\{email\}\}/g, escape(email))
            .replace(/\{\{phone\}\}/g, escape(phone))
            .replace(/\{\{message\}\}/g, escapedMessage)
            .replace(/\{\{date\}\}/g, escape(date));
    } catch (e) {
        return `<h2>New Contact Form Submission</h2><p><strong>Name:</strong> ${escape(name)}</p><p><strong>Email:</strong> ${escape(email)}</p><p><strong>Phone:</strong> ${escape(phone)}</p><p><strong>Message:</strong></p><p>${escapedMessage}</p><hr><p><small>Submitted on: ${escape(date)}</small></p>`;
    }
}

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { name, email, phone, message } = JSON.parse(event.body);

        // Validate required fields
        if (!name || !email || !phone || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'All fields are required' })
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid email address' })
            };
        }

        // Send email using Resend
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Email service not configured' })
            };
        }

        const submittedDate = new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' });
        const html = getEmailHtml(name, email, phone, message, submittedDate);

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
                from: process.env.RESEND_FROM_EMAIL || 'PureDebt Solutions <onboarding@resend.dev>',
                to: [process.env.RESEND_TO_EMAIL || 'mogamaduzair@gmail.com'],
                reply_to: email,
                subject: `New Contact Form Submission from ${name}`,
                html
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                message: 'Thank you! We\'ve received your message and will contact you soon.'
            })
        };
    } catch (error) {
        console.error('Contact form error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

