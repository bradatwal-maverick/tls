// GA4 — Trade Licence Solutions
(function () {
  var GA4_ID = 'G-EE5GWQWLK8';
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

  // Contact page: prefill state/licence from the query string, if those fields are on the page.
  try {
    var p = new URLSearchParams(location.search);
    var s = p.get('state'), l = p.get('licence');
    var stateEl = document.getElementById('c_state');
    var licenceEl = document.getElementById('c_licence');
    if (s && stateEl) stateEl.value = s;
    if (l && licenceEl) licenceEl.value = l;
  } catch (e) {}
})();
