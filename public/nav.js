// Mobile menu: open/close, close on link tap, outside tap or Escape, and the sub-menu toggles.
// Kept in its own file (not inline) so the site's Content Security Policy can block inline scripts.
(function () {
  var nav = document.querySelector('.nav');
  var check = document.getElementById('nav-check');
  if (!nav || !check) return;
  function setOpen(open) {
    check.checked = open;
    check.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  check.addEventListener('change', function () { setOpen(check.checked); });
  nav.querySelectorAll('.nav__links a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });
  document.addEventListener('click', function (e) {
    if (check.checked && !nav.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && check.checked) { setOpen(false); check.focus(); }
  });
  nav.querySelectorAll('.nav__sub-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.nav__item--has-sub');
      var open = item.classList.toggle('nav__item--open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();
