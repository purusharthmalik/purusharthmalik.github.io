document.addEventListener('DOMContentLoaded', function () {
  try {
    var tocContainer = document.getElementById('post-toc');
    if (!tocContainer) return;

    var content = document.querySelector('.post-content');
    if (!content) return;

    // Select headings to include in TOC. Exclude the H1 (post title).
    var headings = content.querySelectorAll('h2, h3');
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

    var currentLiForH2 = null;

    headings.forEach(function (h) {
      var level = h.tagName.toLowerCase();
      var text = h.textContent || h.innerText;
      if (!text) return;
      if (!h.id) {
        h.id = slugify(text);
      }
      var li = document.createElement('li');
      li.className = level === 'h2' ? 'toc-level-2' : 'toc-level-3';
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = text;
      a.addEventListener('click', function (e) {
        // smooth scroll
        e.preventDefault();
        var target = document.getElementById(h.id);
        if (target) {
          window.history.pushState(null, '', '#' + h.id);
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      li.appendChild(a);

      if (level === 'h2') {
        ul.appendChild(li);
        currentLiForH2 = li;
      } else if (level === 'h3') {
        // nest under last H2 if exists
        if (!currentLiForH2) {
          ul.appendChild(li);
        } else {
          var sub = currentLiForH2.querySelector('ul');
          if (!sub) {
            sub = document.createElement('ul');
            sub.className = 'post-toc-sublist';
            currentLiForH2.appendChild(sub);
          }
          sub.appendChild(li);
        }
      }
    });

    listContainer.appendChild(ul);
    tocContainer.hidden = false;

    // Toggle collapse behavior
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
  } catch (e) {
    console.warn('TOC generation failed', e);
  }
});
