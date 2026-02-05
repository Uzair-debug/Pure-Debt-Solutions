# Pre-Launch Checklist – PureDebt Solutions

Use this list before you deploy and go live. Items are ordered by priority.

**Production domain:** `https://puredebtsolutions.africa` (no www). All canonicals and OG/Twitter URLs use this.

---

## Set up Resend (do this before or without hosting)

You can configure Resend now and test the contact form locally. When you deploy to Netlify later, you’ll add the same values as environment variables.

### 1. Resend account and API key

1. Go to [resend.com](https://resend.com) and sign up (or log in).
2. In the dashboard: **API Keys** → **Create API Key** → name it (e.g. “PureDebt local”) → copy the key (starts with `re_`). You won’t see it again, so store it somewhere safe.
3. **From address (for testing):** Resend lets you send from `onboarding@resend.dev` without verifying a domain. That’s enough to test.  
   **Later (for production):** In Resend, add your domain (e.g. `puredebtsolutions.africa`) and verify it, then use e.g. `PureDebt Solutions <noreply@puredebtsolutions.africa>` as the from address.

### 2. Local env file (for testing before going live)

1. In the project root, copy the example env file:
   - **Windows (PowerShell):** `Copy-Item .env.example .env`
   - **Mac/Linux:** `cp .env.example .env`
2. Open `.env` and set:
   - `RESEND_API_KEY` = the API key you copied (e.g. `re_xxxxxxxxxx`)
   - `RESEND_FROM_EMAIL` = for testing use `PureDebt Solutions <onboarding@resend.dev>`
   - `RESEND_TO_EMAIL` = your real email (e.g. `mogamaduzair@gmail.com`) so you receive form submissions
3. Save. Do **not** commit `.env` (it’s in `.gitignore`).

### 3. Test the contact form

**Option A – Netlify Dev (local)**  
The form needs the function, so use Netlify’s local server. The first run can be slow (30–60 seconds); later runs are faster.

1. Install Netlify CLI once: `npm install -g netlify-cli`
2. In the project folder: `netlify dev`
3. When you see “Server now ready”, open the URL (e.g. `http://localhost:8888`), go to Contact, submit the form.

**Option B – Deploy to Netlify and test there (fast)**  
1. Push your repo to GitHub and connect it to Netlify. Deploy.
2. In Netlify: Site settings → Environment variables → add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`.
3. Trigger a new deploy. Open your `*.netlify.app` URL, go to Contact, submit the form. The site loads quickly and the form uses the live function.

**Quick local browsing (no form):**  
For fast loading when you’re only editing layout/style, run a simple static server:  
`npx serve .`  
Then open the URL it prints. The contact form will not work (no `/api/contact`); use Option A or B to test the form.

---

## Must-do before go-live

### 1. Contact form

The form posts to `/api/contact`. That only works if you deploy with serverless support.

- **Option A – Vercel / Netlify (serverless)**  
  - Deploy the site and keep `api/contact.js` (Vercel) or move it to `netlify/functions/contact.js` (Netlify).  
  - Set these environment variables in the host dashboard:
    - `RESEND_API_KEY` – from [Resend](https://resend.com)
    - `RESEND_FROM_EMAIL` – e.g. `PureDebt Solutions <noreply@yourdomain.com>`
    - `RESEND_TO_EMAIL` – e.g. `mogamaduzair@gmail.com`
  - Ensure the form’s fetch URL matches your host (e.g. `/api/contact` for Vercel).

- **Option B – Static host only (no serverless)**  
  - In `js/config.js`, set `apiUrl` to a third-party form endpoint, e.g. Formspree:  
    `apiUrl: 'https://formspree.io/f/YOUR_FORM_ID'`  
  - Create the form at [Formspree](https://formspree.io), get the form ID, and replace `YOUR_FORM_ID`.

- **Test:** Submit the contact form and confirm you receive the email and the user sees success/error messages.

---

### 2. Favicon

Add a favicon so the tab/bookmark shows your brand.

- Add to the `<head>` of every HTML page (or at least `index.html`):
  ```html
  <link rel="icon" type="image/png" href="images/favicon.png" sizes="32x32">
  ```
- Add a 32×32 (or 48×48) PNG, e.g. `images/favicon.png`, or use your existing logo and reference it.

---

### 3. SEO: canonical and Open Graph on all pages

Only `index.html` and `find-us.html` currently have full OG + canonical. Add the same pattern to:

- `about.html`
- `contact.html`
- `debt-removal.html`
- `how-it-works.html`
- `faqs.html`
- `privacy-policy.html`

For each page add (with the correct URL and title/description):

```html
<link rel="canonical" href="https://puredebtsolutions.africa/PAGE.html">
<meta property="og:url" content="https://puredebtsolutions.africa/PAGE.html">
<meta property="og:title" content="Page Title | PureDebt Solutions">
<meta property="og:description" content="...">
<meta property="og:image" content="https://puredebtsolutions.africa/images/PDlogo.jpeg">
<meta property="og:type" content="website">
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://puredebtsolutions.africa/PAGE.html">
<meta property="twitter:title" content="...">
<meta property="twitter:description" content="...">
<meta property="twitter:image" content="https://puredebtsolutions.africa/images/PDlogo.jpeg">
```

Replace `PAGE.html` and the titles/descriptions per page. Use the same base URL you’ll use in production (e.g. `https://puredebtsolutions.africa`).

---

### 4. Domain and URLs (Netlify custom domain)

- **Live URL:** `https://puredebtsolutions.africa` (no www). All canonicals and OG/Twitter URLs in the site already use this.
- **In Netlify:** Site settings → Domain management → Add custom domain → add `puredebtsolutions.africa`. Netlify will give you DNS records (e.g. A/CNAME); add them at your domain registrar. Enable HTTPS (Netlify provisions a free certificate).
- **Optional:** Add `www.puredebtsolutions.africa` as an alias and set “Redirect to main domain” so all traffic goes to `https://puredebtsolutions.africa`.
- Ensure every `canonical`, `og:url`, and `twitter:url` stays as `https://puredebtsolutions.africa/...` (no mix of www or http).

---

### 5. Privacy policy

- In `privacy-policy.html`, update “Last Updated” to the real date (e.g. 2025).
- Review the policy for accuracy (company name, contact, data practices) and adjust if needed.

---

### 6. No secrets in the repo

- `js/config.js` contains phone and email only (public contact info). That’s fine to commit.
- Never commit:
  - `.env` or any file with `RESEND_API_KEY` or other API keys.
- Confirm `.gitignore` includes `.env`, `.env.local`, `.env*.local` (already there).

---

## Recommended

### 7. Test on real devices

- Open the site on a phone and tablet.
- Test: nav (including mobile menu), all buttons (Call Now, WhatsApp, Get Free Assessment, Contact Us), contact form, and “Find Us” map.
- Check that no buttons “disappear” on hover (already fixed in CSS; good to re-check).

---

### 8. Links and contact details

- Check every `tel:` and `mailto:` and WhatsApp link.
- Ensure phone number is correct in `js/config.js` and in any hardcoded HTML (e.g. contact page, footer).
- Click every internal link (Home, About, Debt Removal, How It Works, FAQs, Contact, Find Us, Privacy Policy) and every external link (e.g. Information Regulator, Google Maps).

---

### 9. Optional code cleanup (inline styles)

There are still many `style="..."` attributes, especially in:

- `privacy-policy.html`
- `find-us.html`
- `contact.html`
- `index.html` (a few)

For maintainability you can move repeated patterns into `css/styles.css` (e.g. `.prose ul.privacy-list`, `.map-card`, `.contact-sidebar`) and replace inline styles with classes. Not required for launch, but makes future edits easier.

---

## After deploy

- Submit the sitemap to Google Search Console (if you add one) and request indexing for the main URL.
- Test the contact form again on the live URL.
- Optionally set up basic analytics (e.g. Google Analytics or Plausible) and add the script only if you’re happy with your privacy policy describing it.

---

## Summary

| Priority | Task |
|----------|------|
| Must     | Contact form working (serverless env vars or Formspree + `apiUrl`) |
| Must     | Favicon added and linked in `<head>` |
| Must     | Canonical + OG + Twitter meta on all pages |
| Must     | Correct domain and consistent URLs everywhere |
| Must     | Privacy policy date and content correct |
| Must     | No API keys or secrets in the repo |
| Recommended | Test on mobile; test all links and buttons |
| Optional | Move inline styles to CSS |

Once these are done, you’re in good shape to deploy and go live.
