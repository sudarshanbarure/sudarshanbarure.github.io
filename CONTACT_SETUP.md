# Contact Form Setup Guide
**Sudarshan Barure Portfolio — sudarshanbarure.github.io**

Follow these steps once to wire the contact form to Google Sheets and email notifications.

---

## Step 1 — Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it: **"Portfolio Contacts"** (or anything you like).
3. Leave it open — the Apps Script will create the header row automatically on first submission.

---

## Step 2 — Deploy the Google Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**.
2. Delete any default code in the editor.
3. Open the file `google_apps_script.gs` (provided alongside this guide).
4. **Paste the entire script** into the editor.
5. Confirm `OWNER_EMAIL` at the top is `sudarshanbarure@gmail.com` (or update to your preferred address).
6. Click **Save** (floppy disk icon), then click **Deploy → New deployment**.
7. In the dialog:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
8. Click **Deploy** → Authorise the app when prompted (allow all permissions).
9. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
10. Paste that URL into `script.js` replacing `"YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"`.

> ⚠️ **Re-deploy after every script change** — use "Manage deployments" and create a new version.

---

## Step 3 — Set up EmailJS (for the user notification email to you)

EmailJS lets the form send an email directly from the browser — no server needed.

1. Create a free account at [emailjs.com](https://www.emailjs.com).
2. **Add an Email Service:**
   - Go to **Email Services → Add New Service**.
   - Choose **Gmail**, connect your `sudarshanbarure@gmail.com` account.
   - Note the **Service ID** (e.g., `service_abc123`).
3. **Create an Email Template:**
   - Go to **Email Templates → Create New Template**.
   - Use this template body:
     ```
     New portfolio enquiry:

     Name:    {{from_name}}
     Email:   {{from_email}}
     Phone:   {{from_phone}}
     Date:    {{submitted_at}}

     Message:
     {{message}}
     ```
   - Set **To email** to `sudarshanbarure@gmail.com`
   - Set **From name** to `{{from_name}}`
   - Set **Reply To** to `{{reply_to}}`
   - Note the **Template ID** (e.g., `template_xyz456`).
4. Go to **Account → General** and copy your **Public Key**.

---

## Step 4 — Update script.js

Open `script.js` and replace the placeholder values in the `CONFIG` block at the top:

```js
const CONFIG = {
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_ID/exec",  // from Step 2
  EMAILJS_SERVICE_ID:  "service_abc123",  // from Step 3
  EMAILJS_TEMPLATE_ID: "template_xyz456", // from Step 3
  EMAILJS_PUBLIC_KEY:  "your_public_key", // from Step 3
};
```

---

## Step 5 — Push to GitHub

```bash
git add .
git commit -m "feat: add contact form with Google Sheets + EmailJS integration"
git push origin main
```

GitHub Pages will auto-deploy within ~2 minutes.

---

## What happens when someone submits the form?

1. Their details are **appended as a new row** in the Google Sheet.
2. **You receive an email** at `sudarshanbarure@gmail.com` with all their details and a reply-to set to their email — so you can reply in one click.
3. They see a **success confirmation** on the page.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Form not configured" error | You haven't replaced the placeholder values in `script.js` |
| No email received | Check EmailJS dashboard → "Email History" for errors |
| Sheets not updating | Re-deploy the Apps Script (create a new deployment version) |
| CORS error in console | Expected for Apps Script with `no-cors` mode — ignore it, submissions still work |
