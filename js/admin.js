// ─────────────────────────────────────────────────────────────────────────────
// Stone Rose Watercolor Workshop — Admin Dashboard
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'stonerose_signups';

const passwordModal  = document.getElementById('passwordModal');
const passwordForm   = document.getElementById('passwordForm');
const passwordInput  = document.getElementById('passwordInput');
const passwordError  = document.getElementById('passwordError');
const dashboard      = document.getElementById('dashboard');

// ── Password Gate ─────────────────────────────────────────────────────────

passwordForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (passwordInput.value === ADMIN_PASSWORD) {
    passwordModal.classList.add('hidden');
    dashboard.classList.remove('hidden');
    loadDashboard();
  } else {
    passwordError.classList.remove('hidden');
    passwordInput.value = '';
    passwordInput.focus();
  }
});

// ── Dashboard ─────────────────────────────────────────────────────────────

function loadDashboard() {
  const signups = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  // Stats
  document.getElementById('totalCount').textContent      = signups.length;
  document.getElementById('glutenFreeCount').textContent = signups.filter(s => s.dietary?.glutenFree).length;
  document.getElementById('dairyFreeCount').textContent  = signups.filter(s => s.dietary?.dairyFree).length;
  document.getElementById('espressoCount').textContent   = signups.filter(s => s.addons?.espresso).length;
  document.getElementById('extraKitCount').textContent   = signups.filter(s => s.addons?.extraKit).length;

  const tbody     = document.getElementById('signupTableBody');
  const emptyState = document.getElementById('emptyState');
  const tableWrap  = document.getElementById('tableWrap');

  if (signups.length === 0) {
    emptyState.classList.remove('hidden');
    tableWrap.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  tableWrap.classList.remove('hidden');

  tbody.innerHTML = '';

  // Sort newest first
  [...signups].reverse().forEach((s) => {
    const dietaryBadges = [
      s.dietary?.glutenFree ? badge('Gluten Free', 'rose') : '',
      s.dietary?.dairyFree  ? badge('Dairy Free',  'sage') : '',
    ].join('');

    const addonBadges = [
      s.addons?.espresso ? badge('Espresso', 'gold') : '',
      s.addons?.extraKit ? badge('Extra Kit', 'sage') : '',
    ].join('');

    const date = new Date(s.timestamp).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${esc(s.name)}</strong></td>
      <td>${esc(s.email)}</td>
      <td>${esc(s.phone || '—')}</td>
      <td>${dietaryBadges || '<span class="badge--none">None</span>'}</td>
      <td>${addonBadges   || '<span class="badge--none">None</span>'}</td>
      <td style="white-space:nowrap;color:var(--text-light);font-size:0.85rem">${date}</td>
    `;
    tbody.appendChild(tr);
  });
}

function badge(text, color) {
  return `<span class="badge badge--${color}">${esc(text)}</span>`;
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Export CSV ────────────────────────────────────────────────────────────

document.getElementById('exportBtn').addEventListener('click', () => {
  const signups = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (signups.length === 0) { alert('No signups to export yet.'); return; }

  const headers = ['Name', 'Email', 'Phone', 'Gluten Free', 'Dairy Free', 'Espresso', 'Extra Kit', 'Signed Up'];
  const rows = signups.map((s) => [
    s.name,
    s.email,
    s.phone || '',
    s.dietary?.glutenFree ? 'Yes' : 'No',
    s.dietary?.dairyFree  ? 'Yes' : 'No',
    s.addons?.espresso    ? 'Yes' : 'No',
    s.addons?.extraKit    ? 'Yes' : 'No',
    new Date(s.timestamp).toLocaleString(),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'stone-rose-signups.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// ── Clear Data (with confirmation) ────────────────────────────────────────

document.getElementById('clearBtn').addEventListener('click', () => {
  const signups = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (signups.length === 0) { alert('No signups to clear.'); return; }
  if (confirm(`Are you sure you want to delete all ${signups.length} signup(s)? This cannot be undone.`)) {
    localStorage.removeItem(STORAGE_KEY);
    loadDashboard();
  }
});
