// Work: the career timeline drawn as a training loss curve, one checkpoint per role.
(function () {
  var run = document.querySelector('[data-run]');
  if (!run) return;

  var svg = run.querySelector('svg');
  var tabs = Array.prototype.slice.call(run.querySelectorAll('[role="tab"]'));
  var logs = Array.prototype.slice.call(run.querySelectorAll('.run-log'));
  var NS = 'http://www.w3.org/2000/svg';
  var W = 1000, H = 300, PAD = { l: 48, r: 24, t: 24, b: 40 };

  var now = new Date();
  var NOW = now.getFullYear() + now.getMonth() / 12;
  var starts = tabs.map(function (t) { return +t.dataset.start; });
  var n = starts.length;
  var T0 = Math.floor(starts[0]), T1 = Math.max(NOW, starts[n - 1] + 0.05);

  // Checkpoints sit at even spacing along the axis. Time is stretched piecewise-linearly between them,
  // so crowded years (2024-25) open up and quiet ones (2020-22) compress. Year ticks follow the same warp.
  var KT = [T0].concat(starts, [T1]);
  var KU = [0].concat(starts.map(function (_, i) { return (i + 0.5) / n; }), [1]);
  function warp(t) {
    for (var k = 1; k < KT.length; k++) {
      if (t <= KT[k]) return KU[k - 1] + (t - KT[k - 1]) / (KT[k] - KT[k - 1]) * (KU[k] - KU[k - 1]);
    }
    return 1;
  }

  // Loss over the warped axis: a steady exponential descent, plus a sharp drop just after
  // each checkpoint (a new job or degree), like a schedule restart that lands lower each time.
  var DROP = 0.24, WIDTH = 0.004;
  function sig(x) { return 1 / (1 + Math.exp(-x)); }
  function loss(u) {
    var steps = 0;
    for (var i = 0; i < n; i++) steps += sig((u - (i + 0.5) / n - 0.012) / WIDTH);
    var noise = 0.014 * Math.sin(u * 211) + 0.009 * Math.sin(u * 517 + 1.3);
    return 0.22 + 0.9 * Math.exp(-1.5 * u) + DROP * (n - steps) + noise;
  }
  var LMAX = loss(0) + 0.05, LMIN = 0.15;
  function X(u) { return PAD.l + u * (W - PAD.l - PAD.r); }
  function Y(v) { return PAD.t + (1 - (v - LMIN) / (LMAX - LMIN)) * (H - PAD.t - PAD.b); }

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  var defs = el('defs', {}, svg);
  var grad = el('linearGradient', { id: 'run-grad', x1: '0', x2: '1', y1: '0', y2: '0' }, defs);
  [['0', '#3b528b'], ['0.45', '#21918c'], ['0.8', '#5ec962'], ['1', '#fde725']].forEach(function (s) {
    el('stop', { offset: s[0], 'stop-color': s[1] }, grad);
  });

  // Axes: years along the bottom, "loss" up the side
  var axis = el('g', { class: 'run-axis' }, svg);
  el('line', { x1: PAD.l, y1: H - PAD.b, x2: W - PAD.r, y2: H - PAD.b }, axis);
  // Skip year labels that would collide. Phones draw axis text larger, so labels closer than
  // 130 units to the last phone-visible one get a class that CSS hides on small screens.
  var ticks = [], lastX = -1e9, lastMajor = -1e9, nowX = X(1);
  for (var y = T0; y < T1; y++) {
    var x = X(warp(y));
    if (x - lastX < 46 || nowX - x < 46) continue;
    var minor = x - lastMajor < 130 || nowX - x < 130;
    ticks.push({ x: x, label: y, cls: minor ? 'run-year-minor' : '' });
    lastX = x;
    if (!minor) lastMajor = x;
  }
  ticks.push({ x: nowX, label: 'now', cls: 'run-year-now' });
  ticks.forEach(function (k) {
    el('line', { x1: k.x, y1: H - PAD.b, x2: k.x, y2: H - PAD.b + 6 }, axis);
    var tx = el('text', { x: k.x, y: H - PAD.b + 24, 'text-anchor': k.label === 'now' ? 'end' : 'middle', class: k.cls }, axis);
    tx.textContent = k.label;
  });
  var yl = el('text', { x: 14, y: PAD.t + 8, class: 'run-ylabel' }, axis);
  yl.textContent = 'loss';

  // The curve itself, from the start of the first year to today
  var pts = [];
  for (var u = 0; u < 1; u += 0.001) pts.push([X(u), Y(loss(u))]);
  pts.push([X(1), Y(loss(1))]);
  var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
  el('path', { d: d + ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + (H - PAD.b) + ' L' + pts[0][0].toFixed(1) + ' ' + (H - PAD.b) + ' Z', class: 'run-area' }, svg);
  el('path', { d: d, class: 'run-curve', stroke: 'url(#run-grad)' }, svg);

  // Marker for the selected checkpoint
  var guide = el('line', { class: 'run-guide' }, svg);

  var marks = starts.map(function (s, i) {
    var u = (i + 0.5) / n;
    var g = el('g', { class: 'run-mark' + (tabs[i].dataset.kind === 'study' ? ' is-study' : '') }, svg);
    el('circle', { cx: X(u), cy: Y(loss(u)), r: 14, class: 'run-hit' }, g);
    el('circle', { cx: X(u), cy: Y(loss(u)), r: 5.5, class: 'run-dot' }, g);
    g.addEventListener('click', function () { select(i, false); });
    return g;
  });

  function select(i, focus) {
    tabs.forEach(function (t, j) {
      var on = j === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      marks[j].classList.toggle('is-on', on);
    });
    logs.forEach(function (l) { l.hidden = l.dataset.for !== tabs[i].id; });
    run.querySelector('[role="tabpanel"]').setAttribute('aria-labelledby', tabs[i].id);
    var u = (i + 0.5) / n;
    guide.setAttribute('x1', X(u)); guide.setAttribute('x2', X(u));
    guide.setAttribute('y1', Y(loss(u)) + 8); guide.setAttribute('y2', H - PAD.b);
    if (focus) tabs[i].focus();
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(i, false); });
    t.addEventListener('keydown', function (e) {
      var n = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (n === undefined) return;
      e.preventDefault();
      select((n + tabs.length) % tabs.length, true);
    });
  });

  select(tabs.length - 1, false);
})();
