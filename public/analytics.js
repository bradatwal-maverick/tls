// GA4 — Trade Licence Solutions
// TODO Brad: replace the ID below with TLS's own GA4 Measurement ID (not Maverick Digital's),
// then every page on the site starts sending data and the events below go live automatically.
(function () {
  var GA4_ID = 'G-XXXXXXXXXX';
  var ready = GA4_ID && GA4_ID.indexOf('XXXX') === -1;

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  // Safe to call on every page, even before the ID is set — it just does nothing until then.
  window.trackEvent = function (name, params) {
    if (!ready) return;
    gtag('event', name, params || {});
  };

  if (!ready) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', GA4_ID);

  // High-intent clicks, site-wide: calling Dan, or heading to the booking page.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) {
      trackEvent('phone_click', { link_text: (a.textContent || '').trim(), page_path: location.pathname });
    } else if (href === '/contact' || href.indexOf('/contact?') === 0) {
      trackEvent('book_call_click', { link_text: (a.textContent || '').trim(), page_path: location.pathname });
    }
  });
})();
