/**
 * Site settings: small, repeat edits Dan makes himself from /dashboard (Site settings tab).
 * Values live in the D1 table site_settings (migrations/0007_site_settings.sql).
 * The Worker swaps them into every page as it is served, so the HTML Google and AI crawlers read already has them.
 * A missing setting (or a missing table) means the original wording and prices in the code are used.
 * Layout and structure stay in git; only the values listed in FIELDS can be changed here.
 */

// Alphabetical within each group. `def` is the original value, used whenever nothing is saved.
export const FIELDS = [
  { key: 'builder_price', group: 'Prices (ex GST)', label: 'Builder licence, fee from', help: 'Shown as "from $2,000" on the home, builder, prices and state pages.', type: 'price', def: '2000' },
  { key: 'company_price', group: 'Prices (ex GST)', label: 'Company licence, fee from', help: 'Also used for mutual recognition, which is the same price today.', type: 'price', def: '550' },
  { key: 'consultation_fee', group: 'Prices (ex GST)', label: 'Consultation fee', help: 'The first call fee that comes off the full fee.', type: 'price', def: '150' },
  { key: 'electrical_price', group: 'Prices (ex GST)', label: 'Electrical and plumbing licence, fee from', help: 'Shown on the electrical and plumbing page.', type: 'price', def: '1500' },
  { key: 'trade_price', group: 'Prices (ex GST)', label: 'Trade contractor licence, fee from', help: 'Shown on the trade contractor, prices and state pages.', type: 'price', def: '495' },
  { key: 'phone', group: 'Phone', label: 'Phone number', help: 'Changes the number and the tap-to-call link on every page.', type: 'phone', def: '0412 767 129' },
  { key: 'hero_headline', group: 'Home page', label: 'Main headline', help: 'The big heading at the top of the home page.', type: 'text', max: 70, def: 'Your Trade Licence, Approved First Time' },
  { key: 'hero_subline', group: 'Home page', label: 'Line under the headline', help: 'The short line under the headline.', type: 'text', max: 90, def: 'Takes less than 30 seconds' },
  { key: 'banner_text', group: 'Notice at the top of every page', label: 'Notice (leave empty for none)', help: 'A short message in a yellow bar, for example "Closed 24 Dec to 2 Jan. Back 3 Jan."', type: 'longtext', max: 200, def: '' },
];

const BY_KEY = Object.fromEntries(FIELDS.map((f) => [f.key, f]));

const commas = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const escHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Phone numbers are stored as Dan sees them: 0412 767 129 (mobile) or 02 1234 5678 (landline)
function formatPhone(digits) {
  return digits.startsWith('04') ? `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}` : `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
}

// Checks one value. Returns { value } (cleaned) or { error } (plain language).
export function cleanValue(field, raw) {
  const text = String(raw == null ? '' : raw);
  if (field.type === 'price') {
    const s = text.replace(/[\s$,]/g, '');
    if (!/^\d{2,5}$/.test(s) || Number(s) < 10) return { error: 'Enter a whole dollar amount, like 495.' };
    return { value: String(Number(s)) };
  }
  if (field.type === 'phone') {
    let s = text.replace(/[\s\-()]/g, '');
    if (s.startsWith('+61')) s = '0' + s.slice(3);
    else if (/^61\d{9}$/.test(s)) s = '0' + s.slice(2);
    if (!/^0[2-478]\d{8}$/.test(s)) return { error: 'Enter an Australian phone number with area code, like 0412 767 129.' };
    return { value: formatPhone(s) };
  }
  const s = text.replace(/[<>\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim();
  if (s.length > field.max) return { error: `Keep this to ${field.max} characters or fewer (it is ${s.length}).` };
  if (!s && field.def) return { error: 'This cannot be empty. Tap "Reset to original" to go back to the original wording.' };
  return { value: s };
}

// Saved overrides as { key: value }. Never throws: a missing table or database just means "use the originals".
export async function loadOverrides(env) {
  if (!env.DB) return {};
  try {
    const rows = await env.DB.prepare('SELECT key, value FROM site_settings').all();
    const out = {};
    for (const r of rows.results || []) if (BY_KEY[r.key]) out[r.key] = r.value;
    return out;
  } catch (err) {
    return {};
  }
}

// ---------- Dashboard API ----------

export async function settingsForDashboard(env) {
  if (!env.DB) return { needsSetup: true, fields: [] };
  let overrides = {};
  try {
    const rows = await env.DB.prepare('SELECT key, value FROM site_settings').all();
    for (const r of rows.results || []) overrides[r.key] = r.value;
  } catch (err) {
    return { needsSetup: true, fields: [] };
  }
  return {
    needsSetup: false,
    fields: FIELDS.map((f) => ({
      key: f.key, group: f.group, label: f.label, help: f.help, type: f.type, max: f.max || 0, def: f.def,
      value: BY_KEY[f.key] && overrides[f.key] !== undefined ? overrides[f.key] : f.def,
    })),
  };
}

// body = { values: { key: "raw text" } }. Saving the original value removes the override, so Reset and "same as original" are the same thing.
// All-or-nothing: if any value is invalid nothing is saved and the errors come back per field.
export async function saveSettings(env, body, who) {
  const values = body && typeof body.values === 'object' && body.values ? body.values : null;
  if (!values) return { status: 400, data: { error: 'Nothing to save.' } };
  const errors = {};
  const clean = {};
  for (const [key, raw] of Object.entries(values)) {
    const field = BY_KEY[key];
    if (!field) { errors[key] = 'Unknown setting.'; continue; }
    const r = cleanValue(field, raw);
    if (r.error) errors[key] = r.error; else clean[key] = r.value;
  }
  if (Object.keys(errors).length) return { status: 400, data: { errors } };

  const now = new Date().toISOString();
  const stmts = Object.entries(clean).map(([key, value]) => (
    value === BY_KEY[key].def
      ? env.DB.prepare('DELETE FROM site_settings WHERE key = ?').bind(key)
      : env.DB.prepare('INSERT INTO site_settings (key, value, updated_at, updated_by) VALUES (?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by').bind(key, value, now, who || '')
  ));
  if (stmts.length) await env.DB.batch(stmts);
  return { status: 200, data: await settingsForDashboard(env) };
}

// ---------- Applying settings to pages ----------

const PRICE_BY_DEFAULT = { 495: 'trade_price', 550: 'company_price', 2000: 'builder_price', 1500: 'electrical_price', 150: 'consultation_fee' };
const ORIGINAL_HEADLINE = '<h1 id="hero-h">' + BY_KEY.hero_headline.def + '</h1>';
const ORIGINAL_SUBLINE = /(<ul class="tool-hero-points">\s*<li>)Takes less than 30 seconds(<\/li>)/;

// Swaps saved values into one page's HTML or text. Returns the text unchanged when nothing is saved.
export function applySettings(text, o, { path = '/', html = false } = {}) {
  let out = text;

  // Prices: written in text as $1,500 and in schema (JSON-LD) as "price": "1500" or "minPrice": 1500
  const newPrice = {};
  for (const [orig, key] of Object.entries(PRICE_BY_DEFAULT)) if (o[key]) newPrice[orig] = o[key];
  if (Object.keys(newPrice).length) {
    out = out.replace(/(?<![\w.,])\$(2,000|1,500|550|495|150)(?!\d|,\d)/g, (m, n) => {
      const v = newPrice[n.replace(',', '')];
      return v ? '$' + commas(v) : m;
    });
    out = out.replace(/("(?:price|minPrice)"\s*:\s*"?)(2000|1500|550|495)(?=["},\s])/g, (m, pre, n) => (newPrice[n] ? pre + newPrice[n] : m));
  }

  // Phone: display (0412 767 129), plain digits, and the +61 form used by tel: links and schema
  if (o.phone) {
    const digits = o.phone.replace(/\s/g, '');
    out = out
      .split('+61412767129').join('+61' + digits.slice(1))
      .split('0412 767 129').join(o.phone)
      .split('0412767129').join(digits);
  }

  if (html) {
    if (path === '/') {
      if (o.hero_headline) out = out.replace(ORIGINAL_HEADLINE, () => '<h1 id="hero-h">' + escHtml(o.hero_headline) + '</h1>');
      if (o.hero_subline) out = out.replace(ORIGINAL_SUBLINE, (m, a, b) => a + escHtml(o.hero_subline) + b);
    }
    if (o.banner_text) {
      const bar = '<div id="site-notice" role="status" style="background:#fff3c4;color:#3d2c00;border-bottom:1px solid #e6c15a;padding:10px 16px;text-align:center;font:600 15px/1.35 system-ui,-apple-system,Segoe UI,Roboto,sans-serif">' + escHtml(o.banner_text) + '</div>';
      out = out.replace(/<body[^>]*>/i, (m) => m + '\n' + bar);
    }
  }
  return out;
}

// Wraps a finished response: HTML and text pages get Dan's saved settings. Everything else passes through untouched.
export async function withSiteSettings(request, env, res) {
  if (!env.DB) return res;
  const path = new URL(request.url).pathname.replace(/\/$/, '') || '/';
  if (path === '/dashboard' || path.startsWith('/dashboard/')) return res;
  const type = res.headers.get('Content-Type') || '';
  const html = type.includes('text/html');
  if (!html && !type.includes('text/plain')) return res;

  const overrides = await loadOverrides(env);
  if (!Object.keys(overrides).length) return res;

  const text = await res.text();
  const headers = new Headers(res.headers);
  headers.delete('Content-Length');
  headers.delete('ETag');
  return new Response(applySettings(text, overrides, { path, html }), { status: res.status, statusText: res.statusText, headers });
}
