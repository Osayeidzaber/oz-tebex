/* OZ Theme — oz-fx.js
   Add-on modules. Each one reads its switch from window.OZ.fx (set from theme settings)
   and does nothing when switched off. Motion is skipped for prefers-reduced-motion. */
(function () {
  'use strict';
  var OZ = window.OZ || {};
  var fx = OZ.fx || {};
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem('oz-' + k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem('oz-' + k, v); } catch (e) {} }
  };

  /* ---------- Toasts (public: OZ.toast(msg, type)) ---------- */
  var toastWrap = document.createElement('div');
  toastWrap.className = 'oz-toasts';
  toastWrap.setAttribute('role', 'status');
  toastWrap.setAttribute('aria-live', 'polite');
  document.body.appendChild(toastWrap);
  OZ.toast = function (msg, type) {
    var t = document.createElement('div');
    t.className = 'oz-panel oz-toast-pop oz-toast-pop--' + (type || 'info');
    t.textContent = msg;
    toastWrap.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('is-in'); });
    setTimeout(function () { t.classList.remove('is-in'); setTimeout(function () { t.remove(); }, 300); }, 3200);
    sound('pop');
  };
  // Tebex page.message → toast
  $$('[data-oz-message]').forEach(function (el) { OZ.toast(el.getAttribute('data-oz-message'), el.getAttribute('data-oz-message-type')); el.remove(); });

  /* ---------- Page loader: progress bar or loading screen ---------- */
  var bar = $('.oz-progress');
  function barTo(p) { if (bar) bar.style.transform = 'scaleX(' + p + ')'; }
  if (bar && fx.loader !== 'off') {
    barTo(0.6);
    window.addEventListener('load', function () { barTo(1); setTimeout(function () { bar.classList.add('is-done'); }, 250); });
  }
  var screen = $('.oz-loading');
  if (screen) window.addEventListener('load', function () { screen.classList.add('is-done'); setTimeout(function () { screen.remove(); }, 500); });

  /* ---------- Smooth page transitions (internal links) ---------- */
  if (fx.transitions && !reduce) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || a.hasAttribute('data-oz-popup') || a.hasAttribute('data-oz-add') || /^(https?:)?\/\//.test(href) && a.host !== location.host) return;
      e.preventDefault();
      document.documentElement.classList.add('oz-leaving');
      if (bar) { bar.classList.remove('is-done'); barTo(0.3); }
      setTimeout(function () { location.href = a.href; }, 180);
    });
    window.addEventListener('pageshow', function () { document.documentElement.classList.remove('oz-leaving'); });
  }

  /* ---------- Sticky header ---------- */
  if (fx.stickyHeader) {
    var sticky = $('.oz-sticky');
    if (sticky) {
      var hero = $('.oz-hero');
      var onScroll = function () { sticky.classList.toggle('is-on', window.scrollY > (hero ? hero.offsetHeight - 40 : 300)); };
      window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    }
  }

  /* ---------- Back to top ---------- */
  var top = $('.oz-totop');
  if (top) {
    window.addEventListener('scroll', function () { top.classList.toggle('is-on', window.scrollY > 900); }, { passive: true });
    top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  }

  /* ---------- Scroll reveal ---------- */
  if (fx.reveal && !reduce && 'IntersectionObserver' in window) {
    var targets = $$('.oz-content > *, .oz-sidebar > *, .oz-pkg, .oz-cat, .oz-row, .oz-ranks, .oz-preview');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el, i) { el.classList.add('oz-reveal'); el.style.transitionDelay = Math.min(i % 6, 5) * 50 + 'ms'; io.observe(el); });
  }

  /* ---------- Card 3D tilt + shine ---------- */
  if ((fx.tilt || fx.shine) && !reduce && window.matchMedia('(hover: hover)').matches) {
    $$('.oz-pkg, .oz-cat').forEach(function (card) {
      if (fx.shine) card.classList.add('oz-shine');
      if (!fx.tilt) return;
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(800px) rotateX(' + (-y * 7) + 'deg) rotateY(' + (x * 9) + 'deg) translateY(-4px)';
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------- Fly-to-cart + badge bounce ---------- */
  var cartBtn = $('.oz-topbar__right [data-oz-open="basket"]');
  OZ.flyToCart = function (fromEl) {
    if (!fx.flyToCart || reduce || !cartBtn || !fromEl) return;
    var src = fromEl.closest('.oz-pkg, .oz-product, .oz-mod');
    var img = src && src.querySelector('img, .oz-ico');
    if (!img) return;
    var a = img.getBoundingClientRect(), b = cartBtn.getBoundingClientRect();
    var ghost = img.cloneNode(true);
    ghost.className += ' oz-fly';
    ghost.style.cssText += ';left:' + a.left + 'px;top:' + a.top + 'px;width:' + a.width + 'px;height:' + a.height + 'px';
    document.body.appendChild(ghost);
    requestAnimationFrame(function () {
      ghost.style.transform = 'translate(' + (b.left + b.width / 2 - a.left - a.width / 2) + 'px,' + (b.top + b.height / 2 - a.top - a.height / 2) + 'px) scale(.15)';
      ghost.style.opacity = '.4';
    });
    setTimeout(function () { ghost.remove(); cartBtn.classList.add('oz-bounce'); setTimeout(function () { cartBtn.classList.remove('oz-bounce'); }, 500); }, 650);
  };
  document.addEventListener('click', function (e) {
    var add = e.target.closest('a[href*="/checkout/packages/add/"]');
    if (!add) return;
    OZ.flyToCart(add);
    if (fx.confetti === 'add') OZ.confetti(add);
    add.classList.add('is-loading');
    // Give the animation a moment before Tebex navigates
    if (!add.hasAttribute('data-oz-n') && fx.flyToCart && !reduce) { e.preventDefault(); setTimeout(function () { location.href = add.href; }, 450); }
  });

  /* ---------- Confetti (public: OZ.confetti(fromEl)) ---------- */
  OZ.confetti = function (fromEl) {
    if (reduce) return;
    var c = document.createElement('canvas'); c.className = 'oz-confetti';
    c.width = innerWidth; c.height = innerHeight; document.body.appendChild(c);
    var ctx = c.getContext('2d');
    var r = fromEl ? fromEl.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    var css = getComputedStyle(document.documentElement);
    var colors = [css.getPropertyValue('--a'), css.getPropertyValue('--b'), '#fff', '#F2C94C'];
    var parts = [];
    for (var i = 0; i < 90; i++) parts.push({ x: r.left + r.width / 2, y: r.top + r.height / 2, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, s: 4 + Math.random() * 5, c: colors[i % 4].trim() || '#fff', life: 0 });
    (function frame() {
      ctx.clearRect(0, 0, c.width, c.height);
      var alive = 0;
      parts.forEach(function (p) {
        p.vy += 0.45; p.x += p.vx; p.y += p.vy; p.life++;
        if (p.y < c.height + 20 && p.life < 160) { alive++; ctx.fillStyle = p.c; ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s); }
      });
      if (alive) requestAnimationFrame(frame); else c.remove();
    })();
  };

  /* ---------- Hero particles: snow / fireflies / embers ---------- */
  var kind = fx.particles;
  if (kind === 'auto') { var m = new Date().getMonth(); kind = (m === 11 || m === 0) ? 'snow' : (m === 9 ? 'embers' : 'off'); }
  var heroEl = $('.oz-hero');
  if (kind && kind !== 'off' && heroEl && !reduce) {
    var pc = document.createElement('canvas'); pc.className = 'oz-particles'; pc.setAttribute('aria-hidden', 'true');
    heroEl.insertBefore(pc, heroEl.firstChild);
    var pctx = pc.getContext('2d'), P = [], W, H;
    var resize = function () { W = pc.width = heroEl.offsetWidth; H = pc.height = heroEl.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    var cfg = { snow: ['#ffffff', 1, 0.6], fireflies: ['#D4FF3A', -0.15, 0.3], embers: ['#FF8A3D', -0.8, 0.5] }[kind] || ['#fff', 1, 0.6];
    for (var k = 0; k < 70; k++) P.push({ x: Math.random() * W, y: Math.random() * H, s: Math.random() < .3 ? 4 : 2, v: (0.3 + Math.random()) * cfg[1], d: Math.random() * 6 });
    (function loop(t) {
      pctx.clearRect(0, 0, W, H); pctx.fillStyle = cfg[0];
      P.forEach(function (p) {
        p.y += p.v; p.x += Math.sin((t / 1000) + p.d) * cfg[2];
        if (p.y > H) p.y = -4; if (p.y < -4) p.y = H;
        pctx.globalAlpha = kind === 'fireflies' ? 0.4 + 0.6 * Math.abs(Math.sin(t / 600 + p.d)) : 0.85;
        pctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
      });
      requestAnimationFrame(loop);
    })(0);
  }

  /* ---------- Parallax hero ---------- */
  if (fx.parallax && heroEl && !reduce) {
    var hills = $('.oz-hero__hills', heroEl), logo = $('.oz-logo', heroEl);
    window.addEventListener('scroll', function () {
      var y = Math.min(window.scrollY, 600);
      if (hills) hills.style.transform = 'translateY(' + y * 0.15 + 'px)';
      if (logo) logo.style.transform = 'translateY(' + y * 0.3 + 'px)';
    }, { passive: true });
  }

  /* ---------- Count-up numbers ---------- */
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return; cio.unobserve(e.target);
        var el = e.target, end = parseFloat(el.getAttribute('data-oz-count')) || 0, t0 = performance.now(), dur = reduce ? 0 : 900;
        (function step(t) { var p = dur ? Math.min(1, (t - t0) / dur) : 1; el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString(); if (p < 1) requestAnimationFrame(step); })(t0);
      });
    });
    $$('[data-oz-count]').forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Dismissible announcement ---------- */
  var ann = $('.oz-announce[data-oz-dismiss]');
  if (ann) {
    var key = 'ann-' + ann.getAttribute('data-oz-dismiss');
    if (store.get(key)) ann.remove();
    else { var x = $('.oz-announce__close', ann); if (x) x.addEventListener('click', function () { store.set(key, '1'); ann.classList.add('is-gone'); setTimeout(function () { ann.remove(); }, 300); }); }
  }

  /* ---------- Search (/, Ctrl+K) over categories + packages on this page ---------- */
  var sModal = $('#oz-search');
  if (sModal) {
    var sInput = $('input', sModal), sList = $('[data-oz-search-results]', sModal);
    var items = $$('[data-oz-search-item]').map(function (a) { return { name: a.getAttribute('data-oz-search-item'), href: a.getAttribute('href'), kind: a.getAttribute('data-oz-search-kind') || '' }; });
    $$('.oz-pkg__name a').forEach(function (a) { items.push({ name: a.textContent.trim(), href: a.getAttribute('href'), kind: 'Package' }); });
    var openS = function () { sModal.classList.add('is-open'); sInput.value = ''; render(''); setTimeout(function () { sInput.focus(); }, 30); };
    var closeS = function () { sModal.classList.remove('is-open'); };
    var render = function (q) {
      q = q.toLowerCase();
      var hits = items.filter(function (i) { return !q || i.name.toLowerCase().indexOf(q) !== -1; }).slice(0, 8);
      sList.innerHTML = '';
      hits.forEach(function (h, i) {
        var a = document.createElement('a'); a.href = h.href; a.className = i === 0 ? 'is-sel' : '';
        var n = document.createElement('span'); n.textContent = h.name; var k = document.createElement('small'); k.textContent = h.kind;
        a.appendChild(n); a.appendChild(k); sList.appendChild(a);
      });
      if (!hits.length) { var e = document.createElement('p'); e.className = 'oz-muted'; e.textContent = OZ.noResults || 'No results'; sList.appendChild(e); }
    };
    sInput.addEventListener('input', function () { render(sInput.value); });
    sInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var f = $('a', sList); if (f) location.href = f.href; } });
    $$('[data-oz-search-open]').forEach(function (b) { b.addEventListener('click', openS); });
    sModal.addEventListener('click', function (e) { if (e.target === sModal) closeS(); });
    document.addEventListener('keydown', function (e) {
      var typing = /input|textarea|select/i.test((document.activeElement || {}).tagName || '');
      if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); openS(); }
      if (e.key === 'Escape') closeS();
    });
  }

  /* ---------- Category tools: sort / filter ---------- */
  var tools = $('[data-oz-cat-tools]');
  if (tools) {
    var grid = $('.oz-packages') || $('.oz-list');
    var cards = grid ? $$(':scope > *', grid) : [];
    cards.forEach(function (c, i) { c.dataset.ozIndex = i; });
    var apply = function () {
      var q = ($('[data-oz-filter]', tools) || {}).value || '';
      var sort = ($('[data-oz-sort]', tools) || {}).value || 'default';
      var price = function (c) { var p = c.querySelector('[data-oz-price]'); return p ? parseFloat(p.getAttribute('data-oz-price')) : 0; };
      var shown = 0;
      cards.slice().sort(function (a, b) {
        if (sort === 'price-asc') return price(a) - price(b);
        if (sort === 'price-desc') return price(b) - price(a);
        if (sort === 'name') return a.textContent.trim().localeCompare(b.textContent.trim());
        return a.dataset.ozIndex - b.dataset.ozIndex;
      }).forEach(function (c) {
        var match = c.textContent.toLowerCase().indexOf(q.toLowerCase()) !== -1;
        c.hidden = !match; if (match) shown++; grid.appendChild(c);
      });
      var cnt = $('[data-oz-count-shown]', tools); if (cnt) cnt.textContent = shown;
    };
    tools.addEventListener('input', apply); tools.addEventListener('change', apply);
  }

  /* ---------- Image skeletons ---------- */
  $$('img[loading="lazy"]').forEach(function (img) {
    if (img.complete) return;
    var holder = img.parentElement; holder.classList.add('oz-skeleton');
    var done = function () { holder.classList.remove('oz-skeleton'); };
    img.addEventListener('load', done); img.addEventListener('error', done);
  });

  /* ---------- Live purchase popups (real data from the Recent payments module) ---------- */
  if (fx.socialPopups && !reduce) {
    var buys = $$('.oz-sidebar [data-oz-payment]').map(function (el) { return el.getAttribute('data-oz-payment'); });
    if (buys.length) {
      var idx = 0;
      setTimeout(function next() {
        if (document.hidden) { setTimeout(next, 8000); return; }
        OZ.toast(buys[idx++ % buys.length], 'buy');
        if (idx < buys.length * 2) setTimeout(next, 14000);
      }, 6000);
    }
  }

  /* ---------- Sounds (off by default; mute toggle remembered) ---------- */
  var ctxA;
  function sound(type) {
    if (!fx.sounds || store.get('mute') === '1') return;
    try {
      ctxA = ctxA || new (window.AudioContext || window.webkitAudioContext)();
      var o = ctxA.createOscillator(), g = ctxA.createGain();
      o.type = 'square'; o.frequency.value = type === 'pop' ? 660 : 440;
      g.gain.setValueAtTime(0.04, ctxA.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, ctxA.currentTime + 0.08);
      o.connect(g); g.connect(ctxA.destination); o.start(); o.stop(ctxA.currentTime + 0.09);
    } catch (e) {}
  }
  if (fx.sounds) {
    document.addEventListener('click', function (e) { if (e.target.closest('.oz-btn, .oz-hb, .oz-cat')) sound('click'); });
    var mute = $('[data-oz-mute]');
    if (mute) {
      var paint = function () { mute.setAttribute('aria-pressed', String(store.get('mute') === '1')); };
      mute.hidden = false; paint();
      mute.addEventListener('click', function () { store.set('mute', store.get('mute') === '1' ? '0' : '1'); paint(); });
    }
  }

  /* ---------- Sticky buy bar (package page) ---------- */
  var buy = $('.oz-buybox'), sbar = $('.oz-buybar');
  if (buy && sbar && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { sbar.classList.toggle('is-on', !en[0].isIntersecting && en[0].boundingClientRect.top < 0); }).observe(buy);
  }

  /* ---------- Free-gift progress in basket ---------- */
  $$('[data-oz-goal]').forEach(function (el) {
    var goal = parseFloat(el.getAttribute('data-oz-goal')), have = parseFloat(el.getAttribute('data-oz-have')) || 0;
    var fill = $('.oz-xp__fill', el); if (fill) fill.style.width = Math.min(100, have / goal * 100) + '%';
  });

  window.OZ = OZ;
})();
