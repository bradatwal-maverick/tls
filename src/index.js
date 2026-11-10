/**
 * Trade Licence Solutions — Cloudflare Worker
 * tradelicencesolutions.com.au
 * Built by Maverick Digital
 */

import { pages } from './pages.js';
import { getCSS } from './styles.js';
import { layout } from './layout.js';
import { handleDashboard, saveEnquiry, notifyNewEnquiry, enquiryRef } from './dashboard.js';
import { handleTrack, readVisitorId } from './intent.js';

const SITE = 'https://tradelicencesolutions.com.au';
const PHONE_DISPLAY = '0412 767 129';
const LASTMOD = new Date().toISOString().slice(0, 10);

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const LLMS_LINKS = [
  ['/', 'Home: check your licence in 60 seconds'],
  ['/builder-licence', 'Builder licences'],
  ['/company-licence', 'Company licences'],
  ['/mutual-recognition', 'Mutual recognition'],
  ['/trade-contractor', 'Trade contractor licences'],
  ['/electrical-plumbing-licence', 'Electrical and plumbing licences'],
  ['/states', 'Licences by state'],
  ['/check-eligibility', 'Check your licence eligibility in 30 seconds'],
  ['/apply', 'Apply for your trade licence'],
  ['/pricing', 'Pricing'],
  ['/services', 'Services'],
  ['/faq', 'FAQs'],
  ['/about', 'About Dan'],
  ['/contact', 'Book a free 15-minute call'],
];

const STATE_PAGES = [
  ['new-south-wales', 'New South Wales'],
  ['queensland', 'Queensland'],
  ['victoria', 'Victoria'],
  ['australian-capital-territory', 'Australian Capital Territory'],
  ['south-australia', 'South Australia'],
  ['western-australia', 'Western Australia'],
  ['tasmania', 'Tasmania'],
  ['northern-territory', 'Northern Territory'],
];
const OLD_STATE_URLS = { '/nsw': 'new-south-wales', '/qld': 'queensland', '/vic': 'victoria', '/act': 'australian-capital-territory', '/sa': 'south-australia', '/wa': 'western-australia', '/tas': 'tasmania', '/nt': 'northern-territory' };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default {
  // Wraps every response: remembers Google Ad click details for the enquiry form (first-party cookie)
  async fetch(request, env, ctx) {
    const res = await routeRequest(request, env, ctx);
    const adCookie = adCookieFor(request);
    if (!adCookie) return res;
    const out = new Response(res.body, res);
    out.headers.append('Set-Cookie', adCookie);
    return out;
  },
};

// Old NSW domain: every address moves to the matching new page (301), or to the home page if there is no match
const OLD_DOMAIN = 'tradelicencesolutionsnsw.com.au';
const OLD_DOMAIN_RULES = [
  [/new-south-wales|nsw/, '/new-south-wales'],
  [/queensland|qld/, '/queensland'],
  [/victoria|\bvic\b/, '/victoria'],
  [/australian-capital|\bact\b/, '/australian-capital-territory'],
  [/south-australia|\bsa\b/, '/south-australia'],
  [/western-australia|\bwa\b/, '/western-australia'],
  [/tasmania|\btas\b/, '/tasmania'],
  [/northern-territory|\bnt\b/, '/northern-territory'],
  [/price|pricing|cost|fee/, '/pricing'],
  [/faq|question/, '/faq'],
  [/contact|enquir|book/, '/contact'],
  [/about|story/, '/about'],
  [/privacy/, '/privacy'],
  [/mutual/, '/mutual-recognition'],
  [/company|partnership/, '/company-licence'],
  [/builder/, '/builder-licence'],
  [/electric|plumb|drain/, '/electrical-plumbing-licence'],
  [/trade|contractor|licence|license/, '/trade-contractor'],
  [/service/, '/services'],
  [/guide|blog|state/, '/states'],
];

function oldDomainTarget(url) {
  const path = url.pathname.replace(/\/$/, '') || '/';
  const realPages = Object.keys(pages).filter((p) => !['/404', '/readiness-check', '/contact-submitted'].includes(p));
  const newPaths = new Set(['/', ...realPages, ...STATE_PAGES.map(([slug]) => `/${slug}`)]);
  if (newPaths.has(path)) return path;
  const lower = path.toLowerCase();
  const rule = OLD_DOMAIN_RULES.find(([re]) => re.test(lower));
  return rule ? rule[1] : '/';
}

async function routeRequest(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '') || '/';
    const isGet = request.method === 'GET';

    // Old domain (and its www) sends visitors to the matching new page, keeping any query string
    if (url.hostname === OLD_DOMAIN || url.hostname === `www.${OLD_DOMAIN}`) {
      return Response.redirect(`${SITE}${oldDomainTarget(url)}${url.search}`, 301);
    }

    // Enquiry dashboard (Cloudflare Access protected, see src/dashboard.js)
    const dash = await handleDashboard(request, env, ctx, path);
    if (dash) return dash;

    // Images and other static files from /public
    if (path.startsWith('/images/') || /^\/[\w-]+\.(css|js)$/.test(path) || /^\/(favicon[^/]*\.(ico|png)|apple-touch-icon\.png|icon-(192|512)\.png|site\.webmanifest)$/.test(path)) {
      return env.ASSETS.fetch(request);
    }

    // Crawler files
    if (isGet && path === '/robots.txt') return textResponse(robotsTxt(), 'text/plain; charset=UTF-8');
    if (isGet && path === '/sitemap.xml') return textResponse(sitemapXml(), 'application/xml; charset=UTF-8');
    if (isGet && path === '/llms.txt') return textResponse(llmsTxt(), 'text/plain; charset=UTF-8');

    // One home page only: old /home and /entry.html addresses go to /
    if (path === '/home' || path === '/home.html' || path === '/entry.html') {
      return Response.redirect(`${url.origin}/`, 301);
    }

    // Old state URLs permanently redirect to the new state pages
    if (OLD_STATE_URLS[path]) {
      return Response.redirect(`${url.origin}/${OLD_STATE_URLS[path]}`, 301);
    }

    // The /states/<slug> file addresses are never shown: send them to the clean /<slug> URL
    const fileState = path.match(/^\/states\/([\w-]+?)(\.html)?$/);
    if (fileState && STATE_PAGES.some(([slug]) => slug === fileState[1])) {
      return Response.redirect(`${url.origin}/${fileState[1]}`, 301);
    }

    // State pages: clean URLs such as /new-south-wales served from /states/<slug>.html.
    // Ask the asset store for the extensionless path: asking for .html makes it answer with a redirect.
    if (isGet && STATE_PAGES.some(([slug]) => slug === path.slice(1))) {
      const asset = await env.ASSETS.fetch(new Request(new URL(`/states/${path.slice(1)}`, request.url), request));
      return stateResponse(asset, env);
    }

    // Standalone eligibility check: clean URL served from public/check-eligibility.html
    if (isGet && (path === '/check-eligibility' || path === '/apply')) {
      const asset = await env.ASSETS.fetch(new Request(new URL(path, request.url), request));
      return new Response(asset.body, {
        status: asset.status,
        headers: { ...Object.fromEntries(asset.headers), ...SECURITY_HEADERS },
      });
    }

    // Entry page: two choices, check eligibility or apply (approved design)
    if (isGet && path === '/') {
      const asset = await env.ASSETS.fetch(new Request(new URL('/home', request.url), request));
      return new Response(asset.body, {
        status: asset.status,
        headers: { ...Object.fromEntries(asset.headers), ...SECURITY_HEADERS },
      });
    }

    // Readiness check form submission
    if (request.method === 'POST' && path === '/readiness-check') {
      return handleReadinessCheck(request, env);
    }

    // Anonymous visit tracking from public/intent.js (see src/intent.js)
    if (request.method === 'POST' && path === '/track') {
      return handleTrack(request, env, ctx);
    }

    // Contact form submission
    if (request.method === 'POST' && path === '/contact-submitted') {
      return handleContact(request, env, ctx);
    }

    // Live Google reviews for the homepage reviews widget (edge-cached)
    if (isGet && path === '/api/google-reviews') {
      return handleGoogleReviews(request, env, ctx);
    }

    const page = pages[path] || pages['/404'];
    return renderPage(page, path, env);
}

function renderPage(page, path, env, status) {
  const html = layout(page, getCSS(), { path }).replace('{{TURNSTILE_WIDGET}}', turnstileWidget(env));
  return new Response(html, {
    status: status || page.status || 200,
    headers: { 'Content-Type': 'text/html;charset=UTF-8', ...SECURITY_HEADERS },
  });
}

function textResponse(body, type) {
  return new Response(body, {
    headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=3600' },
  });
}

// State pages are static files. Swap in the Turnstile widget here, so the site key stays in the Worker settings.
async function stateResponse(asset, env) {
  if (!asset.ok || !(asset.headers.get('Content-Type') || '').includes('text/html')) return asset;
  const html = (await asset.text()).replace('{{TURNSTILE_WIDGET}}', turnstileWidget(env));
  const headers = new Headers(asset.headers);
  headers.delete('Content-Length');
  headers.delete('ETag');
  Object.entries(SECURITY_HEADERS).forEach(([k, v]) => headers.set(k, v));
  return new Response(html, { status: asset.status, headers });
}

function turnstileWidget(env) {
  if (!env.TURNSTILE_SITE_KEY) return '';
  return `<div class="cf-turnstile" data-sitekey="${esc(env.TURNSTILE_SITE_KEY)}"></div>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`;
}

function notice(title, bodyHtml, showPhone = false) {
  return {
    title: `${title} — Trade Licence Solutions`,
    description: title,
    noindex: true,
    content: `
      <section class="hero hero--inner"><div class="container"><h1>${title}</h1></div></section>
      <section class="section">
        <div class="container container--narrow">
          ${bodyHtml}
          ${showPhone ? `<div class="cta-block"><a href="tel:+61412767129" class="btn btn--primary">Call Dan on ${PHONE_DISPLAY}</a></div>` : ''}
        </div>
      </section>
    `,
  };
}

async function handleContact(request, env, ctx) {
  const form = await request.formData();
  const field = (key) => String(form.get(key) || '').trim();

  // Honeypot: bots fill this hidden field. Pretend success and send nothing.
  if (field('website')) return renderPage(pages['/contact-submitted'], '/contact-submitted', env);

  const name = field('name');
  const phone = field('phone');
  const email = field('email');
  const state = field('state');
  const licence = field('licence');
  const message = field('message');

  if (!name || !phone) {
    return renderPage(
      notice('Please add your name and phone number', '<p>Dan needs both to call you back.</p>'),
      '/contact-submitted', env, 400
    );
  }

  // Turnstile CAPTCHA check (only enforced once the secret key is set)
  if (env.TURNSTILE_SECRET_KEY) {
    const body = new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: field('cf-turnstile-response'),
      remoteip: request.headers.get('CF-Connecting-IP') || '',
    });
    try {
      const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
      const result = await verify.json();
      if (!result.success) {
        return renderPage(
          notice('Security check did not pass', `<p>Please go back and try again.</p>`),
          '/contact-submitted', env, 403
        );
      }
    } catch (err) {
      return renderPage(
        notice('Something went wrong', `<p>Please call Dan directly and he will take it from there.</p>`, true),
        '/contact-submitted', env, 502
      );
    }
  }

  // Save to the enquiry dashboard (D1) and alert Dan's phones. Runs even if the email relay is off.
  const referer = request.headers.get('Referer') || '';
  let source = '/contact';
  try { source = new URL(referer).pathname || '/contact'; } catch (err) { /* no referer */ }
  // Each route is tried on its own. The enquiry counts as received if either one works,
  // so a failed email never shows the visitor an error when the enquiry is already saved in D1.
  let saved = false;
  let ref = '';
  try {
    const id = await saveEnquiry(env, { name, phone, email, state, licence, message, source, visitorId: readVisitorId(request), ...readAdCookie(request) });
    saved = Boolean(id);
    if (saved) ref = enquiryRef(id);
    if (saved && ctx && ctx.waitUntil) ctx.waitUntil(notifyNewEnquiry(env).catch((err) => console.error('push alert failed', err)));
  } catch (err) {
    console.error('D1 save failed', err);
  }

  // Email Dan through Resend (transactional email API). No per-client Google approval needed.
  const emailed = await sendEnquiryEmail(env, { name, phone, email, state, licence, message, source, ref });

  if (!saved && !emailed) {
    return renderPage(
      notice('The form is not working right now', `<p>Sorry about that. Please call Dan and he will take your details.</p>`, true),
      '/contact-submitted', env, 502
    );
  }

  return renderPage(receivedPage({ name, phone, state, licence, ref }), '/contact-submitted', env);
}

// Confirmation page after a valid enquiry: enquiry number first, then the phone number Dan will call.
function receivedPage(e) {
  const LICENCE_LABELS = { builder: 'Builder', company: 'Company', mutual: 'Mutual recognition', trade: 'Trade', 'not sure': 'Not sure' };
  const first = esc(String(e.name || '').trim().split(/\s+/)[0] || 'there');
  const phone = esc(e.phone);
  const telPhone = esc(String(e.phone).replace(/\s/g, ''));
  const ref = e.ref ? esc(e.ref) : '';
  const base = pages['/contact-submitted'];
  const content = `
      <section class="hero">
        <div class="container container--narrow">
          <h1>Thanks ${first}, we have your enquiry.</h1>
          <div style="background:#fff;border:1px solid #dfe5ec;border-radius:12px;padding:1rem 1.25rem;margin:1.25rem 0;text-align:left;color:#1b2430;">
            ${ref ? `<p style="margin:0 0 .4rem;"><strong>Enquiry number:</strong> ${ref}</p>` : ''}
            <p style="margin:0 0 .4rem;"><strong>Name:</strong> ${esc(e.name)}</p>
            <p style="margin:0 0 .4rem;"><strong>State:</strong> ${esc((e.state || 'not given').toUpperCase())}</p>
            <p style="margin:0;"><strong>Licence:</strong> ${esc(LICENCE_LABELS[e.licence] || e.licence || 'not given')}</p>
          </div>
          <p style="font-size:1.15rem;"><strong>Dan will call you on <a href="tel:${telPhone}" style="color:var(--orange);">${phone}</a>.</strong></p>
          <p>${ref ? `Quote ${ref} if you call Dan first. ` : ''}Dan personally calls everyone back. If it's urgent, call him directly on <a href="tel:+61412767129" style="color:var(--orange);">0412 767 129</a>.</p>
          <div class="hero__ctas">
            <a href="/" class="btn btn--primary">Back to home</a>
          </div>
        </div>
      </section>
      <span data-track-form-complete="contact" hidden></span>
    `;
  return { ...base, content };
}

// Live Google reviews — pulled from Dan's Google Business Profile via the Places API (New),
// edge-cached for 24h so we don't burn quota or slow the homepage down.
// Needs two Worker secrets: GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID.
async function handleGoogleReviews(request, env, ctx) {
  const cache = caches.default;
  const cacheKey = new Request(new URL('/api/google-reviews', request.url).toString(), request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const empty = () => jsonResponse({ rating: null, total: 0, reviews: [] }, 200, 300);

  if (!env.GOOGLE_PLACES_API_KEY || !env.GOOGLE_PLACE_ID) return empty();

  try {
    const apiUrl = `https://places.googleapis.com/v1/places/${env.GOOGLE_PLACE_ID}?fields=rating,userRatingCount,reviews&languageCode=en-AU`;
    const res = await fetch(apiUrl, {
      headers: { 'X-Goog-Api-Key': env.GOOGLE_PLACES_API_KEY, 'X-Goog-FieldMask': 'rating,userRatingCount,reviews' },
    });
    if (!res.ok) return empty();
    const data = await res.json();
    const reviews = (data.reviews || [])
      .filter((r) => r.text && r.text.text)
      .map((r) => ({
        author: (r.authorAttribution && r.authorAttribution.displayName) || 'Google user',
        rating: r.rating || null,
        text: r.text.text,
        relativeTime: r.relativePublishTimeDescription || '',
      }));
    const payload = { rating: data.rating || null, total: data.userRatingCount || 0, reviews };
    const response = jsonResponse(payload, 200, 86400);
    if (ctx && ctx.waitUntil) ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    return empty();
  }
}

function jsonResponse(data, status, maxAgeSeconds) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Cache-Control': `public, max-age=${maxAgeSeconds}`,
      ...SECURITY_HEADERS,
    },
  });
}

async function handleReadinessCheck(request, env) {
  const formData = await request.formData();
  const licenceType = String(formData.get('licence_type') || '');
  const firstName = String(formData.get('first_name') || '').trim().slice(0, 40);

  return renderPage(buildReadinessResult(licenceType, firstName), '/readiness-check', env);
}

function buildReadinessResult(licenceType, firstName) {
  const name = firstName ? esc(firstName) : 'You';
  let heading = '';
  let body = '';

  if (licenceType === 'builder') {
    heading = `${name}, here's what you need for a builder licence`;
    body = `
      <p>A builder licence lets you contract directly with clients and take on jobs valued above the threshold in your state. Here's what's typically required:</p>
      <ul>
        <li>Proof of trade or building qualifications</li>
        <li>Evidence of relevant work experience (usually 2–5 years)</li>
        <li>Financial fitness check</li>
        <li>Insurance (public liability + home warranty where applicable)</li>
        <li>Fit and proper person declaration</li>
      </ul>
      <p>Dan's fee for a builder licence application is <strong>from $2,000</strong> — including all preparation, lodgement and follow-up with the regulator.</p>
    `;
  } else if (licenceType === 'company') {
    heading = `${name}, here's what a company licence involves`;
    body = `
      <p>A company contractor licence lets your Pty Ltd entity hold the licence — not just an individual. This protects you personally and is essential for growth.</p>
      <ul>
        <li>A qualified supervisor must be nominated (and notified within 7 days if they leave — or your licence is at risk)</li>
        <li>Company must meet financial fitness requirements</li>
        <li>Directors need fit and proper person declarations</li>
        <li>Insurance held in the company name</li>
      </ul>
      <p>Dan's fee for a company licence is <strong>from $550</strong> — faster than a builder licence application.</p>
    `;
  } else if (licenceType === 'mutual-recognition') {
    heading = `${name}, you may qualify for mutual recognition`;
    body = `
      <p>If you hold a licence in one Australian state, you may be able to work in another state without sitting new exams — this is called mutual recognition.</p>
      <ul>
        <li><strong>Automatic Mutual Recognition (AMR)</strong> applies in most states — you notify the regulator rather than apply</li>
        <li>Some states and licence types still require a formal application</li>
        <li>Endorsement is state-specific — Dan handles the paperwork so you don't miss a step</li>
      </ul>
      <p>Dan's fee for mutual recognition is <strong>from $550</strong>.</p>
    `;
  } else {
    heading = `${name}, let's find the right path for you`;
    body = `<p>Book a free 15-minute call with Dan and he'll tell you exactly what you need and how long it will take.</p>`;
  }

  return {
    title: 'Your Readiness Check Result — Trade Licence Solutions',
    description: 'Your personalised licence readiness result.',
    noindex: true,
    content: `
      <section class="hero hero--result">
        <div class="container">
          <h1>${heading}</h1>
        </div>
      </section>
      <section class="section">
        <div class="container container--narrow">
          ${body}
          <div class="cta-block">
            <a href="/contact" class="btn btn--primary">Book a Callback with Dan</a>
            <a href="/readiness-check" class="btn btn--ghost">Start over</a>
          </div>
        </div>
      </section>
    `,
  };
}

function robotsTxt() {
  return `User-agent: *
Allow: /

Disallow: /dashboard

Sitemap: ${SITE}/sitemap.xml
`;
}

function sitemapXml() {
  const skip = new Set(['/404', '/readiness-check', '/contact-submitted', '/home', ...Object.keys(OLD_STATE_URLS)]);
  const paths = ['/', ...Object.entries(pages)
    .filter(([p, page]) => !page.noindex && !skip.has(p))
    .map(([p]) => p)];
  const urls = [...paths, '/check-eligibility', '/apply', ...STATE_PAGES.map(([slug]) => `/${slug}`)].map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${LASTMOD}</lastmod></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function llmsTxt() {
  return `# Trade Licence Solutions

> Trade Licence Solutions is run by Dan Pleaner. Dan helps tradies and builders get builder licences, company licences, mutual recognition and trade contractor licences in all 8 Australian states and territories. Enquiries go through the contact form at ${SITE}/contact.

## Prices (from, all ex GST; government fees are separate)
- Trade contractor licence: from $495
- Electrical and plumbing licence: from $1,500
- Builder licence application: from $2,000
- Electrical and plumbing licence application: from $1,500
- Company licence: from $550
- Mutual recognition: from $550 per state
- $150 consultation comes off the full fee

## Key pages
${LLMS_LINKS.map(([p, label]) => `- [${label}](${SITE}${p})`).join('\n')}

## State pages
${STATE_PAGES.map(([slug, name]) => `- [${name} Licence Solutions](${SITE}/${slug})`).join('\n')}
`;
}

// ---------- Google Ad tracking ----------
// Keeps gclid and UTM values from the ad click for 30 days, so the enquiry form can record them.
const AD_KEYS = ['gclid', 'utm_source', 'utm_medium', 'utm_campaign'];

function adCookieFor(request) {
  if (request.method !== 'GET') return null;
  const url = new URL(request.url);
  const ad = {};
  for (const k of AD_KEYS) {
    const v = (url.searchParams.get(k) || '').slice(0, 200);
    if (v) ad[k] = v;
  }
  if (!Object.keys(ad).length) return null;
  ad.landing_page = url.pathname.slice(0, 200);
  return `tls_ad=${encodeURIComponent(JSON.stringify(ad))}; Path=/; Max-Age=2592000; Secure; HttpOnly; SameSite=Lax`;
}

// Sends one enquiry email to Dan via Resend. Returns true only if Resend accepts it.
// Worker settings: RESEND_API_KEY (Secret). Optional: EMAIL_FROM (verified sending address), EMAIL_TO (Dan's inbox).
async function sendEnquiryEmail(env, e) {
  if (!env.RESEND_API_KEY) {
    console.error('email not configured: set RESEND_API_KEY');
    return false;
  }
  const from = env.EMAIL_FROM || 'Trade Licence Solutions <enquiries@tradelicencesolutions.com.au>';
  const to = env.EMAIL_TO || 'dpleaner@gmail.com';
  const oneLine = (s) => String(s || '').replace(/[\r\n]+/g, ' ').trim();
  const hasEmail = e.email && e.email.indexOf('@') > 0;
  const text = [
    'Enquiry number: ' + (e.ref || 'not saved'),
    'Name: ' + e.name,
    'Phone: ' + e.phone,
    'Email: ' + (e.email || 'not given'),
    'State: ' + (e.state || 'not given'),
    'Licence needed: ' + (e.licence || 'not given'),
    '',
    e.message || '(no message)',
    '',
    'Sent from: ' + (e.source || 'website'),
    'Reply to this email to answer the customer directly.',
  ].join('\n');
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: hasEmail ? e.email : undefined,
        subject: oneLine('New enquiry' + (e.ref ? ' ' + e.ref : '') + ': ' + e.name + ' (' + (e.state || 'state not given') + ')'),
        text,
      }),
    });
    if (!res.ok) {
      console.error('Resend refused', res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('Resend request failed', err);
    return false;
  }
}

function readAdCookie(request) {
  const header = request.headers.get('Cookie') || '';
  const part = header.split(';').map((c) => c.trim()).find((c) => c.startsWith('tls_ad='));
  if (!part) return {};
  try {
    const data = JSON.parse(decodeURIComponent(part.slice(7)));
    const out = {};
    for (const k of [...AD_KEYS, 'landing_page']) if (typeof data[k] === 'string') out[k] = data[k].slice(0, 200);
    return out;
  } catch (err) {
    return {};
  }
}
