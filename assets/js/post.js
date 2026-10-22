// Post pages: table of contents with scroll-spy, and a reading-progress bar.
(function () {
  var prose = document.querySelector('.prose');
  if (!prose) return;

  // Reading progress
  var bar = document.querySelector('.read-progress span');
  function onScroll() {
    var r = prose.getBoundingClientRect();
    var total = r.height - window.innerHeight * 0.6;
    var done = Math.min(1, Math.max(0, -r.top / Math.max(total, 1)));
    if (bar) bar.style.transform = 'scaleX(' + done + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Table of contents from h1-h3 in the post body
  var toc = document.querySelector('.essay-toc');
  var heads = prose.querySelectorAll('h1, h2, h3');
  if (!toc || heads.length < 3) return;
  var list = toc.querySelector('ol');
  var links = [];
  var top = Math.min.apply(null, Array.prototype.map.call(heads, function (h) { return +h.tagName[1]; }));
  heads.forEach(function (h, i) {
    if (!h.id) {
      h.id = (h.textContent || 'section').toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') || 'section-' + i;
    }
    var li = document.createElement('li');
    li.className = 'toc-d' + (+h.tagName[1] - top);
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    list.appendChild(li);
    links.push(a);
  });
  toc.hidden = false;

  var spy = function () {
    var current = -1;
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top < window.innerHeight * 0.3) current = i;
    }
    links.forEach(function (a, i) {
      if (i === current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  };
  window.addEventListener('scroll', spy, { passive: true });
  spy();
})();
