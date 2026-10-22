// Hero: ten random album covers from my playlist, placed by how alike CLIP thinks they look.
// Similarities were computed offline (CLIP ViT-B/32 image embeddings, cosine); the page only
// samples ten covers, lays them out with classical MDS and lets you query one against the rest.
(function () {
  var fig = document.querySelector('[data-covers]');
  var raw = document.getElementById('album-data');
  if (!fig || !raw) return;

  var DATA = JSON.parse(raw.textContent);
  var ALL = DATA.albums, N = ALL.length, K = 10;
  var BASE = fig.dataset.base || '/assets/albums/';
  var stage = fig.querySelector('.covers-stage');
  var edges = fig.querySelector('.covers-edges');
  var matrix = fig.querySelector('.covers-matrix');
  var panel = fig.querySelector('.covers-panel');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  // Cosine similarity between albums a and b (indices into ALL), from the packed upper triangle
  function cos(a, b) {
    if (a === b) return 1;
    if (a > b) { var t = a; a = b; b = t; }
    return DATA.sim[a * (2 * N - a - 1) / 2 + (b - a - 1)];
  }

  // Viridis, for similarity heat
  var VIRIDIS = [[68, 1, 84], [59, 82, 139], [33, 145, 140], [94, 201, 98], [253, 231, 37]];
  function heat(t) {
    t = Math.min(1, Math.max(0, t)) * (VIRIDIS.length - 1);
    var k = Math.min(VIRIDIS.length - 2, Math.floor(t)), f = t - k;
    var a = VIRIDIS[k], b = VIRIDIS[k + 1];
    return 'rgb(' + [0, 1, 2].map(function (c) { return Math.round(a[c] + (b[c] - a[c]) * f); }).join(',') + ')';
  }

  function sample() {
    var idx = ALL.map(function (_, i) { return i; });
    for (var i = idx.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = idx[i]; idx[i] = idx[j]; idx[j] = t;
    }
    return idx.slice(0, K);
  }

  // Classical MDS: 2D coordinates whose distances best match the embedding distances
  function mds(ids) {
    var n = ids.length, D2 = [], i, j;
    for (i = 0; i < n; i++) {
      D2.push([]);
      for (j = 0; j < n; j++) D2[i].push(2 - 2 * cos(ids[i], ids[j]));
    }
    var rowMean = D2.map(function (r) { return r.reduce(function (a, b) { return a + b; }, 0) / n; });
    var all = rowMean.reduce(function (a, b) { return a + b; }, 0) / n;
    var B = D2.map(function (r, i) { return r.map(function (v, j) { return -0.5 * (v - rowMean[i] - rowMean[j] + all); }); });
    var out = [], vecs = [];
    for (var d = 0; d < 2; d++) {
      var v = ids.map(function (_, i) { return Math.sin(i * 1.7 + d * 2.3) + 0.01; });
      var lam = 0;
      for (var it = 0; it < 200; it++) {
        var w = B.map(function (r) { return r.reduce(function (s, x, j) { return s + x * v[j]; }, 0); });
        vecs.forEach(function (p) {          // deflate: stay orthogonal to earlier axes
          var dot = w.reduce(function (s, x, j) { return s + x * p[j]; }, 0);
          w = w.map(function (x, j) { return x - dot * p[j]; });
        });
        var norm = Math.sqrt(w.reduce(function (s, x) { return s + x * x; }, 0)) || 1;
        lam = norm;
        v = w.map(function (x) { return x / norm; });
      }
      vecs.push(v);
      out.push(v.map(function (x) { return x * Math.sqrt(Math.max(lam, 1e-9)); }));
    }
    return ids.map(function (_, i) { return [out[0][i], out[1][i]]; });
  }

  // Fit coordinates into the stage, then push overlapping tiles apart
  function layout(ids) {
    var W = stage.clientWidth, H = stage.clientHeight;
    var tile = Math.round(Math.max(56, Math.min(112, Math.min(W, H) * 0.19)));
    var pts = mds(ids);
    var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
    var y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var pad = tile * 0.6;
    pts = pts.map(function (p) {
      return [pad + (p[0] - x0) / ((x1 - x0) || 1) * (W - 2 * pad), pad + (p[1] - y0) / ((y1 - y0) || 1) * (H - 2 * pad)];
    });
    var min = tile * 1.12;
    for (var it = 0; it < 120; it++) {
      for (var i = 0; i < pts.length; i++) for (var j = i + 1; j < pts.length; j++) {
        var dx = pts[j][0] - pts[i][0], dy = pts[j][1] - pts[i][1], d = Math.hypot(dx, dy) || 0.01;
        if (d < min) {
          var push = (min - d) / 2, ux = dx / d, uy = dy / d;
          pts[i][0] -= ux * push; pts[i][1] -= uy * push;
          pts[j][0] += ux * push; pts[j][1] += uy * push;
        }
      }
      pts.forEach(function (p) {
        var m = tile / 2 + 10;              // room for the selection ring
        p[0] = Math.max(m, Math.min(W - m, p[0]));
        p[1] = Math.max(m, Math.min(H - m, p[1]));
      });
    }
    return { pts: pts, tile: tile, W: W, H: H };
  }

  var ids = [], tiles = [], geo = null, query = -1, view = 'map';

  function spotifyUrl(a) { return 'https://open.spotify.com/track/' + a.uri.split(':').pop(); }
  function label(a) { return a.title + ' by ' + a.artist; }

  function build() {
    tiles.forEach(function (t) { t.remove(); });
    tiles = ids.map(function (id, k) {
      var a = ALL[id];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cover';
      b.setAttribute('aria-label', label(a));
      b.innerHTML = '<img src="' + BASE + a.id + '.jpg" alt="" loading="eager" decoding="async">';
      b.addEventListener('click', function () { setQuery(query === k ? -1 : k); });
      b.addEventListener('pointerenter', function () { if (query < 0) peek(k); });
      b.addEventListener('pointerleave', function () { if (query < 0) peek(-1); });
      stage.appendChild(b);
      return b;
    });
  }

  function place(scatter) {
    geo = layout(ids);
    stage.style.setProperty('--tile', geo.tile + 'px');
    tiles.forEach(function (t, k) {
      var p = scatter ? geo.pts[k] : [geo.W / 2, geo.H / 2];
      t.style.transform = 'translate(' + (p[0] - geo.tile / 2) + 'px,' + (p[1] - geo.tile / 2) + 'px)' + (scatter ? '' : ' rotate(' + ((k - 4.5) * 3) + 'deg)');
    });
    drawEdges();
  }

  // Range of similarities in this draw, so colours and widths use the full scale
  function range() {
    var lo = 1, hi = -1;
    for (var i = 0; i < K; i++) for (var j = i + 1; j < K; j++) {
      var s = cos(ids[i], ids[j]); lo = Math.min(lo, s); hi = Math.max(hi, s);
    }
    return { lo: lo, hi: hi, t: function (s) { return (s - lo) / ((hi - lo) || 1); } };
  }

  function drawEdges() {
    while (edges.firstChild) edges.removeChild(edges.firstChild);
    if (!geo) return;
    edges.setAttribute('viewBox', '0 0 ' + geo.W + ' ' + geo.H);
    var r = range(), focus = query, pairs = [];
    if (focus >= 0) {
      for (var j = 0; j < K; j++) if (j !== focus) pairs.push([focus, j]);
    } else {
      // Each cover to its nearest neighbour
      var seen = {};
      for (var i = 0; i < K; i++) {
        var best = -1, bs = -2;
        for (var j2 = 0; j2 < K; j2++) if (j2 !== i && cos(ids[i], ids[j2]) > bs) { bs = cos(ids[i], ids[j2]); best = j2; }
        var key = Math.min(i, best) + '-' + Math.max(i, best);
        if (!seen[key]) { seen[key] = 1; pairs.push([i, best]); }
      }
    }
    pairs.forEach(function (p) {
      var s = cos(ids[p[0]], ids[p[1]]), t = r.t(s);
      var a = geo.pts[p[0]], b = geo.pts[p[1]];
      var line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', a[0]); line.setAttribute('y1', a[1]);
      line.setAttribute('x2', b[0]); line.setAttribute('y2', b[1]);
      line.setAttribute('stroke', focus >= 0 ? heat(t) : 'currentColor');
      line.setAttribute('stroke-width', focus >= 0 ? (1 + t * 6).toFixed(1) : 1.25);
      line.setAttribute('stroke-opacity', focus >= 0 ? (0.25 + 0.75 * t).toFixed(2) : 0.7);
      if (focus < 0) line.setAttribute('stroke-dasharray', '3 5');
      edges.appendChild(line);
    });
  }

  function neighbours(k) {
    return ids.map(function (id, j) { return { j: j, s: cos(ids[k], id) }; })
      .filter(function (o) { return o.j !== k; })
      .sort(function (a, b) { return b.s - a.s; });
  }

  function words(a) { return a.words.join(', '); }

  function idlePanel() {
    panel.innerHTML = '<p class="covers-lede">Ten covers drawn at random from the ' + ALL.length + ' albums in my playlist. ' +
      'CLIP turned each one into a vector; covers sit close together when the vectors point the same way. Pick one to compare it with the rest.</p>';
  }

  function peek(k) {
    tiles.forEach(function (t, j) { t.classList.toggle('is-peek', j === k); });
    if (k < 0) { idlePanel(); return; }
    var a = ALL[ids[k]];
    panel.innerHTML = '<p class="covers-title">' + esc(a.title) + '</p><p class="covers-artist">' + esc(a.artist) + '</p>' +
      '<p class="covers-sees">CLIP sees: ' + esc(words(a)) + '</p>';
  }

  function setQuery(k) {
    query = k;
    var r = range();
    tiles.forEach(function (t, j) {
      t.classList.toggle('is-query', j === k);
      t.classList.remove('is-peek');
      if (k < 0 || j === k) { t.style.removeProperty('--sim'); t.removeAttribute('data-sim'); return; }
      var s = cos(ids[k], ids[j]);
      t.style.setProperty('--sim', r.t(s).toFixed(3));
      t.setAttribute('data-sim', s.toFixed(2));
    });
    fig.classList.toggle('has-query', k >= 0);
    drawEdges();
    if (view === 'matrix') drawMatrix();
    if (k < 0) { idlePanel(); return; }
    var a = ALL[ids[k]];
    var html = '<div class="covers-q"><img src="' + BASE + a.id + '.jpg" alt=""><div><p class="covers-title">' + esc(a.title) + '</p>' +
      '<p class="covers-artist">' + esc(a.artist) + '</p><p class="covers-sees">CLIP sees: ' + esc(words(a)) + '</p></div></div>' +
      '<p class="covers-sub">Most alike in this draw</p><ol class="covers-nn">';
    neighbours(k).slice(0, 3).forEach(function (o) {
      var b = ALL[ids[o.j]], t = r.t(o.s);
      html += '<li><img src="' + BASE + b.id + '.jpg" alt=""><span class="nn-name">' + esc(b.title) + '</span>' +
        '<span class="nn-bar"><span style="width:' + (8 + t * 92).toFixed(0) + '%;background:' + heat(t) + '"></span></span>' +
        '<span class="nn-s">' + o.s.toFixed(2) + '</span></li>';
    });
    html += '</ol><p class="covers-foot"><a href="' + spotifyUrl(a) + '">Play “' + esc(a.title) + '” on Spotify</a></p>';
    panel.innerHTML = html;
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // Matrix view: the same similarities as a 10 x 10 heatmap
  function drawMatrix() {
    var r = range();
    var html = '<div class="mx" style="--k:' + K + '"><span class="mx-corner"></span>';
    ids.forEach(function (id) { html += '<img class="mx-head" src="' + BASE + ALL[id].id + '.jpg" alt="">'; });
    ids.forEach(function (id, i) {
      html += '<img class="mx-head" src="' + BASE + ALL[id].id + '.jpg" alt="">';
      ids.forEach(function (id2, j) {
        var s = cos(id, id2), t = i === j ? 1 : r.t(s);
        var on = query >= 0 && (i === query || j === query);
        html += '<span class="mx-cell' + (i === j ? ' is-self' : '') + (on ? ' is-on' : '') + '" data-i="' + i + '" data-j="' + j + '" style="background:' + heat(t) + '" title="' +
          esc(ALL[id].title) + ' × ' + esc(ALL[id2].title) + ': ' + s.toFixed(2) + '"></span>';
      });
    });
    matrix.innerHTML = html + '</div>';
  }
  matrix.addEventListener('click', function (e) {
    var c = e.target.closest('.mx-cell');
    if (c) setQuery(+c.dataset.i);
  });

  var viewBtns = Array.prototype.slice.call(fig.querySelectorAll('[data-view]'));
  viewBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      view = b.dataset.view;
      viewBtns.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      fig.classList.toggle('is-matrix', view === 'matrix');
      if (view === 'matrix') drawMatrix();
    });
  });

  // Draw a fresh ten: gather into a stack, swap the covers, fan out to the new layout
  function draw(first) {
    query = -1;
    fig.classList.remove('has-query');
    var go = function () {
      ids = sample();
      build();
      place(false);
      idlePanel();
      if (view === 'matrix') drawMatrix();
      if (reduced) { place(true); return; }
      requestAnimationFrame(function () { requestAnimationFrame(function () { place(true); }); });
    };
    if (first || reduced || !tiles.length) { go(); return; }
    tiles.forEach(function (t, k) {
      t.style.transform = 'translate(' + (geo.W / 2 - geo.tile / 2) + 'px,' + (geo.H / 2 - geo.tile / 2) + 'px) rotate(' + ((k - 4.5) * 3) + 'deg)';
    });
    edges.innerHTML = '';
    setTimeout(go, 420);
  }

  fig.querySelector('[data-shuffle]').addEventListener('click', function () { draw(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && query >= 0) setQuery(-1); });

  var resizeTimer;
  if (window.ResizeObserver) new ResizeObserver(function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { if (ids.length) { place(true); if (query >= 0) drawEdges(); } }, 60);
  }).observe(stage);

  draw(true);
})();
