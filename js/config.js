// ─────────────────────────────────────────────────────────────────────────────
// EmailJS Configuration
// Sign up at https://www.emailjs.com — it's free for up to 200 emails/month.
//
// Steps:
//  1. Create an account → go to Account > API Keys → copy your Public Key
//  2. Add an Email Service (Gmail, Outlook, etc.) → copy the Service ID
//  3. Create an Email Template with these variables:
//       {{to_name}}     — attendee's name
//       {{to_email}}    — attendee's email  (set as the "To Email" field)
//       {{phone}}       — phone number
//       {{dietary_prefs}} — dietary preferences
//       {{addons}}      — selected add-ons
//       {{event_name}}  — event name
//       {{event_date}}  — date & time string
//       {{location}}    — venue address
//  4. Copy the Template ID
//  5. Replace the placeholder strings below
// ─────────────────────────────────────────────────────────────────────────────

const EMAILJS_PUBLIC_KEY  = 'lrArbVSEJV8-f1JkE';  // Account → API Keys
const EMAILJS_SERVICE_ID  = 'service_sk12z45';   // Email Services
const EMAILJS_TEMPLATE_ID = 'template_xsjkyqs';  // Email Templates

// ─────────────────────────────────────────────────────────────────────────────
// Admin password — change this before sharing the admin URL!
// ─────────────────────────────────────────────────────────────────────────────

const ADMIN_PASSWORD = 'stonerose2025';

// ─────────────────────────────────────────────────────────────────────────────
// Event details
// ─────────────────────────────────────────────────────────────────────────────

const EVENT = {
  name:     'Stone Rose Watercolor Workshop',
  date:     'Friday, April 4, 2025',
  time:     '2:00 PM',
  location: '8803 Saxon Ct',
};
