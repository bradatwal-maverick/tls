// Standard call-to-action block: Apply now, Book a call, Check eligibility (alphabetical).
// Same markup on every landing page. The CSS is also in public/cta.css for the static pages.
export const CTA_CSS = `
.cta-standard{padding:32px 0;background:#eef3f8;color:#0b1f33}
.cta-standard__grid{display:grid;gap:18px;grid-template-columns:1fr}
@media (min-width:720px){.cta-standard__grid{grid-template-columns:repeat(3,1fr)}}
.cta-item{display:grid;gap:8px;align-content:start;justify-items:stretch}
.cta-item p{margin:0;font-size:.95rem;color:#24384f}
.cta-btn{display:flex;align-items:center;justify-content:center;min-height:48px;padding:0 1.2em;border-radius:6px;border:2px solid transparent;font-weight:700;text-decoration:none;text-align:center}
.cta-btn--apply{background:#ffb000;color:#0b1f33}
.cta-btn--call{background:#0b1f33;color:#fff}
.cta-btn--check{background:#fff;color:#0b1f33;border-color:#0b1f33}
.cta-btn:focus-visible{outline:3px solid #0b1f33;outline-offset:2px}
`;

export const CTA_HTML = `
<section class="cta-standard" aria-label="Next steps">
  <div class="wrap">
    <div class="cta-standard__grid">
      <div class="cta-item">
        <a class="cta-btn cta-btn--apply" href="/apply" onclick="if(window.trackEvent){trackEvent('apply_now_click',{step:'cta'})}if(window.trackIntent){trackIntent('cta_click',{step:'cta_apply'})}">Apply now</a>
        <p>Apply now if you're ready.</p>
      </div>
      <div class="cta-item">
        <a class="cta-btn cta-btn--call" href="/contact" onclick="if(window.trackEvent){trackEvent('cta_click',{cta:'call'})}if(window.trackIntent){trackIntent('cta_click',{step:'cta_call'})}">Book a call</a>
        <p>Free 15-minute call with Dan.</p>
      </div>
      <div class="cta-item">
        <a class="cta-btn cta-btn--check" href="/check-eligibility" onclick="if(window.trackEvent){trackEvent('cta_click',{cta:'eligibility'})}if(window.trackIntent){trackIntent('cta_click',{step:'cta_eligibility'})}">Check eligibility</a>
        <p>Eligibility check takes 30 seconds.</p>
      </div>
    </div>
  </div>
</section>
`;

export function ctaBlock() {
  return CTA_HTML;
}
