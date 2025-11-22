document.addEventListener('DOMContentLoaded', function () {
  try {
    var tocContainer = document.getElementById('post-toc');
    if (!tocContainer) return;

    var content = document.querySelector('.post-content');
    if (!content) return;

    // Include h1/h2/h3 from the post content
    var headings = content.querySelectorAll('h1, h2, h3');
    if (!headings || headings.length === 0) return;

    function slugify(text) {
      return text.toString().toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    var listContainer = tocContainer.querySelector('.toc-list-container');
    var ul = document.createElement('ul');
    ul.className = 'post-toc-list';

    var currentLiForH1 = null;
    var currentLiForH2 = null;

    headings.forEach(function (h) {
      var level = h.tagName.toLowerCase();
      var text = h.textContent || h.innerText;
      if (!text) return;
      if (!h.id) {
        h.id = slugify(text);
      }
      var li = document.createElement('li');
      li.className = level === 'h1' ? 'toc-level-1' : (level === 'h2' ? 'toc-level-2' : 'toc-level-3');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = text;
      a.dataset.targetId = h.id;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(h.id);
        if (target) {
          window.history.pushState(null, '', '#' + h.id);
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      li.appendChild(a);

      if (level === 'h1') {
        ul.appendChild(li);
        currentLiForH1 = li;
        currentLiForH2 = null;
      } else if (level === 'h2') {
        if (currentLiForH1) {
          var sub1 = currentLiForH1.querySelector('ul');
          if (!sub1) { sub1 = document.createElement('ul'); sub1.className = 'post-toc-sublist'; currentLiForH1.appendChild(sub1); }
          sub1.appendChild(li);
        } else {
          ul.appendChild(li);
        }
        currentLiForH2 = li;
      } else if (level === 'h3') {
        if (currentLiForH2) {
          var sub2 = currentLiForH2.querySelector('ul');
          if (!sub2) { sub2 = document.createElement('ul'); sub2.className = 'post-toc-sublist'; currentLiForH2.appendChild(sub2); }
          sub2.appendChild(li);
        } else if (currentLiForH1) {
          var subFallback = currentLiForH1.querySelector('ul');
          if (!subFallback) { subFallback = document.createElement('ul'); subFallback.className = 'post-toc-sublist'; currentLiForH1.appendChild(subFallback); }
          subFallback.appendChild(li);
        } else {
          ul.appendChild(li);
        }
      }
    });

    listContainer.appendChild(ul);
    tocContainer.hidden = false;

    // Move TOC into sidebar on wide screens
    var sidebar = document.getElementById('post-toc-sidebar');
    function layoutTOC() {
      var wide = window.innerWidth >= 980;
      if (wide && sidebar) {
          // move toc into sidebar
          if (!sidebar.contains(tocContainer)) sidebar.appendChild(tocContainer);
          sidebar.setAttribute('aria-hidden', 'false');
          tocContainer.style.display = '';
          // compute header height and set CSS variable so the TOC will stick below the header
          var headerEl = document.querySelector('.site-header');
          var headerHeight = headerEl ? Math.ceil(headerEl.getBoundingClientRect().height) : 72;
          // Add a small gap
          var topOffset = headerHeight + 12;
          // Set a CSS variable instead of inline position/top to avoid layout inconsistencies
          document.documentElement.style.setProperty('--toc-top', topOffset + 'px');
        } else {
        // move toc back into header (as fallback)
        var header = document.querySelector('.post-header');
        if (header && !header.contains(tocContainer)) header.insertBefore(tocContainer, header.querySelector('.post-meta').nextSibling);
        if (sidebar) sidebar.setAttribute('aria-hidden', 'true');
          // remove the CSS variable when returning to inline mode
          document.documentElement.style.removeProperty('--toc-top');
      }
    }
    layoutTOC();
    window.addEventListener('resize', function () { layoutTOC(); });

    // Toggle collapse behavior for the TOC
    var toggle = tocContainer.querySelector('.toc-toggle');
    var listEl = listContainer;
    if (toggle) {
      toggle.addEventListener('click', function () {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', (!expanded).toString());
        if (expanded) {
          listEl.style.display = 'none';
        } else {
          listEl.style.display = '';
        }
      });
    }

    // Scrollspy: highlight active section using IntersectionObserver
    var anchors = tocContainer.querySelectorAll('.post-toc-list a');
    var idToAnchor = {};
    anchors.forEach(function (a) { idToAnchor[a.dataset.targetId] = a; });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.id;
        var anchor = idToAnchor[id];
        if (!anchor) return;
        if (entry.isIntersecting) {
          // remove active from all
          anchors.forEach(function (aa) { aa.classList.remove('active'); });
          anchor.classList.add('active');
        }
      });
    }, { root: null, rootMargin: '-35% 0px -55% 0px', threshold: 0 });

    // observe each heading
    headings.forEach(function (h) { observer.observe(h); });

  } catch (e) {
    console.warn('TOC generation failed', e);
  }
});
