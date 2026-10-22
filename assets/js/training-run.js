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
  // The run spans the whole axis: from the start of the first year to today
  var T0 = Math.floor(starts[0]), T1 = NOW;

  // A smooth falling curve, with a small spike each time the data distribution changes (a new role)
  function loss(t) {
    var base = 0.3 + 1.9 * Math.exp(-(t - T0) / 2.6);
    var spikes = 0;
    starts.slice(1).forEach(function (s) { if (t >= s) spikes += 0.2 * Math.exp(-(t - s) / 0.08); });
    var noise = 0.018 * Math.sin(t * 41) + 0.011 * Math.sin(t * 97 + 1.3);
    return base + spikes + noise;
  }
  function X(t) { return PAD.l + (t - T0) / (T1 - T0) * (W - PAD.l - PAD.r); }
  function Y(v) { return PAD.t + (1 - (v - 0.15) / 2.25) * (H - PAD.t - PAD.b); }

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
  var ticks = [];
  for (var y = T0; y <= T1 - 0.35; y++) ticks.push({ t: y, label: y, cls: (y - T0) % 2 ? 'run-year-odd' : '' });
  ticks.push({ t: T1, label: 'now', cls: 'run-year-now' });
  ticks.forEach(function (k) {
    el('line', { x1: X(k.t), y1: H - PAD.b, x2: X(k.t), y2: H - PAD.b + 6 }, axis);
    var tx = el('text', { x: X(k.t), y: H - PAD.b + 24, 'text-anchor': k.label === 'now' ? 'end' : 'middle', class: k.cls }, axis);
    tx.textContent = k.label;
  });
  var yl = el('text', { x: 14, y: PAD.t + 8, class: 'run-ylabel' }, axis);
  yl.textContent = 'loss';

  // The curve itself, from the first checkpoint to today
  var pts = [];
  for (var t = T0; t < T1; t += 0.01) pts.push([X(t), Y(loss(t))]);
  pts.push([X(T1), Y(loss(T1))]);
  var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
  el('path', { d: d + ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + (H - PAD.b) + ' L' + pts[0][0].toFixed(1) + ' ' + (H - PAD.b) + ' Z', class: 'run-area' }, svg);
  el('path', { d: d, class: 'run-curve', stroke: 'url(#run-grad)' }, svg);

  // Marker for the selected checkpoint
  var guide = el('line', { class: 'run-guide' }, svg);

  var marks = starts.map(function (s, i) {
    var g = el('g', { class: 'run-mark' + (tabs[i].dataset.kind === 'study' ? ' is-study' : '') }, svg);
    el('circle', { cx: X(s), cy: Y(loss(s)), r: 14, class: 'run-hit' }, g);
    el('circle', { cx: X(s), cy: Y(loss(s)), r: 5.5, class: 'run-dot' }, g);
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
    var s = starts[i];
    guide.setAttribute('x1', X(s)); guide.setAttribute('x2', X(s));
    guide.setAttribute('y1', Y(loss(s)) + 8); guide.setAttribute('y2', H - PAD.b);
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
