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
  </script>${faqJsonLd(page.content || '')}
</head>
<body>

<a href="#main" class="skip-link">Skip to content</a>

<header class="site-header" role="banner">
  <nav class="nav" role="navigation" aria-label="Main navigation">
    <a href="/" class="nav__logo" aria-label="Trade Licence Solutions — home">
      <img src="/images/logo.png" alt="Trade Licence Solutions" width="52" height="52">
    </a>
    <ul id="nav-menu" class="nav__links" role="list">
      <li><a href="/services">Services</a></li>
      <li><a href="/states">By state</a></li>
      <li><a href="/pricing">Pricing</a></li>
      <li><a href="/about">About Dan</a></li>
      <li><a href="/faq">FAQs</a></li>
      <li><a href="/contact" class="nav__cta">Book a free call</a></li>
    </ul>
    <div class="nav__actions">
      <a href="tel:+61412767129" class="nav__call" aria-label="Call Dan on 0412 767 129">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>
      </a>
      <button class="nav__toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav-menu">
        <span class="nav__toggle-bar"></span>
        <span class="nav__toggle-bar"></span>
        <span class="nav__toggle-bar"></span>
      </button>
    </div>
  </nav>
</header>

<div class="trust-bar" role="complementary" aria-label="Key points">
  <ul class="trust-bar__items">
    <li>Builder, company and mutual recognition</li>
    <li>Step-by-step, one-on-one help</li>
    <li>All 8 states and territories</li>
    <li>Dan answers his own phone</li>
  </ul>
</div>

<main id="main" tabindex="-1">
${page.content}
</main>

<div class="call-bar" role="complementary" aria-label="Contact">
  <div class="call-bar__inner">
    <p>Ready to get your licence? Dan answers his own phone.</p>
    <a href="tel:+61412767129" class="btn btn--call" aria-label="Call Dan on 0412 767 129">📞 0412 767 129</a>
    <a href="/contact" class="btn btn--navy">Book a free call</a>
  </div>
</div>

<footer class="site-footer" role="contentinfo">
  <div class="footer-grid">
    <div>
      <div class="footer-logo">
        <img src="/images/logo.png" alt="Trade Licence Solutions">
      </div>
      <p class="footer-tagline">Trade licence specialist for builders and trade contractors across Australia. Builder, company, mutual recognition and trade contractor licences in all 8 states and territories, with clear, step-by-step help from Dan.</p>
      <a class="footer-phone" href="tel:+61412767129" aria-label="Call Dan on 0412 767 129"><span class="footer-phone__icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg></span><span>0412 767 129</span></a>
    </div>
    <div class="footer-col">
      <h3>Services</h3>
      <ul>
        <li><a href="/company-licence">Company licences</a></li>
        <li><a href="/mutual-recognition">Mutual recognition</a></li>
        <li><a href="/builder-licence">Builder licences</a></li>
        <li><a href="/trade-contractor">Trade contractor</a></li>
        <li><a href="/pricing">Pricing</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>By state</h3>
      <ul>
        <li><a href="/new-south-wales">New South Wales</a></li>
        <li><a href="/queensland">Queensland</a></li>
        <li><a href="/victoria">Victoria</a></li>
        <li><a href="/australian-capital-territory">ACT</a></li>
        <li><a href="/south-australia">South Australia</a></li>
        <li><a href="/states">All states →</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 Trade Licence Solutions · <a href="/privacy" style="color:rgba(255,255,255,0.65);">Privacy &amp; Terms</a></p>
    <p class="footer-credit">Future proofed by <a href="${credit}" target="_blank" rel="noopener">Maverick Digital</a></p>
  </div>
</footer>

<a href="/contact" class="ask-dan" aria-label="Ask Dan — book a free call">
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>
  <span>Ask Dan</span>
</a>

<script>
(function () {
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  if (!nav || !toggle) return;
  function close() { nav.classList.remove('nav--open'); toggle.setAttribute('aria-expanded', 'false'); }
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('nav--open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('.nav__links a').forEach(function (a) { a.addEventListener('click', close); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('nav--open')) { close(); toggle.focus(); }
  });
})();
</script>

</body>
</html>`;
}
