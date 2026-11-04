/**
 * Trade Licence Solutions — Cloudflare Worker
 * tradelicencesolutions.com.au
 * Built by Maverick Digital
 */

import { pages } from './pages.js';
import { getCSS } from './styles.js';
import { layout } from './layout.js';

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
  ['/states', 'Licences by state'],
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
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '') || '/';
    const isGet = request.method === 'GET';

    // Images and other static files from /public
    if (path.startsWith('/images/') || /^\/(favicon[^/]*\.(ico|png)|apple-touch-icon\.png|icon-(192|512)\.png|site\.webmanifest)$/.test(path)) {
      return env.ASSETS.fetch(request);
    }

    // Crawler files
    if (isGet && path === '/robots.txt') return textResponse(robotsTxt(), 'text/plain; charset=UTF-8');
    if (isGet && path === '/sitemap.xml') return textResponse(sitemapXml(), 'application/xml; charset=UTF-8');
    if (isGet && path === '/llms.txt') return textResponse(llmsTxt(), 'text/plain; charset=UTF-8');

    // One home page only: old /home and /entry.html addresses go to /
    if (path === '/home' || path === '/entry.html') {
      return Response.redirect(`${url.origin}/`, 301);
    }

    // Old state URLs permanently redirect to the new state pages
    if (OLD_STATE_URLS[path]) {
      return Response.redirect(`${url.origin}/${OLD_STATE_URLS[path]}`, 301);
    }

    // State pages: clean URLs such as /new-south-wales served from /states/<slug>.html
    if (isGet && STATE_PAGES.some(([slug]) => slug === path.slice(1))) {
      return env.ASSETS.fetch(new Request(new URL(`/states/${path.slice(1)}.html`, request.url), request));
    }

    // Entry page: state selector and eligibility check (approved design)
    if (isGet && path === '/') {
      const asset = await env.ASSETS.fetch(new Request(new URL('/home.html', request.url), request));
      return new Response(asset.body, {
        status: asset.status,
        headers: { ...Object.fromEntries(asset.headers), ...SECURITY_HEADERS },
      });
    }

    // Readiness check form submission
    if (request.method === 'POST' && path === '/readiness-check') {
      return handleReadinessCheck(request, env);
    }

    // Contact form submission
    if (request.method === 'POST' && path === '/contact-submitted') {
      return handleContact(request, env);
    }

    const page = pages[path] || pages['/404'];
    return renderPage(page, path, env);
  },
};

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

function turnstileWidget(env) {
  if (!env.TURNSTILE_SITE_KEY) return '';
  return `<div class="cf-turnstile" data-sitekey="${esc(env.TURNSTILE_SITE_KEY)}"></div>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`;
}

function notice(title, bodyHtml) {
  return {
    title: `${title} — Trade Licence Solutions`,
    description: title,
    noindex: true,
    content: `
      <section class="hero hero--inner"><div class="container"><h1>${title}</h1></div></section>
      <section class="section">
        <div class="container container--narrow">
          ${bodyHtml}
          <div class="cta-block">
            <a href="tel:+61412767129" class="btn btn--primary">Call Dan on ${PHONE_DISPLAY}</a>
          </div>
        </div>
      </section>
    `,
  };
}

async function handleContact(request, env) {
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
          notice('Security check did not pass', `<p>Please go back and try again, or call Dan directly.</p>`),
          '/contact-submitted', env, 403
        );
      }
    } catch (err) {
      return renderPage(
        notice('Something went wrong', `<p>Please call Dan directly and he will take it from there.</p>`),
        '/contact-submitted', env, 502
      );
    }
  }

  // Email relay (Google Apps Script, see dan/gmail-relay-apps-script.js)
  if (!env.GMAIL_RELAY_URL || !env.GMAIL_RELAY_KEY) {
    return renderPage(
      notice('The form is not working right now', `<p>Sorry about that. Please call Dan and he will take your details.</p>`),
      '/contact-submitted', env, 503
    );
  }

  // Enquiry goes to Dan's Google Apps Script, which adds a row to his sheet and emails him
  const referer = request.headers.get('Referer') || '';
  let source = '/contact';
  try { source = new URL(referer).pathname || '/contact'; } catch (err) { /* no referer */ }

  let sent = false;
  try {
    const relay = await fetch(env.GMAIL_RELAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify({ key: env.GMAIL_RELAY_KEY, name, phone, email, state, licence, message, source }),
    });
    const data = await relay.json();
    sent = data && data.ok === true;
  } catch (err) {
    sent = false;
  }

  if (!sent) {
    return renderPage(
      notice('The form is not working right now', `<p>Sorry about that. Please call Dan and he will take your details.</p>`),
      '/contact-submitted', env, 502
    );
  }

  return renderPage(pages['/contact-submitted'], '/contact-submitted', env);
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
            <a href="/contact" class="btn btn--primary">Book a free call with Dan</a>
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

Sitemap: ${SITE}/sitemap.xml
`;
}

function sitemapXml() {
  const skip = new Set(['/404', '/readiness-check', '/contact-submitted', '/home', ...Object.keys(OLD_STATE_URLS)]);
  const paths = ['/', ...Object.entries(pages)
    .filter(([p, page]) => !page.noindex && !skip.has(p))
    .map(([p]) => p)];
  const urls = [...paths, ...STATE_PAGES.map(([slug]) => `/${slug}`)].map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${LASTMOD}</lastmod></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function llmsTxt() {
  return `# Trade Licence Solutions

> Trade Licence Solutions is run by Dan Pleaner. Dan helps tradies and builders get builder licences, company licences, mutual recognition and trade contractor licences in all 8 Australian states and territories. Dan answers his own phone: ${PHONE_DISPLAY}.

## Prices (from)
- Builder licence application: from $2,000
- Company licence: from $550
- Mutual recognition: from $550 per state

## Key pages
${LLMS_LINKS.map(([p, label]) => `- [${label}](${SITE}${p})`).join('\n')}

## State pages
${STATE_PAGES.map(([slug, name]) => `- [${name} Licence Solutions](${SITE}/${slug})`).join('\n')}
`;
}
