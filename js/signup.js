// ─────────────────────────────────────────────────────────────────────────────
// Stone Rose Watercolor Workshop — Sign-Up Form
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'stonerose_signups';

// Initialize EmailJS with your public key from config.js
emailjs.init(EMAILJS_PUBLIC_KEY);

const form        = document.getElementById('signupForm');
const successMsg  = document.getElementById('successMessage');
const confirmedEl = document.getElementById('confirmedName');
const submitBtn   = form.querySelector('.btn-submit');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Collect values
  const name      = document.getElementById('name').value.trim();
  const email     = document.getElementById('email').value.trim();
  const phone     = document.getElementById('phone').value.trim();
  const glutenFree = document.getElementById('glutenFree').checked;
  const dairyFree  = document.getElementById('dairyFree').checked;
  const espresso   = document.getElementById('espresso').checked;
  const extraKit   = document.getElementById('extraKit').checked;

  if (!name || !email) return; // native HTML validation handles messaging

  // Loading state
  submitBtn.disabled = true;
  submitBtn.querySelector('span').textContent = 'Sending…';

  // Build human-readable strings for the email
  const dietaryParts = [];
  if (glutenFree) dietaryParts.push('Gluten Free');
  if (dairyFree)  dietaryParts.push('Dairy Free');
  const dietaryStr = dietaryParts.length ? dietaryParts.join(', ') : 'None';

  const addonParts = [];
  if (espresso) addonParts.push('Espresso Drinks');
  if (extraKit) addonParts.push('Extra Take-Home Painting Kit');
  const addonsStr = addonParts.length ? addonParts.join(', ') : 'None';

  // Persist to localStorage
  const signup = {
    id:        Date.now(),
    timestamp: new Date().toISOString(),
    name,
    email,
    phone,
    dietary: { glutenFree, dairyFree },
    addons:  { espresso,   extraKit  },
  };

  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  existing.push(signup);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

  // Send confirmation email
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_name:       name,
      to_email:      email,
      phone:         phone || 'Not provided',
      dietary_prefs: dietaryStr,
      addons:        addonsStr,
      event_name:    EVENT.name,
      event_date:    `${EVENT.date} at ${EVENT.time}`,
      location:      EVENT.location,
    });
  } catch (err) {
    // Registration is saved — email failure won't block the user
    console.warn('EmailJS error (registration still saved):', err);
  }

  // Show success state
  form.classList.add('hidden');
  confirmedEl.textContent = name.split(' ')[0];
  successMsg.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
