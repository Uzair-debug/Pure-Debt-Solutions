# PureDebt Solutions

Static website for PureDebt Solutions. Deploy on Netlify; contact form uses Resend (serverless function).

## Deploy (Netlify)

1. Connect this repo to Netlify and deploy.
2. **Environment variables** (Site settings → Environment variables):
   - `RESEND_API_KEY` – Resend API key
   - `RESEND_FROM_EMAIL` – e.g. `PureDebt Solutions <onboarding@resend.dev>`
   - `RESEND_TO_EMAIL` – email to receive form submissions
3. Add custom domain `puredebtsolutions.africa` in Domain management if needed.

## Local

- **Browse:** open `index.html` or run `npx serve .`
- **Contact form (local):** run `netlify dev`, then open the URL and use the Contact page. Requires `.env` with the same three variables.

## Structure

- **HTML:** `index.html`, `about.html`, `contact.html`, `debt-removal.html`, `how-it-works.html`, `faqs.html`, `find-us.html`, `privacy-policy.html`
- **CSS:** `css/styles.css`
- **JS:** `js/config.js` (contact info, apiUrl), `js/main.js` (menu, form, scroll)
- **Contact form backend:** `netlify/functions/contact.js` (Resend; template embedded)

## Contact info

Edit `js/config.js` for phone, email, and WhatsApp. Do not commit `.env` or API keys.
