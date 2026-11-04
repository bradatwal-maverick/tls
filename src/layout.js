export function layout(page, css) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  ${page.noindex ? '<meta name="robots" content="noindex,nofollow">' : '<meta name="robots" content="index,follow">'}
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
    "url": "https://tradelicencesolutions.com.au",
    "telephone": "+61412767129",
    "description": "Australia's most affordable trade licence specialist. 500+ licences obtained, 98% first-time approval rate. Builder licences, company licences and mutual recognition in all states from $550.",
    "areaServed": "AU",
    "priceRange": "$$",
    "founder": { "@type": "Person", "name": "Dan Pleaner" }
  }
  </script>
</head>
<body>

<a href="#main" class="skip-link" style="position:absolute;left:-9999px;top:0;background:var(--navy);color:#fff;padding:0.5rem 1rem;z-index:999;">Skip to content</a>

<header class="site-header" role="banner">
  <nav class="nav" role="navigation" aria-label="Main navigation">
    <a href="/" class="nav__logo" aria-label="Trade Licence Solutions — home">
      <img src="/images/logo.png" alt="Trade Licence Solutions" width="52" height="52">
    </a>
    <ul class="nav__links" role="list">
      <li><a href="/services">Services</a></li>
      <li><a href="/states">By state</a></li>
      <li><a href="/pricing">Pricing</a></li>
      <li><a href="/about">About Dan</a></li>
      <li><a href="/faq">FAQs</a></li>
      <li><a href="/contact" class="nav__cta">Book a free call</a></li>
    </ul>
    <div class="nav__cta-mobile">
      <a href="tel:+61412767129" class="nav__call-mobile" aria-label="Call Dan">📞 Call</a>
      <a href="/contact" class="btn-book">Book</a>
    </div>
  </nav>
</header>

<div class="trust-bar" role="complementary" aria-label="Key stats">
  <ul class="trust-bar__items">
    <li>500+ licences obtained</li>
    <li>98% first-time approval</li>
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
      <p class="footer-tagline">Australia's most affordable trade licence specialist. Builder licences, company licences and mutual recognition across all 8 states and territories — fast, transparent, done right the first time.</p>
      <p style="margin-top:1rem;font-size:0.85rem;"><a href="tel:+61412767129" style="color:rgba(255,255,255,0.65);text-decoration:none;">📞 0412 767 129</a></p>
    </div>
    <div class="footer-col">
      <h4>Services</h4>
      <ul>
        <li><a href="/company-licence">Company licences</a></li>
        <li><a href="/mutual-recognition">Mutual recognition</a></li>
        <li><a href="/builder-licence">Builder licences</a></li>
        <li><a href="/trade-contractor">Trade contractor</a></li>
        <li><a href="/pricing">Pricing</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>By state</h4>
      <ul>
        <li><a href="/nsw">New South Wales</a></li>
        <li><a href="/qld">Queensland</a></li>
        <li><a href="/vic">Victoria</a></li>
        <li><a href="/act">ACT</a></li>
        <li><a href="/sa">South Australia</a></li>
        <li><a href="/states">All states →</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 Trade Licence Solutions · <a href="/privacy" style="color:rgba(255,255,255,0.4);">Privacy</a></p>
    <p class="footer-credit">Future proofed by <a href="https://maverickdigital.com.ai/future-proofed/" target="_blank" rel="noopener">Maverick Digital</a></p>
  </div>
</footer>

</body>
</html>`;
}
