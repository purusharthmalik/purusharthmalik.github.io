// Writing: posts plotted as points in a 2D "embedding" map, clustered by topic.
// The map and the list are linked: pointing at one lights up the other.
(function () {
  var fig = document.querySelector('[data-post-map]');
  var list = document.querySelector('[data-post-list]');
  if (!fig || !list) return;

  var W = 600, H = 420, NS = 'http://www.w3.org/2000/svg';
  // Where each topic sits on the map. Neighbouring topics share ideas.
  var CENTRES = {
    interpretability: { x: 140, y: 130, label: 'interpretability' },
    reasoning: { x: 330, y: 95, label: 'reasoning' },
    models: { x: 395, y: 260, label: 'models' },
    generative: { x: 175, y: 315, label: 'generative' },
    systems: { x: 505, y: 340, label: 'systems' }
  };
  var GOLDEN = Math.PI * (3 - Math.sqrt(5));

  var svg = fig.querySelector('svg');
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  // Faint grid, like the axes of a scatter plot
  var grid = el('g', { class: 'map-grid' }, svg);
  for (var gx = 50; gx < W; gx += 50) el('line', { x1: gx, y1: 0, x2: gx, y2: H }, grid);
  for (var gy = 50; gy < H; gy += 50) el('line', { x1: 0, y1: gy, x2: W, y2: gy }, grid);

  var rows = Array.prototype.slice.call(list.querySelectorAll('.post-row'));
  var byTopic = {};
  rows.forEach(function (r) { (byTopic[r.dataset.topic] = byTopic[r.dataset.topic] || []).push(r); });

  // Density blob and label per topic
  var blobs = el('g', { class: 'map-blobs' }, svg);
  Object.keys(CENTRES).forEach(function (t) {
    var c = CENTRES[t], n = (byTopic[t] || []).length;
    el('circle', { cx: c.x, cy: c.y, r: 52 + n * 10, class: 'map-blob', 'data-topic': t }, blobs);
    var lbl = el('text', { x: c.x, y: c.y - 60 - n * 10, class: 'map-label', 'data-topic': t, 'text-anchor': 'middle' }, blobs);
    lbl.textContent = c.label;
  });

  // One point per post, on a small sunflower spiral around its topic centre (oldest in the middle)
  var dots = el('g', { class: 'map-dots', 'aria-hidden': 'true' }, svg);
  var pointFor = {};
  Object.keys(byTopic).forEach(function (t) {
    var c = CENTRES[t] || { x: W / 2, y: H / 2 };
    byTopic[t].slice().reverse().forEach(function (row, k) {
      var rad = k === 0 ? 0 : 38 * Math.sqrt(k + 0.4);
      var a = k * GOLDEN + 0.8;
      var x = c.x + rad * Math.cos(a), y = c.y + rad * Math.sin(a);
      var link = el('a', { href: row.querySelector('a').getAttribute('href'), tabindex: '-1' }, dots);
      var r = 7 + Math.min(20, +row.dataset.minutes || 10) * 0.55;
      var dot = el('circle', { cx: x, cy: y, r: r, class: 'map-dot', 'data-topic': t }, link);
      pointFor[row.dataset.slug] = { dot: dot, x: x, y: y, r: r, row: row };
      link.addEventListener('pointerenter', function () { light(row.dataset.slug); });
      link.addEventListener('pointerleave', function () { light(null); });
    });
  });

  // Each post linked to its two nearest neighbours, like a k-NN graph over embeddings
  var edges = el('g', { class: 'map-edges' }, svg);
  svg.insertBefore(edges, dots);
  var pts = Object.keys(pointFor).map(function (k) { return pointFor[k]; });
  var seen = {};
  pts.forEach(function (p, i) {
    pts.map(function (q, j) { return { j: j, d: Math.hypot(p.x - q.x, p.y - q.y) }; })
      .filter(function (o) { return o.j !== i; })
      .sort(function (a, b) { return a.d - b.d; })
      .slice(0, 2)
      .forEach(function (o) {
        var key = Math.min(i, o.j) + '-' + Math.max(i, o.j);
        if (seen[key]) return;
        seen[key] = 1;
        el('line', { x1: p.x, y1: p.y, x2: pts[o.j].x, y2: pts[o.j].y }, edges);
      });
  });

  // Title tag shown next to the lit point
  var tag = el('g', { class: 'map-tag', visibility: 'hidden' }, svg);
  var tagBg = el('rect', { rx: 6, ry: 6 }, tag);
  var tagText = el('text', {}, tag);

  function light(slug) {
    rows.forEach(function (r) { r.classList.toggle('is-lit', r.dataset.slug === slug); });
    Object.keys(pointFor).forEach(function (s) { pointFor[s].dot.classList.toggle('is-lit', s === slug); });
    if (!slug || !pointFor[slug]) { tag.setAttribute('visibility', 'hidden'); return; }
    var p = pointFor[slug];
    var title = p.row.dataset.title;
    tagText.textContent = title.length > 44 ? title.slice(0, 42) + '…' : title;
    var bb = tagText.getBBox();
    var right = p.x + p.r + 10 + bb.width + 16 < W;
    var x = right ? p.x + p.r + 8 : p.x - p.r - 8 - bb.width - 16;
    var y = Math.max(4, Math.min(H - bb.height - 12, p.y - bb.height / 2 - 6));
    tagBg.setAttribute('x', x); tagBg.setAttribute('y', y);
    tagBg.setAttribute('width', bb.width + 16); tagBg.setAttribute('height', bb.height + 10);
    tagText.setAttribute('x', x + 8); tagText.setAttribute('y', y + 5 + bb.height * 0.8);
    tag.setAttribute('visibility', 'visible');
  }

  rows.forEach(function (r) {
    var a = r.querySelector('a');
    r.addEventListener('pointerenter', function () { light(r.dataset.slug); });
    r.addEventListener('pointerleave', function () { light(null); });
    a.addEventListener('focus', function () { light(r.dataset.slug); });
    a.addEventListener('blur', function () { light(null); });
  });

  // Topic filter: one topic at a time, pressing it again shows everything
  var keys = Array.prototype.slice.call(fig.querySelectorAll('.topic-key'));
  var filter = null;
  keys.forEach(function (k) {
    k.addEventListener('click', function () {
      filter = filter === k.dataset.topic ? null : k.dataset.topic;
      keys.forEach(function (o) { o.setAttribute('aria-pressed', String(o.dataset.topic === filter)); });
      rows.forEach(function (r) { r.hidden = !!filter && r.dataset.topic !== filter; });
      svg.querySelectorAll('[data-topic]').forEach(function (n) {
        n.classList.toggle('is-dim', !!filter && n.getAttribute('data-topic') !== filter);
      });
    });
  });
})();
