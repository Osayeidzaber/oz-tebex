/* OZ Theme — oz-preview.js
   Rank / product preview: live 3D skin (skinview3d) with rank nametag, plus chat and tab-list tabs.
   States: loading → ready | fallback-2d (no WebGL / library blocked) | skin-error (falls back to Steve). */
(function () {
  'use strict';
  var OZ = window.OZ || {};
  var LIB = 'https://cdn.jsdelivr.net/npm/skinview3d@3.1.0/bundles/skinview3d.bundle.js';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function skinUrl(name) { return 'https://mc-heads.net/skin/' + encodeURIComponent(name || 'MHF_Steve'); }
  function bodyUrl(name, size) { return 'https://mc-heads.net/body/' + encodeURIComponent(name || 'MHF_Steve') + '/' + (size || 220); }
  function webgl() { try { var c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }

  var libPromise = null;
  function loadLib() {
    if (window.skinview3d) return Promise.resolve(window.skinview3d);
    if (libPromise) return libPromise;
    libPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = LIB; s.async = true;
      s.onload = function () { window.skinview3d ? resolve(window.skinview3d) : reject(new Error('lib')); };
      s.onerror = function () { reject(new Error('lib')); };
      document.head.appendChild(s);
      setTimeout(function () { reject(new Error('timeout')); }, 8000);
    });
    return libPromise;
  }

  function setState(box, state) { box.setAttribute('data-oz-state', state); }

  function fallback2d(box, name) {
    var stage = box.querySelector('[data-oz-3d]');
    if (!stage) return;
    stage.innerHTML = '';
    var img = document.createElement('img');
    img.className = 'oz-preview__skin'; img.alt = ''; img.src = bodyUrl(name);
    img.onerror = function () { if (!img.dataset.f) { img.dataset.f = 1; img.src = bodyUrl('MHF_Steve'); } };
    stage.appendChild(img);
    setState(box, 'fallback');
  }

  function tagText(box) {
    var t = box.querySelector('[data-oz-preview-tag]');
    return t ? t.textContent.replace(/\s+/g, ' ').trim() : '';
  }
  function tagColor(box) {
    var s = box.querySelector('[data-oz-preview-tag] span');
    return s ? (s.style.color || '#fff') : '#fff';
  }

  function init3d(box) {
    var stage = box.querySelector('[data-oz-3d]');
    var name = box.getAttribute('data-oz-skin') || 'MHF_Steve';
    if (!stage) return;
    if (!webgl()) { fallback2d(box, name); return; }
    setState(box, 'loading');
    loadLib().then(function (sv) {
      var canvas = document.createElement('canvas');
      canvas.setAttribute('aria-label', box.getAttribute('data-oz-skin-label') || 'Skin preview');
      canvas.setAttribute('role', 'img');
      var w = stage.clientWidth || 300, h = stage.clientHeight || 360;
      var viewer = new sv.SkinViewer({ canvas: canvas, width: w, height: h, skin: skinUrl(name) });
      viewer.fov = 40; viewer.zoom = 0.85;
      viewer.controls.enableZoom = false;
      viewer.autoRotate = !reduce && box.getAttribute('data-oz-rotate') !== 'off';
      viewer.autoRotateSpeed = 0.6;
      var anim = reduce ? 'none' : (box.getAttribute('data-oz-anim') || 'walk');
      if (anim === 'walk') viewer.animation = new sv.WalkingAnimation();
      else if (anim === 'run') viewer.animation = new sv.RunningAnimation();
      else if (anim === 'idle') viewer.animation = new sv.IdleAnimation();
      if (viewer.animation) viewer.animation.speed = 0.7;
      var setTag = function () {
        try { viewer.nameTag = new sv.NameTagObject(tagText(box), { textStyle: tagColor(box) }); } catch (e) { viewer.nameTag = tagText(box); }
      };
      setTag();
      // Skin load failure → Steve
      viewer.loadSkin(skinUrl(name)).catch(function () { return viewer.loadSkin(skinUrl('MHF_Steve')); }).catch(function () {});
      stage.innerHTML = ''; stage.appendChild(canvas);
      setState(box, 'ready');
      box._viewer = viewer; box._setTag = setTag;
      // Resize with container
      if ('ResizeObserver' in window) new ResizeObserver(function () { viewer.width = stage.clientWidth; viewer.height = stage.clientHeight; }).observe(stage);
      // Pause when off-screen to save battery
      if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { viewer.renderPaused = !en[0].isIntersecting; }).observe(stage);
      // Play / pause button
      var pp = box.querySelector('[data-oz-preview-play]');
      if (pp) {
        pp.hidden = false;
        pp.addEventListener('click', function () {
          var on = pp.getAttribute('aria-pressed') !== 'true';
          pp.setAttribute('aria-pressed', String(on));
          if (viewer.animation) viewer.animation.paused = !on;
          viewer.autoRotate = on && !reduce;
        });
      }
    }).catch(function () { fallback2d(box, name); });
  }

  function initBox(box) {
    if (box._ozInit) return;
    box._ozInit = true;
    // Lazy-init 3D only when visible
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); init3d(box); } }, { rootMargin: '200px' });
      io.observe(box);
    } else init3d(box);

    // Rank switcher: updates nametag, chat, tab list, 3D tag
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-oz-preview-set]');
      if (b) {
        box.querySelectorAll('[data-oz-preview-set]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        var prefix = b.getAttribute('data-prefix'), color = b.getAttribute('data-color');
        box.querySelectorAll('[data-oz-preview-tag] span, [data-oz-preview-chat], [data-oz-preview-tab]').forEach(function (el) { el.textContent = prefix; el.style.color = color; });
        var nm = box.querySelector('[data-oz-preview-name]'); if (nm) nm.textContent = b.getAttribute('data-name');
        var buy = box.querySelector('[data-oz-preview-buy]');
        if (buy && b.getAttribute('data-href')) { buy.href = b.getAttribute('data-href'); buy.querySelector('span').textContent = b.getAttribute('data-name'); }
        if (box._setTag) box._setTag();
        return;
      }
      var tab = e.target.closest('[data-oz-pv-tab]');
      if (tab) {
        var id = tab.getAttribute('data-oz-pv-tab');
        box.querySelectorAll('[data-oz-pv-tab]').forEach(function (x) { x.setAttribute('aria-selected', String(x === tab)); x.tabIndex = x === tab ? 0 : -1; });
        box.querySelectorAll('[data-oz-pv-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-oz-pv-panel') !== id; });
      }
    });
    // Arrow keys between tabs
    box.addEventListener('keydown', function (e) {
      var tab = e.target.closest('[data-oz-pv-tab]'); if (!tab || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
      var tabs = Array.prototype.slice.call(box.querySelectorAll('[data-oz-pv-tab]'));
      var n = tabs[(tabs.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      n.focus(); n.click();
    });
  }
  OZ.initPreview = function (root) {
    Array.prototype.slice.call((root || document).querySelectorAll('[data-oz-preview]')).forEach(initBox);
  };
  OZ.initPreview(document);
  window.OZ = OZ;
})();
