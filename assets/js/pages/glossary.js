(function () {
  var search = document.getElementById('glossary-search');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.glossary-list .gk-card'));

  if (search) {
    search.addEventListener('input', function () {
      var query = search.value.trim().toLowerCase();
      cards.forEach(function (card) {
        card.hidden = Boolean(query && card.textContent.toLowerCase().indexOf(query) === -1);
      });
    });
  }

  document.querySelectorAll('nav[aria-label="Glossary letters"] a').forEach(function (link) {
    link.addEventListener('click', function () {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
