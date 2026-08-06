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
});

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
