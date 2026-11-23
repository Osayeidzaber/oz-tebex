/* OZ Theme — oz-checkout.js
   Opens Tebex's secure checkout (Tebex.js) for the current basket.
   States: idle | blocked (terms) | loading | open | success | error | needs-login | empty */
(function () {
  'use strict';
  var root = document.querySelector('[data-oz-checkout]');
  if (!root) return;
  var OZ = window.OZ || {};
  var btn = root.querySelector('[data-oz-pay]');
  var label = btn && btn.querySelector('[data-oz-pay-label]');
  var msg = root.querySelector('[data-oz-pay-msg]');
  var terms = Array.prototype.slice.call(root.querySelectorAll('[data-oz-terms] input[type=checkbox]'));
  var TEBEX = 'https://js.tebex.io/v/1.js';
  var texts = OZ.checkoutText || {};
  var original = label ? label.textContent : '';

  function state(s, text) {
    root.setAttribute('data-oz-state', s);
    if (btn) {
      btn.disabled = s === 'loading' || s === 'open' || s === 'blocked' || s === 'empty' || s === 'success';
      btn.classList.toggle('is-loading', s === 'loading' || s === 'open');
    }
    if (label) label.textContent = text || original;
  }
  function note(text, type) {
    if (!msg) return;
    msg.textContent = text || '';
    msg.hidden = !text;
    msg.className = 'oz-pay-msg' + (type ? ' oz-pay-msg--' + type : '');
  }

  function termsOk() { return terms.every(function (c) { return c.checked; }); }
  function refresh() {
    if (root.getAttribute('data-oz-empty') === 'true') { state('empty'); return; }
    if (!termsOk()) { state('blocked'); note(texts.terms || 'Tick the boxes above to continue.'); return; }
    state('idle'); note('');
  }
  terms.forEach(function (c) { c.addEventListener('change', refresh); });
  refresh();

  var libPromise;
  function loadTebex() {
    if (window.Tebex) return Promise.resolve(window.Tebex);
    if (libPromise) return libPromise;
    libPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script'); s.src = TEBEX; s.defer = true;
      s.onload = function () { window.Tebex ? resolve(window.Tebex) : reject(new Error('missing')); };
      s.onerror = function () { libPromise = null; reject(new Error('blocked')); };
      document.head.appendChild(s);
      setTimeout(function () { libPromise = null; reject(new Error('timeout')); }, 10000);
    });
    return libPromise;
  }
  function getIdent() {
    var ident = root.getAttribute('data-oz-ident');
    if (ident) return Promise.resolve(ident);
    return fetch('/checkout/ident', { credentials: 'same-origin', headers: { Accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : { ident: null }; })
      .then(function (d) { return d && d.ident && d.ident !== 'null' ? d.ident : null; });
  }
  // Warm up the library while the player reads the page
  if (btn) btn.addEventListener('pointerenter', function () { loadTebex().catch(function () {}); }, { once: true });

  if (btn) btn.addEventListener('click', function () {
    if (!termsOk()) { refresh(); return; }
    state('loading', texts.loading || 'Preparing secure checkout…'); note('');
    Promise.all([loadTebex(), getIdent()]).then(function (res) {
      var Tebex = res[0], ident = res[1];
      if (!ident) {
        state('idle'); note(texts.login || 'Log in with your username before paying.', 'warn');
        var login = root.querySelector('[data-oz-login-link]'); if (login) login.hidden = false;
        return;
      }
      var css = getComputedStyle(document.documentElement);
      Tebex.checkout.init({
        ident: ident,
        theme: root.getAttribute('data-oz-theme') || 'auto',
        locale: root.getAttribute('data-oz-locale') || undefined,
        colors: [
          { name: 'primary', color: css.getPropertyValue('--a').trim() || '#D4FF3A' },
          { name: 'secondary', color: css.getPropertyValue('--b').trim() || '#B9A6FF' }
        ],
        closeOnPaymentComplete: true
      });
      Tebex.checkout.on('open', function () { state('open', texts.open || 'Checkout open…'); });
      Tebex.checkout.on('close', function () { if (root.getAttribute('data-oz-state') !== 'success') refresh(); });
      Tebex.checkout.on('payment:complete', function () {
        state('success', texts.done || 'Payment complete!');
        note(texts.doneNote || 'Thanks! Your items arrive in-game within a few minutes.', 'ok');
        if (OZ.confetti && root.getAttribute('data-oz-confetti') !== 'off') OZ.confetti(btn);
        var redirect = root.getAttribute('data-oz-redirect');
        if (redirect) setTimeout(function () { location.href = redirect; }, 3500);
      });
      Tebex.checkout.on('payment:error', function () {
        refresh(); note(texts.error || 'Payment failed — nothing was charged. Please try again.', 'error');
        if (OZ.toast) OZ.toast(texts.error || 'Payment failed', 'error');
      });
      Tebex.checkout.launch();
    }).catch(function () {
      refresh();
      note(texts.blocked || 'Secure checkout could not load. Disable ad-blockers for this site and try again.', 'error');
    });
  });
})();
