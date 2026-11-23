/* OZ Theme — oz-motion.js: block-wipe page transitions, loading states, offline notice.
   Reads switches from window.OZ.fx (set in layout.html). Every effect respects
   prefers-reduced-motion and leaves a working page if it fails. */
(function () {
  'use strict';
  var OZ = window.OZ || {}, fx = OZ.fx || {};
  var html = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var session = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { if (v) sessionStorage.setItem(k, v); else sessionStorage.removeItem(k); } catch (e) {} }
  };
  var toast = function (msg, type) { if (OZ.toast) OZ.toast(msg, type); };

  /* ---------- Block wipe: pixel tiles cover the screen, then uncover on the next page ---------- */
  var TILE = 72, STEP = 16;           // tile size (px) and delay per diagonal step (ms)
  function buildWipe(covered) {
    var old = $('.oz-wipe'); if (old) old.remove();
    var cols = Math.ceil(innerWidth / TILE), rows = Math.ceil(innerHeight / TILE);
    var w = document.createElement('div');
    w.className = 'oz-wipe' + (covered ? ' is-cover is-instant' : '');
    w.setAttribute('aria-hidden', 'true');
    w.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
    w.style.gridTemplateRows = 'repeat(' + rows + ', 1fr)';
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
      var t = document.createElement('i');
      t.style.transitionDelay = (x + y) * STEP + 'ms';
      w.appendChild(t);
    }
    document.body.appendChild(w);
    w.offsetWidth;                    // commit the start state before transitioning
    w.classList.remove('is-instant');
    return { el: w, total: (cols + rows) * STEP + 220 };
  }

  var useWipe = fx.transitions && fx.transitionStyle === 'blocks' && !reduce;

  // Arriving: start covered, then uncover from the top-left.
  if (html.classList.contains('oz-arriving')) {
    session.set('oz-wipe', '');
    if (useWipe) {
      var arr = buildWipe(true);
      html.classList.remove('oz-arriving');
      requestAnimationFrame(function () {
        arr.el.classList.remove('is-cover');
        setTimeout(function () { arr.el.remove(); }, arr.total);
      });
    } else html.classList.remove('oz-arriving');
  }

  if (useWipe) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-oz-popup') || a.hasAttribute('data-oz-add')) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(mailto|tel|javascript):/i.test(href) || a.host !== location.host) return;
      if (a.pathname === location.pathname && a.search === location.search && a.hash) return;   // same-page anchor
      e.preventDefault();
      var wipe = buildWipe(false);
      requestAnimationFrame(function () { wipe.el.classList.add('is-cover'); });
      session.set('oz-wipe', '1');
      setTimeout(function () { location.href = a.href; }, Math.min(wipe.total, 650));
    });
  }

  // Back/forward cache: never come back to a covered or spinning page.
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    var w = $('.oz-wipe'); if (w) w.remove();
    html.classList.remove('oz-arriving');
    session.set('oz-wipe', '');
    $$('.is-loading').forEach(function (el) { el.classList.remove('is-loading'); });
    $$('.is-busy').forEach(function (el) { el.classList.remove('is-busy'); });
  });

  /* ---------- Loading states ---------- */
  if (fx.loadingStates !== false) {
    function busy(el) { if (el) { el.classList.add('is-loading'); el.setAttribute('aria-busy', 'true'); } }

    // Any normal form submit: spin the button that submitted it.
    document.addEventListener('submit', function (e) {
      var form = e.target;
      setTimeout(function () {                    // let other handlers cancel first
        if (e.defaultPrevented || form.hasAttribute('data-oz-no-loading')) return;
        busy(e.submitter || $('button[type="submit"], button:not([type]), input[type="submit"]', form));
      }, 0);
    });

    // Links that hit Tebex and reload: remove from basket, go to checkout, log out.
    // Capture phase: runs before the page-transition handler, which cancels the click to animate.
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href*="/checkout/packages/remove/"], a[href$="/checkout/basket"].oz-btn, a[href$="/logout"], a[href^="/currency/"]');
      if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      var line = a.closest('.oz-line, tr');
      if (line && /remove/.test(a.href)) line.classList.add('is-busy');
      busy(a.classList.contains('oz-btn') ? a : null);
    }, true);

    // Currency switch reloads the store: dim the basket while it does.
    $$('[data-oz-currency]').forEach(function (sel) {
      sel.addEventListener('change', function () { var d = sel.closest('.oz-drawer'); if (d) d.classList.add('is-busy'); });
    });

    // Slider media + embedded videos: skeleton until loaded.
    $$('.oz-slider__media, .oz-preview iframe, .oz-person img').forEach(function (m) {
      if (m.tagName === 'IMG' && m.complete && m.naturalWidth) return;
      var holder = m.closest('.oz-slider__slide, .oz-person') || m.parentElement;
      holder.classList.add('oz-skeleton');
      var done = function () { holder.classList.remove('oz-skeleton'); m.classList.add('is-loaded'); };
      m.addEventListener('load', done); m.addEventListener('error', done);
      setTimeout(done, 8000);                     // never shimmer forever
    });
  }

  /* ---------- Offline / back online ---------- */
  window.addEventListener('offline', function () {
    html.classList.add('is-offline');
    toast(OZ.offlineMsg || 'You are offline. Purchases will wait until you reconnect.', 'error');
  });
  window.addEventListener('online', function () {
    html.classList.remove('is-offline');
    toast(OZ.onlineMsg || 'Back online.', 'success');
  });
})();
