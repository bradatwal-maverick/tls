// Anonymous visit tracking, first party (see src/intent.js). No names, phone numbers, emails or IP addresses.
(function () {
  function visitorId() {
    try {
      var m = document.cookie.match(/(?:^|; )tls_vid=([A-Za-z0-9-]{8,64})/);
      if (m) return m[1];
      var id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : (Date.now().toString(36) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2));
      document.cookie = 'tls_vid=' + id + '; Path=/; Max-Age=31536000; Secure; SameSite=Lax';
      return id;
    } catch (e) { return null; }
  }

  var vid = visitorId();
  if (!vid || navigator.webdriver) return;

  // Adverts and campaign details arrive on the landing page only
  function campaign() {
    var out = {};
    try {
      var p = new URLSearchParams(location.search);
      ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) { var v = p.get(k); if (v) out[k] = v.slice(0, 100); });
      if (p.get('gclid')) out.gclid = '1';
    } catch (e) {}
    return out;
  }

  function send(type, detail) {
    var isView = type === 'pageview';
    var body = JSON.stringify({
      v: vid,
      t: type,
      p: location.pathname.slice(0, 200),
      d: detail || {},
      r: isView ? (document.referrer || '').slice(0, 300) : '',
      q: isView ? campaign() : {}
    });
    try {
      if (navigator.sendBeacon && navigator.sendBeacon('/track', new Blob([body], { type: 'text/plain' }))) return;
    } catch (e) {}
    try { fetch('/track', { method: 'POST', body: body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(function () {}); } catch (e) {}
  }

  // Used by the eligibility tool (public/tool.js)
  window.trackIntent = function (type, detail) { send(type, detail); };

  send('pageview');

  // Enquiry form sent: record the page it was sent from (a hidden "page" field, path only)
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || f.getAttribute('action') !== '/contact-submitted') return;
    var h = f.querySelector('input[name="page"]');
    if (!h) { h = document.createElement('input'); h.type = 'hidden'; h.name = 'page'; f.appendChild(h); }
    h.value = location.pathname.slice(0, 200);
  }, true);

  // Contact form started: the first field the visitor touches
  document.addEventListener('focusin', function (e) {
    var f = e.target && e.target.form;
    if (!f || f.getAttribute('action') !== '/contact-submitted' || f.getAttribute('data-intent-started')) return;
    f.setAttribute('data-intent-started', '1');
    send('form_start', {});
  });
})();
