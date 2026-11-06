export function getCSS() {
  return `
/* ===== TRADE LICENCE SOLUTIONS — MAVERICK DIGITAL BUILD ===== */
/* Brand: Navy #1b3a6b + Orange #f5a623 (from logo) */

:root {
  --white: #ffffff;
  --off-white: #f7f8fa;
  --light-grey: #eaecef;
  --mid-grey: #8c919a;
  --dark-grey: #4a4f5a;
  --near-black: #1a1d23;
  --navy: #1b3a6b;
  --navy-mid: #2a5298;
  --navy-light: #e8eef7;
  --orange: #f5a623;
  --orange-dark: #d4891a;
  --orange-light: #fef3e0;
  --text: #2d3340;
  --font-heading: 'Sora', sans-serif;
  --font-body: 'Inter', sans-serif;
  --radius: 8px;
  --shadow: 0 2px 12px rgba(0,0,0,0.08);
  --shadow-hover: 0 6px 24px rgba(0,0,0,0.14);
  --transition: 0.2s ease;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  color: var(--text);
  background: var(--white);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

/* ===== TYPOGRAPHY ===== */
h1, h2, h3, h4 {
  font-family: var(--font-heading);
  font-weight: 700;
  line-height: 1.2;
  color: var(--near-black);
}
h1 { font-size: clamp(1.8rem, 4vw, 2.8rem); }
h2 { font-size: clamp(1.4rem, 3vw, 2rem); }
h3 { font-size: clamp(1.1rem, 2vw, 1.35rem); }
p { margin-bottom: 1rem; }
p:last-child { margin-bottom: 0; }
a { color: var(--navy); text-decoration: underline; }
a:hover { color: var(--navy-mid); }
ul, ol { padding-left: 1.4rem; margin-bottom: 1rem; }
li { margin-bottom: 0.4rem; }
strong { font-weight: 600; }

/* ===== LAYOUT ===== */
.container { max-width: 1100px; margin: 0 auto; padding: 0 1.25rem; }
.container--narrow { max-width: 760px; margin: 0 auto; padding: 0 1.25rem; }
.section { padding: 4rem 0; }
.section--grey { background: var(--off-white); }
.section--navy { background: var(--navy); color: var(--white); }
.section--navy h2, .section--navy h3 { color: var(--white); }
.section--orange-light { background: var(--orange-light); }

/* ===== HEADER ===== */
.site-header {
  background: var(--white);
  border-bottom: 3px solid var(--orange);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1.25rem;
  max-width: 1100px;
  margin: 0 auto;
}

.nav__logo img {
  height: 52px;
  width: auto;
  display: block;
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav__links a {
  text-decoration: none;
  color: var(--dark-grey);
  font-size: 0.9rem;
  font-weight: 500;
  transition: color var(--transition);
}
.nav__links a:hover { color: var(--navy); }

.nav__links { margin-left: auto; margin-right: 1.25rem; }

.nav__cta {
  background: var(--orange) !important;
  color: var(--near-black) !important;
  padding: 0.5rem 1.1rem;
  border-radius: var(--radius);
  font-weight: 700 !important;
  text-decoration: none !important;
  transition: background var(--transition);
  white-space: nowrap;
}
.nav__cta:hover { background: var(--orange-dark) !important; }

/* Right-side actions: circled call icon + hamburger */
.nav__actions { display: flex; align-items: center; gap: 0.6rem; }
.nav__call {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--orange); color: var(--near-black);
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0; text-decoration: none;
  transition: background var(--transition);
}
.nav__call:hover { background: var(--orange-dark); }
.nav__toggle {
  display: none;
  width: 44px; height: 44px;
  flex-direction: column; align-items: center; justify-content: center;
  gap: 5px; padding: 0; border: 0; background: transparent; cursor: pointer;
}
.nav__toggle-bar {
  width: 24px; height: 2px; background: var(--near-black); border-radius: 2px;
  transition: transform var(--transition), opacity var(--transition);
}

@media (max-width: 760px) {
  .nav__toggle { display: inline-flex; }
  .nav__links {
    position: absolute; top: 100%; left: 0; right: 0;
    flex-direction: column; align-items: stretch; gap: 0;
    margin: 0; padding: 0.4rem 0;
    background: var(--white);
    border-bottom: 3px solid var(--orange);
    box-shadow: var(--shadow);
    max-height: 0; overflow: hidden; visibility: hidden;
    transition: max-height var(--transition), visibility var(--transition);
  }
  .nav--open .nav__links { max-height: 75vh; overflow: auto; visibility: visible; }
  .nav__links li { width: 100%; }
  .nav__links a { display: block; padding: 0.9rem 1.5rem; min-height: 44px; font-size: 1rem; }
  .nav__cta { display: block; margin: 0.5rem 1.5rem; text-align: center; }
  .nav--open .nav__toggle-bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .nav--open .nav__toggle-bar:nth-child(2) { opacity: 0; }
  .nav--open .nav__toggle-bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
}

/* Floating "Ask Dan" -> lead form */
.ask-dan {
  position: fixed; right: 1rem; bottom: 1rem; z-index: 200;
  display: inline-flex; align-items: center; gap: 0.5rem;
  min-height: 48px; padding: 0.7rem 1.1rem; border-radius: 999px;
  background: var(--orange); color: var(--near-black);
  font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem;
  text-decoration: none; box-shadow: var(--shadow-hover);
  transition: background var(--transition), transform var(--transition);
}
.ask-dan:hover { background: var(--orange-dark); transform: translateY(-2px); }
.ph-icon { vertical-align: -3px; margin-right: 0.3rem; }
@media (max-width: 400px) {
  .ask-dan { gap: 0; padding: 0; width: 52px; height: 52px; border-radius: 50%; justify-content: center; }
  .ask-dan span { display: none; }
}
@media print { .ask-dan { display: none; } }

/* ===== TRUST BAR ===== */
.trust-bar {
  background: var(--navy);
  color: rgba(255,255,255,0.9);
  text-align: center;
  padding: 0.9rem 1.25rem;
  font-size: 0.88rem;
}
.trust-bar__items {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  list-style: none;
  padding: 0;
  margin: 0;
  font-weight: 500;
}
.trust-bar__items li::before {
  content: '✓ ';
  color: var(--orange);
  font-weight: 700;
}

/* ===== HERO ===== */
.hero {
  background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%);
  color: var(--white);
  padding: 4.5rem 1.25rem 3.5rem;
  text-align: center;
}
.hero h1 { color: var(--white); margin-bottom: 1rem; }
.hero p { font-size: 1.1rem; color: rgba(255,255,255,0.88); max-width: 640px; margin: 0 auto 1.5rem; }

.hero__badge {
  display: inline-block;
  background: var(--orange);
  color: var(--near-black);
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0.35rem 1.1rem;
  border-radius: 2rem;
  margin-bottom: 1.25rem;
  letter-spacing: 0.01em;
}

.hero__ctas {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.hero__stats {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  flex-wrap: wrap;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.15);
}

.hero__stat-num {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 2rem;
  color: var(--orange);
  line-height: 1;
}
.hero__stat-label {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.7);
  margin-top: 0.3rem;
}

.hero--inner {
  padding: 2.5rem 1.25rem;
  text-align: left;
}
.hero--inner h1 { color: var(--white); }
.hero--inner .breadcrumb { color: rgba(255,255,255,0.6); font-size: 0.85rem; margin-bottom: 0.5rem; }
.hero--inner .breadcrumb a { color: rgba(255,255,255,0.6); text-decoration: none; }

/* ===== BUTTONS ===== */
.btn {
  display: inline-block;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1rem;
  padding: 0.8rem 1.8rem;
  border-radius: var(--radius);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition);
  border: 2px solid transparent;
  text-align: center;
  line-height: 1.3;
}

.btn--primary {
  background: var(--orange);
  color: var(--near-black);
  border-color: var(--orange);
}
.btn--primary:hover {
  background: var(--orange-dark);
  border-color: var(--orange-dark);
  color: var(--near-black);
}

.btn--ghost {
  background: transparent;
  color: var(--white);
  border-color: rgba(255,255,255,0.6);
}
.btn--ghost:hover { border-color: var(--white); }

.btn--navy {
  background: var(--navy);
  color: var(--white);
  border-color: var(--navy);
}
.btn--navy:hover { background: var(--navy-mid); border-color: var(--navy-mid); color: var(--white); }

.btn--call {
  background: var(--white);
  color: var(--navy);
  border-color: var(--white);
}
.btn--call:hover { background: var(--off-white); color: var(--navy); }

.cta-block { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 2rem; }

/* ===== SERVICE CARDS ===== */
.cards {
  display: grid;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.card {
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.75rem;
  transition: box-shadow var(--transition), transform var(--transition);
  display: flex;
  flex-direction: column;
}
.card:hover { box-shadow: var(--shadow-hover); transform: translateY(-2px); }
.card--hero { border-top: 4px solid var(--orange); }

.card__label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--navy-mid);
  margin-bottom: 0.5rem;
}
.card h3 { margin-bottom: 0.75rem; }
.card p { color: var(--dark-grey); flex: 1; }

.card__price {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.4rem;
  color: var(--navy);
  margin: 1rem 0 1.25rem;
}
.card__price span { font-size: 0.8rem; font-weight: 400; color: var(--mid-grey); }

/* ===== STATE GRID ===== */
.state-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}
.state-tile {
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.25rem 1.5rem;
  text-decoration: none;
  color: var(--text);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  transition: box-shadow var(--transition), transform var(--transition);
  border-left: 4px solid var(--navy);
}
.state-tile:hover { box-shadow: var(--shadow-hover); transform: translateY(-2px); color: var(--navy); text-decoration: none; }
.state-tile__name { font-family: var(--font-heading); font-weight: 700; font-size: 1rem; }
.state-tile__detail { font-size: 0.82rem; color: var(--mid-grey); }

/* ===== FAQ ===== */
.faq-list { margin-top: 2rem; }
details { border-bottom: 1px solid var(--light-grey); padding: 1rem 0; }
details:first-child { border-top: 1px solid var(--light-grey); }
summary {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-right: 0.5rem;
}
summary::-webkit-details-marker { display: none; }
summary::after { content: '+'; font-size: 1.4rem; color: var(--orange); flex-shrink: 0; }
details[open] summary::after { content: '−'; }
.faq-answer { padding-top: 0.75rem; color: var(--dark-grey); font-size: 0.95rem; }

/* ===== PRICING ===== */
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}
.pricing-card {
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.pricing-card--featured { border: 2px solid var(--orange); }
.pricing-card__header { background: var(--navy); color: var(--white); padding: 1.5rem; }
.pricing-card--featured .pricing-card__header { background: var(--orange); color: var(--near-black); }
.pricing-card__header h3 { color: inherit; }
.pricing-card__price { font-size: 2rem; font-family: var(--font-heading); font-weight: 700; margin-top: 0.5rem; }
.pricing-card__body { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
.pricing-card__features { list-style: none; padding: 0; margin-bottom: 1.5rem; flex: 1; }
.pricing-card__features li { padding: 0.4rem 0; border-bottom: 1px solid var(--light-grey); font-size: 0.9rem; }
.pricing-card__features li::before { content: '✓ '; color: var(--navy); font-weight: 700; }

/* ===== READINESS CHECK ===== */
.check-form {
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}
.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.95rem; }
.form-group select,
.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="tel"],
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--light-grey);
  border-radius: var(--radius);
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text);
  background: var(--white);
  transition: border-color var(--transition);
}
.form-group select:focus,
.form-group input:focus,
.form-group textarea:focus { outline: none; border-color: var(--navy); }
.form-group textarea { min-height: 120px; resize: vertical; }

/* ===== DAN BIO ===== */
.bio-block {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2.5rem;
  align-items: start;
  margin-top: 2rem;
}
.bio-block__photo img {
  width: 100%;
  border-radius: var(--radius);
  display: block;
}
@media (max-width: 680px) { .bio-block { grid-template-columns: 1fr; } .bio-block__photo { max-width: 240px; } }

/* ===== ALERT / COMPARE ===== */
.alert-box {
  background: var(--orange-light);
  border-left: 4px solid var(--orange);
  border-radius: var(--radius);
  padding: 1rem 1.25rem;
  margin: 1.5rem 0;
  font-size: 0.95rem;
}
.alert-box strong { color: var(--navy); }

.compare-bar {
  background: var(--navy-light);
  border-left: 4px solid var(--navy);
  border-radius: var(--radius);
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  font-size: 0.95rem;
}
.compare-bar strong { color: var(--navy); }

/* ===== CALL BAR ===== */
.call-bar { background: var(--orange); padding: 1.5rem 1.25rem; }
.call-bar__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.call-bar p {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--near-black);
  margin: 0;
}
.call-bar a.btn--call {
  background: var(--navy);
  color: var(--white);
  border-color: var(--navy);
  font-size: 1rem;
  padding: 0.65rem 1.5rem;
}
.call-bar a.btn--call:hover { background: var(--near-black); color: var(--white); }

/* ===== FOOTER ===== */
.site-footer { background: var(--near-black); color: rgba(255,255,255,0.7); padding: 3rem 1.25rem 2rem; }
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto 2rem;
}
@media (max-width: 700px) { .footer-grid { grid-template-columns: 1fr; gap: 1.5rem; } }
.footer-logo img { height: 56px; width: auto; margin-bottom: 1rem; }
.footer-tagline { font-size: 0.85rem; line-height: 1.6; }
.footer-phone { display: inline-flex; align-items: center; gap: 0.6rem; margin-top: 1rem; color: var(--white); text-decoration: none; font-weight: 600; font-size: 0.95rem; }
.footer-phone__icon { width: 36px; height: 36px; border-radius: 50%; background: var(--orange); color: var(--near-black); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.footer-phone:hover span:last-child { color: var(--orange); }
.footer-col h3 { color: var(--white); font-size: 0.82rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 1rem; }
.footer-col ul { list-style: none; padding: 0; margin: 0; }
.footer-col ul li { margin-bottom: 0.1rem; }
.footer-col ul a { display: inline-block; padding: 0.4rem 0; min-height: 24px; color: rgba(255,255,255,0.65); text-decoration: none; font-size: 0.88rem; transition: color var(--transition); }
.footer-col ul a:hover { color: var(--white); }
.footer-bottom {
  max-width: 1100px; margin: 0 auto;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 1.5rem;
  display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;
  font-size: 0.8rem;
}
.footer-credit { color: rgba(255,255,255,0.65); }
.footer-credit a { color: rgba(255,255,255,0.65); text-decoration: none; }
.footer-credit a:hover { color: var(--orange); }

/* ===== UTILITY ===== */
.text-center { text-align: center; }
.text-orange { color: var(--orange); }
.mb-2 { margin-bottom: 2rem; }
.mt-2 { margin-top: 2rem; }

.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--navy-mid);
  margin-bottom: 0.5rem;
}

@media print { .site-header, .call-bar { display: none; } }
/* Audit fixes: skip link, two-column layout, honeypot */
.skip-link { position: absolute; left: -9999px; top: 0; background: var(--navy); color: #fff; padding: 0.5rem 1rem; z-index: 999; }
.skip-link:focus { left: 1rem; top: 1rem; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: stretch; }
@media (max-width: 700px) { .two-col { grid-template-columns: 1fr; gap: 2rem; } }
.hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
  `;
}
