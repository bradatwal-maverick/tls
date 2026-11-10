/**
 * Enquiry dashboard for Dan: /dashboard
 * Lists enquiries from D1, tracks responded and booked status, exports CSV, and sends Web Push alerts.
 * Protect the /dashboard path with Cloudflare Access (see the PR notes).
 */

const NOINDEX = {
  'X-Robots-Tag': 'noindex, nofollow',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

const STATES = ['nsw', 'qld', 'vic', 'act', 'sa', 'wa', 'tas', 'nt'];
const LICENCES = ['builder', 'company', 'mutual', 'trade', 'not sure'];

// Friendly enquiry number shown to the visitor, in Dan's email and on the dashboard, e.g. TLS-0001
export function enquiryRef(id) {
  return 'TLS-' + String(id).padStart(4, '0');
}

// Route entry point. Returns a Response, or null when the path is not a dashboard path.
export async function handleDashboard(request, env, ctx, path) {
  if (path !== '/dashboard' && !path.startsWith('/dashboard/')) return null;

  // Only people who passed Cloudflare Access reach here. Refuse anything else.
  if (!request.headers.get('Cf-Access-Authenticated-User-Email')) {
    return new Response('Dashboard is locked. Sign in through Cloudflare Access.', { status: 403, headers: NOINDEX });
  }
  if (!env.DB) {
    return new Response('Dashboard database is not connected yet.', { status: 503, headers: NOINDEX });
  }

  const method = request.method;
  if (method === 'GET' && path === '/dashboard') return page(env);
  if (method === 'GET' && path === '/dashboard/manifest.webmanifest') return manifest();
  if (method === 'GET' && path === '/dashboard/sw.js') return serviceWorker();
  if (method === 'GET' && path === '/dashboard/app.js') return appScript();
  if (method === 'GET' && path === '/dashboard/api/enquiries') return listEnquiries(request, env);
  if (method === 'GET' && path === '/dashboard/api/export.csv') return exportCsv(request, env);
  if (method === 'POST' && path === '/dashboard/api/push/subscribe') return subscribePush(request, env);

  const m = path.match(/^\/dashboard\/api\/enquiries\/(\d+)\/(booking|responded)$/);
  if (method === 'POST' && m) {
    const id = Number(m[1]);
    return m[2] === 'booking' ? setBooking(request, env, id) : markResponded(env, id);
  }

  return new Response('Not found', { status: 404, headers: NOINDEX });
}

// ---------- Saving and alerts (called from the contact form) ----------

export async function saveEnquiry(env, e) {
  if (!env.DB) return null;
  const isAd = e.gclid || (/google/i.test(e.utm_source || '') && /^(cpc|ppc|paid)$/i.test(e.utm_medium || '')) ? 1 : 0;
  const result = await env.DB.prepare(
    `INSERT INTO enquiries (created_at, name, phone, email, state, licence, message, source,
       gclid, utm_source, utm_medium, utm_campaign, landing_page, is_ad)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(new Date().toISOString(), e.name, e.phone, e.email || '', e.state || '', e.licence || '', e.message || '', e.source || '',
    e.gclid || '', e.utm_source || '', e.utm_medium || '', e.utm_campaign || '', e.landing_page || '', isAd)
    .run();
  return result.meta && result.meta.last_row_id;
}

export async function notifyNewEnquiry(env) {
  if (!env.DB || !env.VAPID_PRIVATE_JWK || !env.VAPID_PUBLIC_KEY) return;
  const rows = await env.DB.prepare('SELECT endpoint FROM push_subscriptions').all();
  const key = await importVapidKey(env.VAPID_PRIVATE_JWK);
  for (const row of rows.results || []) {
    const res = await sendPush(row.endpoint, env, key);
    if (res === 404 || res === 410) {
      await env.DB.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').bind(row.endpoint).run();
    }
  }
}

// ---------- Pages and API ----------

function filtersFrom(url) {
  const p = url.searchParams;
  const where = [];
  const binds = [];
  const from = p.get('from') || '';
  const to = p.get('to') || '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(from)) { where.push("date(created_at, '+10 hours') >= ?"); binds.push(from); }
  if (/^\d{4}-\d{2}-\d{2}$/.test(to)) { where.push("date(created_at, '+10 hours') <= ?"); binds.push(to); }
  if (STATES.includes(p.get('state'))) { where.push('state = ?'); binds.push(p.get('state')); }
  if (LICENCES.includes(p.get('licence'))) { where.push('licence = ?'); binds.push(p.get('licence')); }
  if (p.get('src') === 'ads') where.push('is_ad = 1');
  if (p.get('src') === 'other') where.push('is_ad = 0');
  if (p.get('status') === 'booked') where.push('booked = 1');
  if (p.get('status') === 'open') where.push('booked = 0');
  if (p.get('status') === 'unattended') where.push('responded = 0');
  const q = (p.get('q') || '').trim().slice(0, 100);
  const ref = q.match(/^tls[-\s]?0*(\d+)$/i); // search by enquiry number, e.g. TLS-0001
  if (ref) {
    where.push('id = ?');
    binds.push(Number(ref[1]));
  } else if (q) {
    where.push('(name LIKE ? OR phone LIKE ? OR email LIKE ? OR message LIKE ?)');
    const like = `%${q}%`;
    binds.push(like, like, like, like);
  }
  return { sql: where.length ? `WHERE ${where.join(' AND ')}` : '', binds };
}

async function listEnquiries(request, env) {
  const { sql, binds } = filtersFrom(new URL(request.url));
  const rows = await env.DB.prepare(`SELECT * FROM enquiries ${sql} ORDER BY created_at DESC, id DESC LIMIT 500`)
    .bind(...binds).all();
  const summary = await env.DB.prepare(
    `SELECT COUNT(*) AS total, SUM(booked) AS booked, COALESCE(SUM(CASE WHEN booked = 1 THEN amount_aud END), 0) AS revenue,
       COALESCE(SUM(CASE WHEN responded = 0 THEN 1 ELSE 0 END), 0) AS unattended
     FROM enquiries ${sql}`
  ).bind(...binds).first();
  return json({ rows: rows.results || [], summary });
}

async function exportCsv(request, env) {
  const url = new URL(request.url);
  const { sql, binds } = filtersFrom(url);
  const rows = await env.DB.prepare(`SELECT * FROM enquiries ${sql} ORDER BY created_at ASC, id ASC`).bind(...binds).all();
  const header = ['Enquiry number', 'Enquiry date (AEST)', 'Name', 'Phone', 'Email', 'State', 'Licence', 'Message', 'Responded', 'Booked',
    'Booked date (AEST)', 'Amount (AUD)', 'Google Ad', 'Source', 'Medium', 'Campaign', 'Landing page', 'Google click ID'];
  const lines = [header.map(csvCell).join(',')];
  for (const r of rows.results || []) {
    lines.push([
      enquiryRef(r.id), aest(r.created_at), r.name, r.phone, r.email, (r.state || '').toUpperCase(), r.licence, r.message,
      r.responded ? 'Yes' : 'No', r.booked ? 'Yes' : 'No', r.booked_at ? aest(r.booked_at) : '', r.amount_aud ?? '',
      r.is_ad ? 'Yes' : 'No', r.utm_source, r.utm_medium, r.utm_campaign, r.landing_page, r.gclid,
    ].map(csvCell).join(','));
  }
  const stamp = new Date().toISOString().slice(0, 10);
  const filtered = url.search ? '-filtered' : '-all';
  return new Response(lines.join('\r\n') + '\r\n', {
    headers: {
      ...NOINDEX,
      'Content-Type': 'text/csv;charset=UTF-8',
      'Content-Disposition': `attachment; filename="tls-enquiries${filtered}-${stamp}.csv"`,
    },
  });
}

// Any booking also counts as responded.
async function setBooking(request, env, id) {
  let body = {};
  try { body = await request.json(); } catch (err) { return json({ error: 'bad body' }, 400); }
  const booked = body.booked ? 1 : 0;
  let amount = null;
  if (body.amount !== undefined && body.amount !== null && body.amount !== '') {
    amount = Number(String(body.amount).replace(/[$,\s]/g, ''));
    if (!Number.isFinite(amount) || amount < 0 || amount > 1000000) return json({ error: 'bad amount' }, 400);
  }
  const now = new Date().toISOString();
  await env.DB.prepare(
    `UPDATE enquiries SET booked = ?, booked_at = ?, amount_aud = ?,
       responded = CASE WHEN ? = 1 THEN 1 ELSE responded END,
       responded_at = CASE WHEN ? = 1 THEN COALESCE(responded_at, ?) ELSE responded_at END
     WHERE id = ?`
  ).bind(booked, booked ? now : null, booked ? amount : null, booked, booked, now, id).run();
  return json({ ok: true });
}

// Called when Dan taps Call or Email, so the enquiry leaves the Unattended group.
async function markResponded(env, id) {
  await env.DB.prepare('UPDATE enquiries SET responded = 1, responded_at = COALESCE(responded_at, ?) WHERE id = ?')
    .bind(new Date().toISOString(), id).run();
  return json({ ok: true });
}

async function subscribePush(request, env) {
  let sub;
  try { sub = await request.json(); } catch (err) { return json({ error: 'bad body' }, 400); }
  if (!sub || !sub.endpoint || !sub.keys) return json({ error: 'bad subscription' }, 400);
  await env.DB.prepare(
    `INSERT INTO push_subscriptions (endpoint, subscription, created_at) VALUES (?, ?, ?)
     ON CONFLICT(endpoint) DO UPDATE SET subscription = excluded.subscription`
  ).bind(sub.endpoint, JSON.stringify(sub), new Date().toISOString()).run();
  return json({ ok: true });
}

// ---------- Web Push (VAPID, no payload, so no encryption needed) ----------

async function importVapidKey(jwkText) {
  return crypto.subtle.importKey('jwk', JSON.parse(jwkText), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
}

async function sendPush(endpoint, env, key) {
  const audience = new URL(endpoint).origin;
  const header = b64url(new TextEncoder().encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const claims = b64url(new TextEncoder().encode(JSON.stringify({
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    sub: env.VAPID_SUBJECT || 'https://tradelicencesolutions.com.au',
  })));
  const data = new TextEncoder().encode(`${header}.${claims}`);
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, data);
  const jwt = `${header}.${claims}.${b64url(new Uint8Array(sig))}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { TTL: '86400', Urgency: 'high', Authorization: `vapid t=${jwt}, k=${env.VAPID_PUBLIC_KEY}` },
  });
  return res.status;
}

// ---------- Helpers ----------

function b64url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function csvCell(v) {
  let s = v === null || v === undefined ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // stop spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
}

function aest(iso) {
  if (!iso) return '';
  const d = new Date(new Date(iso).getTime() + 10 * 3600 * 1000); // AEST (+10), ignores daylight saving
  return `${d.toISOString().slice(0, 16).replace('T', ' ')}`;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...NOINDEX, 'Content-Type': 'application/json;charset=UTF-8' } });
}

function manifest() {
  return new Response(JSON.stringify({
    name: 'TLS Enquiries',
    short_name: 'Enquiries',
    start_url: '/dashboard',
    scope: '/dashboard',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0b5cad',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }), { headers: { ...NOINDEX, 'Content-Type': 'application/manifest+json' } });
}

function serviceWorker() {
  const body = `
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {}); // network only: enquiries are always live
self.addEventListener('push', (event) => {
  event.waitUntil(self.registration.showNotification('New enquiry', {
    body: 'Someone has sent a licence enquiry. Tap to open.',
    icon: '/icon-192.png',
    badge: '/favicon-32x32.png',
    tag: 'new-enquiry',
    data: { url: '/dashboard' },
  }));
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data.url || '/dashboard'));
});
`;
  return new Response(body, { headers: { ...NOINDEX, 'Content-Type': 'application/javascript', 'Service-Worker-Allowed': '/dashboard' } });
}

function page(env) {
  const vapid = env.VAPID_PUBLIC_KEY || '';
  const stateOpts = STATES.map((s) => `<option value="${s}">${s.toUpperCase()}</option>`).join('');
  const licenceOpts = [['builder', 'Builder'], ['company', 'Company'], ['mutual', 'Mutual recognition'], ['trade', 'Trade'], ['not sure', 'Not sure']]
    .map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
  return new Response(`<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#0b5cad">
<title>Enquiries | TLS</title>
<meta name="vapid-public" content="${esc(vapid)}">
<link rel="manifest" href="/dashboard/manifest.webmanifest">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<style>
:root { --blue:#0b5cad; --ink:#1b2430; --muted:#5d6b7a; --line:#dfe5ec; --bg:#f4f6f9; --card:#ffffff; --green:#1e7b43; --amber:#b26a00; --amberbg:#fff6e0; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --ink:#e8edf3; --muted:#9fb0c2; --line:#2d3a48; --bg:#111820; --card:#18222d; --amberbg:#2b2414; } }
* { box-sizing: border-box; }
html, body { margin:0; background:var(--bg); color:var(--ink); font:16px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif; }
body { padding-bottom: env(safe-area-inset-bottom); min-height:100vh; overscroll-behavior-y: contain; }
header { position:sticky; top:0; z-index:5; background:var(--blue); color:#fff; padding:10px 16px; padding-top:calc(10px + env(safe-area-inset-top)); display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:8px 12px; }
.brand { display:flex; align-items:center; gap:10px; }
.brand img { width:44px; height:44px; background:#fff; border-radius:10px; padding:3px; }
header h1 { margin:0; font-size:20px; }
.hbtns { display:flex; flex-wrap:wrap; gap:6px; }
button.hbtn { font:inherit; font-size:14px; font-weight:600; padding:8px 10px; border-radius:8px; border:1px solid rgba(255,255,255,.55); background:rgba(255,255,255,.14); color:#fff; cursor:pointer; }
button.hbtn.done { background:#fff; color:var(--blue); }
main { padding:12px 16px 40px; max-width:760px; margin:0 auto; }
#ptr { text-align:center; color:var(--muted); font-size:14px; height:0; overflow:hidden; transition:height .2s; }
#ptr.on { height:40px; }
.summary { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin:6px 0 12px; }
.tile { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:9px 10px; min-width:0; }
.tile b { display:block; font-size:22px; }
.tile span { color:var(--muted); font-size:13px; }
.tile.alert { border-color:var(--amber); background:var(--amberbg); }
.tile.alert b { color:var(--amber); }
.panel { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:10px 12px; margin-bottom:12px; }
.panel summary { font-weight:600; cursor:pointer; }
.grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px; }
.grid .full { grid-column:1 / -1; }
label { font-size:13px; color:var(--muted); display:block; }
input, select { width:100%; font:inherit; padding:10px; border:1px solid var(--line); border-radius:8px; background:transparent; color:var(--ink); margin-top:4px; }
.btns { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
button, .btn { font:inherit; border:0; border-radius:10px; padding:11px 14px; background:var(--blue); color:#fff; font-weight:600; text-decoration:none; display:inline-block; cursor:pointer; }
button.sm, .btn.sm { padding:9px 12px; font-size:15px; }
button.ghost, .btn.ghost { background:transparent; color:var(--blue); border:1px solid var(--blue); }
button:disabled { opacity:.6; }
.item { background:var(--card); border:1px solid var(--line); border-radius:12px; margin-bottom:8px; overflow:hidden; }
.item.unattended { border-left:5px solid var(--amber); background:var(--amberbg); }
.line { display:flex; flex-wrap:wrap; align-items:center; gap:2px 10px; padding:11px 12px; cursor:pointer; list-style:none; }
.line::-webkit-details-marker { display:none; }
.line:focus-visible { outline:2px solid var(--blue); outline-offset:-2px; }
.dot { width:9px; height:9px; border-radius:50%; background:var(--amber); flex:0 0 9px; }
.name { font-weight:700; }
.ref { font-size:13px; font-weight:700; color:var(--blue); }
.meta { color:var(--muted); font-size:14px; }
.when { margin-left:auto; color:var(--muted); font-size:13px; }
.detail { padding:0 12px 12px; }
.label { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--muted); margin-top:4px; }
.msg { margin:4px 0 6px; white-space:pre-wrap; overflow-wrap:anywhere; }
.msg.muted { color:var(--muted); }
.badge { display:inline-block; font-size:12px; font-weight:700; padding:4px 9px; border-radius:99px; background:#eef2f6; color:var(--muted); white-space:nowrap; }
.badge.new { background:#fff0c7; color:var(--amber); }
.badge.responded { background:#e8f0fe; color:#1a56c4; }
.badge.booked { background:#e3f4ea; color:var(--green); }
.badge.ad { background:#e8f0fe; color:#1a56c4; }
.row { display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-top:8px; }
.empty { text-align:center; color:var(--muted); padding:30px 0; }
dialog { max-width:420px; width:calc(100% - 32px); border:0; border-radius:14px; padding:20px; background:var(--card); color:var(--ink); }
dialog::backdrop { background:rgba(0,0,0,.45); }
dialog h2 { margin:0 0 8px; font-size:19px; }
dialog ol { padding-left:20px; margin:8px 0; }
dialog li { margin-bottom:8px; }
@media (max-width:560px) {
  .summary { grid-template-columns:1fr 1fr; }
  header h1 { font-size:18px; }
  .when { margin-left:0; width:100%; }
  .grid { grid-template-columns:1fr; }
}
</style>
</head>
<body>
<header>
  <div class="brand">
    <img src="/images/logo.png" alt="Trade Licence Solutions" width="44" height="44">
    <h1>Enquiries</h1>
  </div>
  <div class="hbtns">
    <button type="button" id="a2hs" class="hbtn">Add to home screen</button>
    <button type="button" id="alerts" class="hbtn">Turn on phone alerts</button>
    <button type="button" id="csv" class="hbtn">Download CSV</button>
  </div>
</header>
<main>
  <div id="ptr">Pull down to refresh…</div>

  <div class="summary">
    <div class="tile"><b id="t-count">–</b><span>Enquiries</span></div>
    <div class="tile" id="tile-unattended"><b id="t-unattended">–</b><span>Unattended</span></div>
    <div class="tile"><b id="t-booked">–</b><span>Booked</span></div>
    <div class="tile"><b id="t-rev">–</b><span>Booked value</span></div>
  </div>

  <details class="panel" id="filters">
    <summary>Filter enquiries</summary>
    <form id="f" class="grid">
      <div><label>From<input type="date" name="from"></label></div>
      <div><label>To<input type="date" name="to"></label></div>
      <div><label>State<select name="state"><option value="">All states</option>${stateOpts}</select></label></div>
      <div><label>Licence<select name="licence"><option value="">All licences</option>${licenceOpts}</select></label></div>
      <div><label>Status<select name="status"><option value="">All</option><option value="unattended">Unattended</option><option value="open">Not booked</option><option value="booked">Booked</option></select></label></div>
      <div><label>Source<select name="src"><option value="">All sources</option><option value="ads">Google Ads only</option><option value="other">Not from ads</option></select></label></div>
      <div class="full"><label>Search<input type="search" name="q" placeholder="Name, phone, email, message or TLS-0001"></label></div>
      <div class="full btns">
        <button type="button" id="clear" class="ghost">Clear</button>
      </div>
    </form>
  </details>

  <div id="list"></div>
</main>

<dialog id="a2hs-dialog" aria-labelledby="a2hs-title">
  <h2 id="a2hs-title">Add to home screen</h2>
  <p><strong>On iPhone (Safari):</strong></p>
  <ol>
    <li>Tap the Share button (the square with an arrow) at the bottom of the screen.</li>
    <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
    <li>Tap <strong>Add</strong>. The Enquiries icon will appear on your home screen.</li>
  </ol>
  <p><strong>On Android (Chrome):</strong> tap the three dots menu, then <strong>Add to Home screen</strong> or <strong>Install app</strong>.</p>
  <div class="btns"><button type="button" id="a2hs-close">Got it</button></div>
</dialog>

<script src="/dashboard/app.js"></script>
</body>
</html>`, { headers: { ...NOINDEX, 'Content-Type': 'text/html;charset=UTF-8' } });
}

// The dashboard's page script, served as a file (not inline) so the site's Content Security Policy can block inline scripts.
function appScript() {
  return new Response(APP_JS, { headers: { ...NOINDEX, 'Content-Type': 'application/javascript' } });
}

// Plain JavaScript for the browser. No backticks or template placeholders in here.
const APP_JS = `const VAPID_PUBLIC = (document.querySelector('meta[name="vapid-public"]') || {}).content || '';
const $ = (s) => document.querySelector(s);
const form = $('#f');
const openIds = new Set();
let deferredInstall = null;

function el(tag, attrs, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') n.className = v; else if (k === 'href') n.href = v; else n.setAttribute(k, v);
  }
  for (const k of kids) n.append(k instanceof Node ? k : document.createTextNode(k == null ? '' : String(k)));
  return n;
}
function query() {
  const p = new URLSearchParams();
  for (const [k, v] of new FormData(form)) if (v) p.set(k, v);
  return p;
}
function money(n) { return '$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 2 }); }
function when(iso) {
  return new Date(iso).toLocaleString('en-AU', { timeZone: 'Australia/Sydney', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}
function refOf(id) { return 'TLS-' + String(id).padStart(4, '0'); }
const LABELS = { builder: 'Builder', company: 'Company', mutual: 'Mutual recognition', trade: 'Trade', 'not sure': 'Not sure' };

async function load() {
  const list = $('#list');
  try {
    const res = await fetch('/dashboard/api/enquiries?' + query(), { cache: 'no-store' });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const s = data.summary;
    $('#t-count').textContent = s.total || 0;
    $('#t-unattended').textContent = s.unattended || 0;
    $('#tile-unattended').classList.toggle('alert', Number(s.unattended || 0) > 0);
    $('#t-booked').textContent = s.booked || 0;
    $('#t-rev').textContent = money(s.revenue);
    list.replaceChildren();
    if (!data.rows.length) list.append(el('div', { class: 'empty' }, 'No enquiries match these filters.'));
    for (const r of data.rows) list.append(card(r));
  } catch (err) {
    list.replaceChildren(el('div', { class: 'empty' }, 'Could not load enquiries. Pull down to try again.'));
  }
}

function statusOf(r) {
  if (r.booked) return ['booked', 'Booked' + (r.amount_aud != null ? ' · ' + money(r.amount_aud) : '')];
  if (r.responded) return ['responded', 'Responded'];
  return ['new', 'Unattended'];
}

function card(r) {
  const st = statusOf(r);
  const unattended = st[0] === 'new';
  const badge = el('span', { class: 'badge ' + st[0] }, st[1]);
  const phone = String(r.phone || '').replace(/\\s/g, '');

  // Any tap on Call or Email counts as a response: the card leaves the Unattended group.
  function markResponded() {
    if (!unattended || badge.dataset.done) return;
    badge.dataset.done = '1';
    item.classList.remove('unattended');
    badge.className = 'badge responded';
    badge.textContent = 'Responded';
    const t = $('#t-unattended');
    t.textContent = Math.max(0, Number(t.textContent) - 1);
    $('#tile-unattended').classList.toggle('alert', Number(t.textContent) > 0);
    fetch('/dashboard/api/enquiries/' + r.id + '/responded', { method: 'POST', keepalive: true }).catch(() => {});
  }

  const call = el('a', { class: 'btn ghost sm', href: 'tel:' + phone }, 'Call ' + (r.phone || ''));
  call.addEventListener('click', markResponded);
  const kids = [call];
  if (r.email) {
    const mail = el('a', { class: 'btn ghost sm', href: 'mailto:' + r.email }, 'Email');
    mail.addEventListener('click', markResponded);
    kids.push(mail);
  }
  kids.push(badge);

  const btn = el('button', { type: 'button', class: 'sm' + (r.booked ? ' ghost' : '') }, r.booked ? 'Undo booked' : 'Mark booked');
  btn.addEventListener('click', async () => {
    const body = { booked: !r.booked };
    if (!r.booked) {
      const amt = prompt('Amount for ' + (r.name || 'this enquiry') + ' in dollars (leave blank if not known):', '');
      if (amt === null) return;
      body.amount = amt;
    }
    btn.disabled = true;
    const res = await fetch('/dashboard/api/enquiries/' + r.id + '/booking', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    if (res.ok) load(); else { btn.disabled = false; alert('Could not save. Please try again.'); }
  });
  kids.push(btn);

  const head = el('summary', { class: 'line' },
    unattended ? el('span', { class: 'dot', title: 'Unattended' }) : '',
    el('span', { class: 'name' }, r.name || 'No name'),
    el('span', { class: 'ref' }, refOf(r.id)),
    el('span', { class: 'meta' }, ((r.state || '').toUpperCase() || 'State ?') + ' · ' + (LABELS[r.licence] || r.licence || 'Licence ?')),
    el('span', { class: 'when' }, when(r.created_at))
  );

  const item = el('details', { class: 'item' + (unattended ? ' unattended' : '') },
    head,
    el('div', { class: 'detail' },
      r.is_ad ? el('div', { class: 'meta' }, 'From Google Ad' + (r.utm_campaign ? ' · ' + r.utm_campaign : '')) : '',
      el('div', { class: 'label' }, 'Message'),
      r.message ? el('div', { class: 'msg' }, r.message) : el('div', { class: 'msg muted' }, 'No message given.'),
      el('div', { class: 'row' }, ...kids)
    )
  );
  if (openIds.has(String(r.id))) item.open = true;
  item.addEventListener('toggle', () => {
    if (item.open) openIds.add(String(r.id)); else openIds.delete(String(r.id));
  });
  return item;
}

form.addEventListener('input', debounce(load, 250));
form.addEventListener('change', load);
$('#clear').addEventListener('click', () => { form.reset(); load(); });
$('#csv').addEventListener('click', () => {
  const q = query().toString();
  window.location.href = '/dashboard/api/export.csv' + (q ? '?' + q : '');
});

function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

// Add to home screen: Android uses the install prompt when the browser offers it; iPhone gets the steps popup.
const isInstalled = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
if (isInstalled) $('#a2hs').hidden = true;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstall = e; });
$('#a2hs').addEventListener('click', async () => {
  if (deferredInstall) {
    deferredInstall.prompt();
    try { await deferredInstall.userChoice; } catch (err) { /* ignore */ }
    deferredInstall = null;
    return;
  }
  const dlg = $('#a2hs-dialog');
  if (dlg.showModal) dlg.showModal(); else alert('On iPhone: tap Share, then Add to Home Screen. On Android: tap the three dots menu, then Add to Home screen.');
});
$('#a2hs-close').addEventListener('click', () => $('#a2hs-dialog').close());

// Phone alerts
function b64ToBytes(s) {
  const pad = '='.repeat((4 - s.length % 4) % 4);
  const raw = atob((s + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}
$('#alerts').addEventListener('click', async () => {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return alert('Alerts need the app added to your home screen first (iPhone: Share, then Add to Home Screen).');
    if (!VAPID_PUBLIC) return alert('Alerts are not set up yet. Brad needs to add the VAPID key.');
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') return alert('Alerts are off. Turn them on in your phone settings for this app.');
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(VAPID_PUBLIC) });
    await fetch('/dashboard/api/push/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sub) });
    $('#alerts').textContent = 'Phone alerts on';
    $('#alerts').classList.add('done');
  } catch (err) { alert('Could not turn on alerts: ' + err.message); }
});

if ('serviceWorker' in navigator) navigator.serviceWorker.register('/dashboard/sw.js', { scope: '/dashboard' }).catch(() => {});

// Pull down to refresh (installed app)
let startY = null;
window.addEventListener('touchstart', (e) => { startY = window.scrollY === 0 ? e.touches[0].clientY : null; }, { passive: true });
window.addEventListener('touchmove', (e) => {
  if (startY === null) return;
  const dy = e.touches[0].clientY - startY;
  $('#ptr').classList.toggle('on', dy > 40);
}, { passive: true });
window.addEventListener('touchend', async (e) => {
  if (startY === null) return;
  const dy = e.changedTouches[0].clientY - startY;
  startY = null;
  if (dy > 80) { $('#ptr').textContent = 'Refreshing…'; await load(); }
  $('#ptr').classList.remove('on');
  $('#ptr').textContent = 'Pull down to refresh…';
}, { passive: true });

load();
`;

function esc(v) {
  return String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
