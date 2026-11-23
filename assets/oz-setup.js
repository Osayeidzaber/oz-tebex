/* OZ Theme — oz-setup.js: tabs, row editors and icon browser on the setup / admin page.
   Reads current setting text, lets the owner edit rows, and outputs text to paste into Tebex. */
(function () {
  'use strict';
  var root = document.querySelector('[data-oz-setup]');
  if (!root) return;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Tabs (arrow keys move between them) ---------- */
  var tabs = $$('[data-oz-setup-tab]', root);
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.tabIndex = t.getAttribute('aria-selected') === 'true' ? 0 : -1;
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var n = tabs[(i + d + tabs.length) % tabs.length]; select(n); n.focus();
    });
  });

  /* ---------- Icon names, read from the loaded stylesheets (oz-icons.css + oz.css) ---------- */
  var names = [];
  Array.prototype.forEach.call(document.styleSheets, function (sh) {
    var rules; try { rules = sh.cssRules; } catch (e) { return; }
    Array.prototype.forEach.call(rules || [], function (r) {
      var m = r.selectorText && r.selectorText.match(/^\.oz-ico--([a-z0-9-]+)$/);
      if (m && ['sm', 'lg', 'xl', 'img'].indexOf(m[1]) < 0 && names.indexOf(m[1]) < 0) names.push(m[1]);
    });
  });
  var dl = document.createElement('datalist'); dl.id = 'oz-icon-names';
  names.forEach(function (n) { var o = document.createElement('option'); o.value = n; dl.appendChild(o); });
  root.appendChild(dl);

  function iconEl(v) {
    var isUrl = v.indexOf('/') >= 0;
    var el = document.createElement(isUrl ? 'img' : 'span');
    el.className = 'oz-ico oz-ico--sm ' + (isUrl ? 'oz-ico--img' : 'oz-ico--' + v.toLowerCase());
    if (isUrl) { el.src = v; el.alt = ''; }
    return el;
  }

  /* ---------- Row editors ---------- */
  $$('[data-oz-editor]', root).forEach(function (ed) {
    var cols = ed.getAttribute('data-oz-cols').split('||');
    var sep = ed.getAttribute('data-oz-sep') || '|';
    var byComma = ed.getAttribute('data-oz-join') === 'comma';
    var join = byComma ? ', ' : '\n';
    var iconCol = ed.hasAttribute('data-oz-icon-col') ? +ed.getAttribute('data-oz-icon-col') : -1;
    var rowsEl = ed.querySelector('[data-oz-rows]');
    var out = ed.querySelector('[data-oz-output]');
    var src = ed.querySelector('[data-oz-source]');

    // Characters that separate cells or rows in this setting would break it, so they are removed.
    var bad = new RegExp('[\\r\\n' + (sep === '=' ? '=' : '|') + (byComma ? ',' : '') + ']', 'g');
    function clean(v) { return v.replace(bad, ' ').trim(); }

    function render() {
      out.value = $$('.oz-setup__row', rowsEl).map(function (row) {
        var vals = $$('input', row).map(function (i) { return clean(i.value); });
        while (vals.length && !vals[vals.length - 1]) vals.pop();     // drop empty trailing cells
        return vals.join(sep === '=' ? '=' : ' ' + sep + ' ');
      }).filter(Boolean).join(join);
    }
    function addRow(values, focus) {
      var row = document.createElement('div');
      row.className = 'oz-setup__row';
      cols.forEach(function (c, i) {
        var inp = document.createElement('input');
        inp.className = 'oz-input';
        inp.placeholder = c;
        inp.setAttribute('aria-label', c);
        inp.value = (values && values[i] || '').trim();
        if (i === iconCol) {
          // Icon column: name suggestions + live preview.
          inp.setAttribute('list', 'oz-icon-names');
          var prev = document.createElement('span');
          prev.className = 'oz-slot oz-setup__prev';
          prev.setAttribute('aria-hidden', 'true');
          var sync = function () { prev.innerHTML = ''; var v = inp.value.trim(); if (v) prev.appendChild(iconEl(v)); };
          inp.addEventListener('input', sync); sync();
          row.appendChild(prev);
        }
        row.appendChild(inp);
      });
      var del = document.createElement('button');
      del.type = 'button';
      del.className = 'oz-btn oz-btn--alt oz-btn--icon oz-btn--sm';
      del.setAttribute('aria-label', 'Remove row');
      del.innerHTML = '&times;';
      del.addEventListener('click', function () { row.remove(); render(); });
      row.appendChild(del);
      rowsEl.appendChild(row);
      if (focus) row.querySelector('input').focus();
    }

    var lines = (src.value || '').split(byComma ? /\r?\n|,/ : /\r?\n/).filter(function (l) { return l.trim(); });
    lines.forEach(function (l) { addRow(l.split(sep)); });
    if (!lines.length) addRow();
    rowsEl.addEventListener('input', render);
    ed.querySelector('[data-oz-add-row]').addEventListener('click', function () { addRow(null, true); render(); });
    ed.querySelector('[data-oz-copy-out]').addEventListener('click', function (e) {
      var btn = e.currentTarget, label = btn.textContent;
      var done = function () { btn.textContent = '✓'; setTimeout(function () { btn.textContent = label; }, 1400); };
      if (navigator.clipboard) navigator.clipboard.writeText(out.value).then(done, function () { out.select(); });
      else { out.select(); try { document.execCommand('copy'); done(); } catch (err) {} }
    });
    render();
  });

  /* ---------- Icon browser: click to copy a name ---------- */
  var grid = root.querySelector('[data-oz-icon-grid]'), q = document.getElementById('oz-icon-q');
  if (grid) {
    grid.innerHTML = '';
    if (!names.length) grid.innerHTML = '<p class="oz-muted">Icons could not be loaded. Check that oz-icons.css is uploaded as an asset.</p>';
    names.forEach(function (n) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'oz-slot oz-setup__icon'; b.title = n; b.setAttribute('data-name', n);
      b.innerHTML = '<span class="oz-ico oz-ico--' + n + '"></span><code>' + n + '</code>';
      grid.appendChild(b);
    });
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('[data-name]'); if (!b) return;
      var ok = function () { b.classList.add('is-copied'); setTimeout(function () { b.classList.remove('is-copied'); }, 900); };
      if (navigator.clipboard) navigator.clipboard.writeText(b.getAttribute('data-name')).then(ok, ok); else ok();
    });
    if (q) q.addEventListener('input', function () {
      var v = q.value.trim().toLowerCase();
      $$('[data-name]', grid).forEach(function (b) { b.hidden = !!v && b.getAttribute('data-name').indexOf(v) < 0; });
    });
  }
})();
