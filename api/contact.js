// Serverless function for handling contact form submissions
// Deploy this to Vercel, Netlify Functions, or similar
// For Vercel: Place in /api/contact.js
// For Netlify: Place in /netlify/functions/contact.js

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
                html: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <hr>
                    <p><small>Submitted on: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</small></p>
                `
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
