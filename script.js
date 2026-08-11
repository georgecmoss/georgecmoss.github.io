document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  loadLatestPosts();
  loadGoodreads();
  renderBooksChart();
  initSlideshows();
  initEasterEgg();
});

// A little fun for anyone who opens devtools, plus a hidden click
// interaction on the glowing dot in the current-line.
function initEasterEgg() {
  console.log(
    '%c⚡ Currently exploring the source, are you? ',
    'background: linear-gradient(90deg, #a16207, #a90707); color: #f1e9d8; padding: 6px 12px; border-radius: 4px; font-family: monospace; font-size: 13px;'
  );
  console.log(
    '%cLike what you see? I\'m always up for talking energy, code, or both: moss.george.c@gmail.com',
    'color: #a16207; font-family: monospace; font-size: 12px;'
  );

  document.querySelectorAll('.current-dot').forEach(function (dot) {
    dot.style.cursor = 'pointer';
    dot.addEventListener('click', function () {
      dot.classList.remove('spark');
      // Force reflow so the animation can restart on repeated clicks
      void dot.offsetWidth;
      dot.classList.add('spark');
    });
  });
}

// Pulls the latest posts from each Substack RSS feed via rss2json (a free
// proxy that works around browsers blocking direct cross-site RSS requests).
// If a feed fails to load, the card just falls back to its static copy,
// nothing breaks.
function loadLatestPosts() {
  var lists = document.querySelectorAll('.writing-posts[data-feed]');
  var POST_COUNT = 3;

  lists.forEach(function (list) {
    var feedUrl = list.getAttribute('data-feed');
    var apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feedUrl);

    fetch(apiUrl)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.status !== 'ok' || !data.items || !data.items.length) {
          throw new Error('Feed unavailable');
        }
        list.innerHTML = '';
        data.items.slice(0, POST_COUNT).forEach(function (item) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = item.link;
          a.target = '_blank';
          a.rel = 'noopener';
          a.textContent = item.title;
          li.appendChild(a);

          if (item.pubDate) {
            var d = new Date(item.pubDate);
            var daysOld = (Date.now() - d.getTime()) / 86400000;

            var meta = document.createElement('span');
            meta.className = 'post-date';
            meta.textContent = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            li.appendChild(meta);

            if (daysOld <= 7) {
              var badge = document.createElement('span');
              badge.className = 'post-new-badge';
              badge.textContent = 'New';
              li.appendChild(badge);
            }
          }

          list.appendChild(li);
        });
      })
      .catch(function () {
        // Leave the list empty; CSS hides an empty <ul>, so the card
        // quietly shows just its static description and Substack link.
        list.innerHTML = '';
      });
  });
}

// Pulls recent books from a public Goodreads shelf via RSS (same rss2json
// proxy trick as the Substack feeds above). Only runs on pages that have
// a #feed-goodreads element (resources.html).
function loadGoodreads() {
  var container = document.getElementById('feed-goodreads');
  if (!container) return;

  var userId = container.getAttribute('data-goodreads-id');
  var shelf = container.getAttribute('data-goodreads-shelf') || 'read';
  var profileUrl = 'https://www.goodreads.com/user/show/' + userId;
  var feedUrl = 'https://www.goodreads.com/review/list_rss/' + userId + '?shelf=' + encodeURIComponent(shelf);
  var apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feedUrl);
  var BOOK_COUNT = 6;

  fetch(apiUrl)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.status !== 'ok' || !data.items || !data.items.length) {
        throw new Error('Goodreads feed unavailable');
      }
      container.innerHTML = '';
      data.items.slice(0, BOOK_COUNT).forEach(function (item) {
        var card = document.createElement('a');
        card.className = 'radar-item radar-item-book';
        card.href = item.link;
        card.target = '_blank';
        card.rel = 'noopener';
        card.style.borderColor = 'rgba(161,98,7,0.25)';

        if (item.thumbnail) {
          var img = document.createElement('img');
          img.src = item.thumbnail;
          img.alt = '';
          img.loading = 'lazy';
          card.appendChild(img);
        }

        var info = document.createElement('div');
        info.className = 'book-info';

        var h3 = document.createElement('h3');
        h3.textContent = item.title;
        info.appendChild(h3);

        if (item.pubDate) {
          var p = document.createElement('p');
          var d = new Date(item.pubDate);
          p.textContent = 'Read ' + d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
          info.appendChild(p);
        }

        card.appendChild(info);
        container.appendChild(card);
      });
    })
    .catch(function () {
      container.innerHTML =
        '<div class="radar-item" style="border-color: rgba(161,98,7,0.25);">' +
        '<h3>Reading list unavailable right now</h3>' +
        '<p>Check my <a href="' + profileUrl + '" target="_blank" rel="noopener">Goodreads profile</a> directly.</p>' +
        '</div>';
    });
}

// Books read per year. Goodreads' RSS feed (used above for the reading
// list) only returns your ~20 most recent shelf additions, not full
// history, so this can't be pulled live and accurately. Edit these
// numbers by hand whenever you want the chart to reflect reality.
var booksReadByYear = {
  2020: 61,
  2021: 33,
  2022: 33,
  2023: 26,
  2024: 20,
  2025: 28,
  2026: 17
};

function renderBooksChart() {
  var container = document.getElementById('books-chart');
  if (!container) return;

  var years = Object.keys(booksReadByYear);
  var counts = years.map(function (y) { return booksReadByYear[y]; });
  var max = Math.max.apply(null, counts);

  var html = '<div class="books-chart-bars">';
  years.forEach(function (year) {
    var count = booksReadByYear[year];
    var pct = max > 0 ? Math.round((count / max) * 100) : 0;
    html +=
      '<div class="books-chart-col">' +
      '<span class="books-chart-count">' + count + '</span>' +
      '<div class="books-chart-bar" style="height:' + pct + '%"></div>' +
      '<span class="books-chart-year">' + year + '</span>' +
      '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
}

// Simple prev/next/dot-driven slideshow for the small photo galleries
// inside Work entries. Supports any number of slides, though currently
// only used with two.
function initSlideshows() {
  document.querySelectorAll('[data-slideshow]').forEach(function (root) {
    var slides = root.querySelectorAll('.slide');
    var dots = root.querySelectorAll('.dot');
    var prevBtn = root.querySelector('.slide-prev');
    var nextBtn = root.querySelector('.slide-next');
    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { show(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(current + 1); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { show(i); });
    });
  });
}
