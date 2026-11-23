/* OZ Theme — oz.js (no dependencies) */
(function () {
  'use strict';
  var cfg = window.OZ || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Small toast ---------- */
  var popEl = $('[data-oz-pop]'), popTimer;
  function pop(msg) {
    if (!popEl) return;
    popEl.textContent = msg;
    popEl.classList.add('is-on');
    clearTimeout(popTimer);
    popTimer = setTimeout(function () { popEl.classList.remove('is-on'); }, 1800);
  }

  /* ---------- Drawer + modal ---------- */
  var drawer = $('#oz-basket'), scrim = $('.oz-scrim'), modal = $('#oz-modal'), lastFocus;
  function openBasket() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add('is-open'); scrim.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    var f = drawer.querySelector('button, a'); if (f) f.focus();
  }
  function closeBasket() {
    if (!drawer) return;
    drawer.classList.remove('is-open'); scrim.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (lastFocus) lastFocus.focus();
  }
  function closeModal() { if (modal) { modal.classList.remove('is-open'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); } }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-oz-open],[data-oz-close],[data-oz-copy],[data-oz-popup],[data-oz-mode-toggle]');
    if (!t) return;
    if (t.hasAttribute('data-oz-open')) { e.preventDefault(); openBasket(); }
    else if (t.hasAttribute('data-oz-close')) { e.preventDefault(); t.getAttribute('data-oz-close') === 'modal' ? closeModal() : closeBasket(); }
    else if (t.hasAttribute('data-oz-copy')) { e.preventDefault(); copy(t.getAttribute('data-oz-copy')); }
    else if (t.hasAttribute('data-oz-popup') && cfg.popup && modal && !e.metaKey && !e.ctrlKey) { e.preventDefault(); openPopup(t.getAttribute('href')); }
    else if (t.hasAttribute('data-oz-mode-toggle')) {
      var root = document.documentElement, next = root.dataset.mode === 'light' ? 'dark' : 'light';
      root.dataset.mode = next; try { localStorage.setItem('oz-mode', next); } catch (err) {}
    }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeBasket(); closeModal(); } });
  if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

  /* ---------- Copy IP ---------- */
  function copy(text) {
    if (!text) return;
    var done = function () { pop(cfg.copied || 'Copied!'); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (err) {}
      document.body.removeChild(ta);
    }
  }

  /* ---------- Live player count (mcsrvstat.us) ---------- */
  $$('[data-oz-players]').forEach(function (el) {
    var label = $('[data-oz-players-label]', el);
    fetch('https://api.mcsrvstat.us/3/' + encodeURIComponent(el.getAttribute('data-oz-players')))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!label) return;
        if (d && d.online && d.players) label.textContent = label.textContent.split(' · ')[0] + ' · ' + d.players.online + ' ' + (cfg.online || 'online');
        else label.textContent = cfg.offline || 'Server offline';
      }).catch(function () {});
  });

  /* ---------- Discord member count (server widget must be enabled) ---------- */
  $$('[data-oz-discord]').forEach(function (el) {
    var label = $('[data-oz-discord-label]', el);
    fetch('https://discord.com/api/guilds/' + encodeURIComponent(el.getAttribute('data-oz-discord')) + '/widget.json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && label && typeof d.presence_count === 'number') label.textContent = 'Discord · ' + d.presence_count.toLocaleString() + ' ' + (cfg.online || 'online'); })
      .catch(function () {});
  });

  /* ---------- Countdown ---------- */
  $$('[data-oz-countdown]').forEach(function (el) {
    var end = Date.parse(el.getAttribute('data-oz-countdown'));
    if (isNaN(end)) { el.hidden = true; return; }
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    (function tick() {
      var s = Math.max(0, Math.floor((end - Date.now()) / 1000));
      if (!s) { el.hidden = true; return; }
      el.textContent = pad(Math.floor(s / 86400)) + 'd ' + pad(Math.floor(s % 86400 / 3600)) + 'h ' + pad(Math.floor(s % 3600 / 60)) + 'm ' + pad(s % 60) + 's';
      setTimeout(tick, 1000);
    })();
  });

  /* ---------- Quantity chips ---------- */
  function money(n) { return (Math.round(n * 100) / 100).toFixed(2); }
  $$('[data-oz-qty-group]').forEach(function (group) {
    var card = group.closest('.oz-pkg');
    var add = card && $('[data-oz-add]', card);
    var priceEl = card && $('[data-oz-price]', card);
    if (!add) return;
    var baseLabel = add.textContent;
    var unit = priceEl ? parseFloat(String(priceEl.getAttribute('data-oz-price')).replace(/[^0-9.]/g, '')) : NaN;
    group.addEventListener('click', function (e) {
      var b = e.target.closest('[data-oz-qty]'); if (!b) return;
      $$('[data-oz-qty]', group).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      var q = parseInt(b.getAttribute('data-oz-qty'), 10) || 1;
      add.setAttribute('data-oz-n', q);
      add.textContent = q > 1 ? baseLabel + ' ×' + q + (isNaN(unit) ? '' : ' · ' + money(unit * q) + ' ' + (add.getAttribute('data-oz-currency') || '')) : baseLabel;
    });
  });
  // Adding N items = calling Tebex's add URL N times, then reloading the page.
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-oz-add][data-oz-n]');
    if (!a) return;
    var n = parseInt(a.getAttribute('data-oz-n'), 10);
    if (!n || n < 2) return;
    e.preventDefault();
    a.classList.add('is-disabled');
    var url = a.getAttribute('href'), i = 0;
    (function next() {
      if (i++ >= n) { location.reload(); return; }
      fetch(url, { credentials: 'same-origin', redirect: 'follow' }).then(function (r) {
        // Not logged in / options needed → Tebex redirects; continue in the browser instead.
        if (!r.ok || (r.redirected && /login|username|options/i.test(r.url))) { location.href = url; return; }
        next();
      }).catch(function () { location.href = url; });
    })();
  });

  /* ---------- Package popup ---------- */
  function openPopup(href) {
    lastFocus = document.activeElement;
    var body = $('[data-oz-modal-body]', modal);
    body.innerHTML = '<div class="oz-panel oz-modal__loading oz-skeleton" role="status"><span class="oz-loading__blocks" aria-hidden="true"><span></span><span></span><span></span></span><span class="oz-sr">Loading…</span></div>';
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    fetch(href, { credentials: 'same-origin' })
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var product = doc.getElementById('oz-product');
        if (!product) { location.href = href; return; }
        body.innerHTML = '';
        body.appendChild(document.importNode(product, true));
        initGallery(body);
        if (window.OZ && window.OZ.initPreview) window.OZ.initPreview(body);
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        var c = $('.oz-modal__close', modal); if (c) c.focus();
      })
      .catch(function () { location.href = href; });
  }

  /* ---------- Gallery (images + YouTube) ---------- */
  function ytEmbed(url) {
    var m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? 'https://www.youtube-nocookie.com/embed/' + m[1] : url;
  }
  function initGallery(root) {
    $$('iframe[data-oz-yt]', root).forEach(function (f) { f.src = ytEmbed(f.getAttribute('data-oz-yt')); });
    $$('[data-oz-gallery]', root).forEach(function (g) {
      var main = $('[data-oz-gallery-main]', g);
      g.addEventListener('click', function (e) {
        var b = e.target.closest('[data-oz-media-url]'); if (!b) return;
        $$('[data-oz-media-url]', g).forEach(function (x) { x.setAttribute('aria-current', String(x === b)); });
        var url = b.getAttribute('data-oz-media-url');
        var old = main.querySelector('img, iframe'); if (old) old.remove();
        var el;
        if (b.getAttribute('data-oz-media-type') === 'video') { el = document.createElement('iframe'); el.src = ytEmbed(url); el.allowFullscreen = true; el.title = 'Video'; }
        else { el = document.createElement('img'); el.src = url; el.alt = ''; }
        main.appendChild(el);
      });
    });
  }
  initGallery(document);

  /* ---------- Login: Java / Bedrock ---------- */
  $$('[data-oz-login]').forEach(function (form) {
    var input = $('input[name="ign"]', form), head = $('[data-oz-ign-head]', form), hidden = $('[data-oz-edition-value]', form);
    var prefix = cfg.bedrockPrefix || '';
    form.addEventListener('click', function (e) {
      var b = e.target.closest('[data-oz-edition]'); if (!b) return;
      $$('[data-oz-edition]', form).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      hidden.value = b.getAttribute('data-oz-edition');
    });
    var t;
    if (input && head) input.addEventListener('input', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var v = input.value.trim();
        head.src = 'https://mc-heads.net/avatar/' + encodeURIComponent(/^[A-Za-z0-9_]{3,16}$/.test(v) ? v : 'MHF_Steve') + '/64';
      }, 350);
    });
    form.addEventListener('submit', function () {
      var v = input.value.trim();
      if (hidden.value === 'bedrock' && prefix && v.indexOf(prefix) !== 0) v = prefix + v.replace(/ /g, '_');
      input.value = v;
    });
  });
})();

/* Skin fallback + rank preview switcher */
(function () {
  'use strict';
  document.querySelectorAll('[data-oz-skin-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      if (img.dataset.fellBack) return;
      img.dataset.fellBack = '1';
      img.src = 'https://mc-heads.net/body/MHF_Steve/' + (img.src.split('/').pop() || '180');
    });
  });
  document.querySelectorAll('[data-oz-preview]').forEach(function (box) {
    var tag = box.querySelector('[data-oz-preview-tag]');
    var chat = box.querySelector('[data-oz-preview-chat]');
    var name = box.querySelector('[data-oz-preview-name]');
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-oz-preview-set]'); if (!b) return;
      box.querySelectorAll('[data-oz-preview-set]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      var prefix = b.getAttribute('data-prefix'), color = b.getAttribute('data-color');
      if (tag && tag.firstElementChild) { tag.firstElementChild.textContent = prefix; tag.firstElementChild.style.color = color; }
      if (chat) { chat.textContent = prefix; chat.style.color = color; }
      if (name) name.textContent = b.getAttribute('data-name');
    });
  });
})();
