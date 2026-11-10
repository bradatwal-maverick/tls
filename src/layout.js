const SITE = 'https://tradelicencesolutions.com.au';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function plain(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&rsquo;|&#8217;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

// Builds FAQPage schema from any <details> FAQ block on the page
function faqJsonLd(content) {
  const items = [];
  const re = /<summary>([\s\S]*?)<\/summary>\s*<div class="faq-answer">([\s\S]*?)<\/div>/g;
  let m;
  while ((m = re.exec(content))) {
    const q = plain(m[1]);
    const a = plain(m[2]);
    if (q && a) items.push({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } });
  }
  if (!items.length) return '';
  const json = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items }).replace(/</g, '\\u003c');
  return `\n  <script type="application/ld+json">${json}</script>`;
}

export function layout(page, css, ctx = {}) {
  const callBar = ctx.path === '/contact' ? '' : `<div class="call-bar" role="complementary" aria-label="Contact">
  <div class="call-bar__inner">
    <p>Ready to get your licence? Dan answers his own phone.</p>
    <a href="/contact" class="btn btn--navy">Book a Callback</a>
  </div>
</div>
`;
  const path = ctx.path || '/';
  const pageUrl = `${SITE}${path}`;
  const title = esc(page.title);
  const description = esc(page.description);
  const robots = page.noindex ? 'noindex,nofollow' : 'index,follow';
  const canonical = page.noindex ? '' : `\n  <link rel="canonical" href="${pageUrl}">`;
  const credit = 'https://maverickdigital.com.ai/future-proofed/?utm_source=tradelicencesolutions&amp;utm_medium=referral&amp;utm_campaign=future-proofed';

  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <script src="/analytics.js"></script>
  <script src="/intent.js"></script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="${robots}">${canonical}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Trade Licence Solutions">
  <meta property="og:locale" content="en_AU">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${pageUrl}">
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#0b5cad">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>${css}</style>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Trade Licence Solutions",
    "url": "${SITE}",
    "telephone": "+61412767129",
    "description": "Trade licence specialist helping tradies and builders get builder, company, mutual recognition and trade contractor licences in all 8 Australian states and territories. Dan Pleaner answers his own phone.",
    "areaServed": "AU",
    "priceRange": "$$",
    "founder": { "@type": "Person", "name": "Dan Pleaner" }
  }
  </script>${faqJsonLd(page.content || '')}${page.schema ? `\n  <script type="application/ld+json">${JSON.stringify(page.schema).replace(/</g, '\\u003c')}</script>` : ''}
</head>
<body>

<a href="#main" class="skip-link">Skip to content</a>

<div class="site-top">
<header class="site-header" role="banner">
  <nav class="nav" role="navigation" aria-label="Main navigation">
    <input type="checkbox" id="nav-check" class="nav__check" aria-label="Menu" aria-expanded="false">
    <a href="/" class="nav__logo" aria-label="Trade Licence Solutions — home">
      <img src="/images/logo.png" alt="Trade Licence Solutions" width="78" height="78">
    </a>
    <ul id="nav-menu" class="nav__links" role="list">
      <li class="nav__item nav__item--has-sub">
        <a href="/services">Services</a>
        <button class="nav__sub-toggle" type="button" aria-label="Services pages" aria-expanded="false" aria-controls="sub-services">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>
        </button>
        <ul id="sub-services" class="nav__sub" role="list">
          <li><a href="/builder-licence">Builder licences</a></li>
          <li><a href="/company-licence">Company licences</a></li>
          <li><a href="/electrical-plumbing-licence">Electrical and plumbing</a></li>
          <li><a href="/mutual-recognition">Mutual recognition</a></li>
          <li><a href="/trade-contractor">Trade contractor</a></li>
        </ul>
      </li>
      <li class="nav__item nav__item--has-sub">
        <a href="/states">By state</a>
        <button class="nav__sub-toggle" type="button" aria-label="State pages" aria-expanded="false" aria-controls="sub-states">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>
        </button>
        <ul id="sub-states" class="nav__sub" role="list">
          <li><a href="/australian-capital-territory">Australian Capital Territory</a></li>
          <li><a href="/new-south-wales">New South Wales</a></li>
          <li><a href="/northern-territory">Northern Territory</a></li>
          <li><a href="/queensland">Queensland</a></li>
          <li><a href="/south-australia">South Australia</a></li>
          <li><a href="/tasmania">Tasmania</a></li>
          <li><a href="/victoria">Victoria</a></li>
          <li><a href="/western-australia">Western Australia</a></li>
        </ul>
      </li>
      <li class="nav__item"><a href="/pricing">Pricing</a></li>
      <li class="nav__item"><a href="/contact" class="nav__cta">Book a Callback</a></li>
    </ul>
    <div class="nav__actions">
      <label for="nav-check" class="nav__toggle" title="Menu">
        <span class="nav__toggle-bar"></span>
        <span class="nav__toggle-bar"></span>
        <span class="nav__toggle-bar"></span>
      </label>
    </div>
  </nav>
</header>

<div class="trust-bar" role="complementary" aria-label="Key points">
  <ul class="trust-bar__items">
    <li>Australia-wide licence help</li>
    <li>Former HIA licensing advisor</li>
    <li>Straight advice, even when it's bad news</li>
    <li>Talk to Dan, not a call centre</li>
  </ul>
</div>
</div>

<main id="main" tabindex="-1">
${page.content}
</main>

${callBar}

<footer class="site-footer" role="contentinfo">
  <div class="footer-grid">
    <div>
      <div class="footer-logo">
        <img src="/images/logo.png" alt="Trade Licence Solutions">
      </div>
      <p class="footer-tagline">Trade licence specialist for builders and trade contractors across Australia. Builder, company, mutual recognition and trade contractor licences in all 8 states and territories, with clear, step-by-step help from Dan.</p>
    </div>
    <div class="footer-col">
      <h3>Services</h3>
      <ul>
        <li><a href="/apply">Apply now</a></li>
        <li><a href="/builder-licence">Builder licences</a></li>
        <li><a href="/check-eligibility">Check eligibility</a></li>
        <li><a href="/company-licence">Company licences</a></li>
        <li><a href="/electrical-plumbing-licence">Electrical and plumbing</a></li>
        <li><a href="/faq">FAQs</a></li>
        <li><a href="/mutual-recognition">Mutual recognition</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>By state</h3>
      <ul>
        <li><a href="/australian-capital-territory">ACT</a></li>
        <li><a href="/new-south-wales">New South Wales</a></li>
        <li><a href="/queensland">Queensland</a></li>
        <li><a href="/south-australia">South Australia</a></li>
        <li><a href="/victoria">Victoria</a></li>
        <li><a href="/states">All states →</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 Trade Licence Solutions · <a href="/privacy" style="color:rgba(255,255,255,0.65);">Privacy &amp; Terms</a></p>
    <p class="footer-credit">Future proofed by <a href="${credit}" target="_blank" rel="noopener">Maverick Digital &amp; AI</a></p>
  </div>
</footer>

<a href="/contact" class="ask-dan" aria-label="Check Eligibility in 30 Secs">
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>
  <span class="ask-dan__long">Check Eligibility in 30 Secs</span><span class="ask-dan__short">Check in 30 Sec</span>
</a>

<script src="/nav.js"></script>

</body>
</html>`;
}
