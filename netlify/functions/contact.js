// Netlify Function for handling contact form submissions
// Based on api/contact.js for serverless email via Resend

// Template embedded so it works on Netlify (no file read)
const EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>New Contact Form Submission</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f2f2f0;color:#111827;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f2f2f0;padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
<tr><td style="background:linear-gradient(135deg,#0E5B78 0%,#0d4f68 100%);padding:24px 32px;text-align:center;">
<h1 style="margin:0;font-size:20px;font-weight:700;color:#fff;">PureDebt Solutions</h1>
<p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.9);">Contact Form Submission</p>
</td></tr>
<tr><td style="padding:32px;">
<p style="margin:0 0 20px;font-size:15px;line-height:1.6;">You have received a new message from your website contact form.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e6e6e4;border-radius:8px;margin-bottom:24px;">
<tr><td style="padding:12px 16px;font-size:13px;color:#4b5563;border-bottom:1px solid #e6e6e4;width:120;"><strong>Name</strong></td><td style="padding:12px 16px;font-size:14px;color:#111827;">{{name}}</td></tr>
<tr><td style="padding:12px 16px;font-size:13px;color:#4b5563;border-bottom:1px solid #e6e6e4;"><strong>Email</strong></td><td style="padding:12px 16px;font-size:14px;"><a href="mailto:{{email}}" style="color:#0E5B78;text-decoration:none;">{{email}}</a></td></tr>
<tr><td style="padding:12px 16px;font-size:13px;color:#4b5563;border-bottom:1px solid #e6e6e4;"><strong>Phone</strong></td><td style="padding:12px 16px;font-size:14px;"><a href="tel:{{phone}}" style="color:#0E5B78;text-decoration:none;">{{phone}}</a></td></tr>
<tr><td style="padding:12px 16px;font-size:13px;color:#4b5563;vertical-align:top;"><strong>Message</strong></td><td style="padding:12px 16px;font-size:14px;line-height:1.6;color:#111827;">{{message}}</td></tr>
</table>
<p style="margin:0;font-size:12px;color:#6b7280;">Submitted on {{date}}</p>
</td></tr>
<tr><td style="padding:16px 32px;background-color:#f2f2f0;font-size:12px;color:#6b7280;text-align:center;">This email was sent from the contact form at puredebtsolutions.africa</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

function getEmailHtml(name, email, phone, message, date) {
    const escape = (s) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const escapedMessage = (message || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br>');
    return EMAIL_TEMPLATE
        .replace(/\{\{name\}\}/g, escape(name))
        .replace(/\{\{email\}\}/g, escape(email))
        .replace(/\{\{phone\}\}/g, escape(phone))
        .replace(/\{\{message\}\}/g, escapedMessage)
        .replace(/\{\{date\}\}/g, escape(date));
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

