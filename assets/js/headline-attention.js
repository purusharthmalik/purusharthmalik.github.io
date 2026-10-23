// Headline: real attention weights from a small language model, shown as colour behind each token.
// Weights come from _scripts/headline_attention.py (per layer, averaged over heads, BOS sink removed).
(function () {
  var h1 = document.querySelector('[data-attn]');
  var raw = document.getElementById('attn-data');
  if (!h1 || !raw) return;

  var DATA = JSON.parse(raw.textContent);
  var TOK = DATA.tokens, LAYERS = DATA.layers;
  var range = document.querySelector('[data-attn-layer]');
  var readout = document.querySelector('[data-attn-readout]');

  // Viridis, sampled at five stops
  var VIRIDIS = [[68, 1, 84], [59, 82, 139], [33, 145, 140], [94, 201, 98], [253, 231, 37]];
  function heat(t) {
    t = Math.min(1, Math.max(0, t)) * (VIRIDIS.length - 1);
    var k = Math.min(VIRIDIS.length - 2, Math.floor(t)), f = t - k;
    var a = VIRIDIS[k], b = VIRIDIS[k + 1];
    return [0, 1, 2].map(function (c) { return Math.round(a[c] + (b[c] - a[c]) * f); });
  }
  function luminance(c) {
    var v = c.map(function (x) { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }

  // Rebuild the headline as tokens. Pieces without a leading space (subwords, punctuation)
  // join the previous word so a line never breaks inside a word.
  var plain = h1.textContent.trim();
  h1.textContent = '';
  var sr = document.createElement('span');
  sr.className = 'sr-only';
  sr.textContent = plain;
  h1.appendChild(sr);
  var line = document.createElement('span');
  line.setAttribute('aria-hidden', 'true');
  h1.appendChild(line);
  var word = null;
  var els = TOK.map(function (t, i) {
    if (!word || t[0] === ' ') {
      if (word) line.appendChild(document.createTextNode(' '));
      word = document.createElement('span');
      word.className = 'tok-word';
      line.appendChild(word);
    }
    var s = document.createElement('span');
    s.className = 'tok';
    s.textContent = t.trim();
    s.dataset.i = i;
    word.appendChild(s);
    return s;
  });

  var DEFAULT_QUERY = TOK.length - 2;   // "models"
  var query = DEFAULT_QUERY, layer = +(range && range.value || 17) - 1;

  function label(i) { return TOK[i].trim(); }

  function paint() {
    var row = LAYERS[layer][query];
    var max = Math.max.apply(null, row);
    els.forEach(function (el, j) {
      el.classList.toggle('is-query', j === query);
      el.classList.toggle('is-masked', j > query);
      if (j > query) { el.style.removeProperty('background-color'); el.style.removeProperty('color'); return; }
      var t = row[j] / max;
      var c = heat(t), alpha = Math.max(0, (t - 0.08) / 0.92);
      el.style.backgroundColor = 'rgba(' + c.join(',') + ',' + alpha.toFixed(3) + ')';
      // Pick readable text on strong fills; leave faint fills on the page's own ink
      if (alpha > 0.45) el.style.color = luminance(c) > 0.3 ? '#1a0b2e' : '#ffffff';
      else el.style.removeProperty('color');
    });
    if (readout) {
      var top = row.map(function (w, j) { return { j: j, w: w }; })
        .filter(function (o) { return o.j !== query; })
        .sort(function (a, b) { return b.w - a.w; })[0];
      readout.textContent = '“' + label(query) + '” looks hardest at “' + (top ? label(top.j) : label(query)) + '” in layer ' + (layer + 1) + ' of ' + LAYERS.length + '.';
    }
  }

  line.addEventListener('pointerover', function (e) {
    var t = e.target.closest('.tok');
    if (t) { query = +t.dataset.i; paint(); }
  });
  h1.tabIndex = 0;
  h1.setAttribute('aria-describedby', 'attn-help');
  h1.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    query = Math.max(0, Math.min(TOK.length - 1, query + (e.key === 'ArrowRight' ? 1 : -1)));
    paint();
  });
  if (range) {
    range.max = LAYERS.length;
    range.addEventListener('input', function () { layer = +range.value - 1; paint(); });
  }

  paint();
})();
