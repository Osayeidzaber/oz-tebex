/* OZ Theme — oz-extras.js: homepage slider, discount pop-up, currency picker.
   Each block is independent and leaves a usable page if it fails. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Slider (scroll-snap track; buttons, dots, autoplay, swipe for free) ---------- */
  $$('[data-oz-slider]').forEach(function (root) {
    var track = $('.oz-slider__track', root), slides = $$('.oz-slider__slide', root), dots = $$('[data-oz-slide-to]', root);
    if (!track || slides.length < 2) return;
    var idx = 0, timer, delay = (parseFloat(root.getAttribute('data-oz-autoplay')) || 0) * 1000;

    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.scrollTo({ left: slides[idx].offsetLeft, behavior: reduced ? 'auto' : 'smooth' });
    }
    function mark() {
      idx = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach(function (d, i) { d.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
    }
    function play() {
      clearInterval(timer);
      if (delay && !reduced) timer = setInterval(function () { go(idx + 1); }, delay);
    }

    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-oz-slide],[data-oz-slide-to]'); if (!b) return;
      if (b.hasAttribute('data-oz-slide')) go(idx + parseInt(b.getAttribute('data-oz-slide'), 10));
      else go(parseInt(b.getAttribute('data-oz-slide-to'), 10));
      play();
    });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(idx - 1); play(); }
      if (e.key === 'ArrowRight') { go(idx + 1); play(); }
    });
    var t; track.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(mark, 60); }, { passive: true });
    root.addEventListener('mouseenter', function () { clearInterval(timer); });
    root.addEventListener('mouseleave', play);
    root.addEventListener('focusin', function () { clearInterval(timer); });
    mark(); play();
  });

  /* ---------- Discount pop-up: once per code per visitor ---------- */
  var promo = $('[data-oz-promo]');
  if (promo) {
    var key = 'oz-promo:' + promo.getAttribute('data-oz-promo');
    if (!store.get(key)) {
      var lastFocus;
      var close = function () {
        promo.classList.remove('is-open');
        store.set(key, '1');
        document.removeEventListener('keydown', onKey);
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      };
      var onKey = function (e) { if (e.key === 'Escape') close(); };
      setTimeout(function () {
        // Don't interrupt a player who is already in a dialog or the basket.
        if ($('.oz-modal.is-open, .oz-drawer.is-open, .oz-search.is-open')) return;
        lastFocus = document.activeElement;
        promo.classList.add('is-open');
        document.addEventListener('keydown', onKey);
        var f = $('.oz-promo__code, [data-oz-promo-close]', promo); if (f) f.focus();
      }, (parseFloat(promo.getAttribute('data-oz-promo-delay')) || 0) * 1000);
      promo.addEventListener('click', function (e) {
        if (e.target === promo || e.target.closest('[data-oz-promo-close]')) close();
      });
    }
  }

  /* ---------- Currency picker (basket drawer) ---------- */
  $$('[data-oz-currency]').forEach(function (sel) {
    sel.addEventListener('change', function () {
      sel.disabled = true;
      location.href = '/currency/' + encodeURIComponent(sel.value) + '?redirect=' + encodeURIComponent(location.pathname);
    });
  });
})();
