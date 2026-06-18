(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var minis = Array.prototype.slice.call(document.querySelectorAll('[data-hero-jump]'));
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  function startHero() {
    if (timer) {
      clearInterval(timer);
    }
    if (slides.length > 1) {
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.getAttribute('data-hero-dot') || 0));
      startHero();
    });
  });

  minis.forEach(function (mini) {
    mini.addEventListener('mouseenter', function () {
      showSlide(Number(mini.getAttribute('data-hero-jump') || 0));
      startHero();
    });
  });

  startHero();

  function filterCards(scope, query, selected) {
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.searchable-card'));
    var q = (query || '').trim().toLowerCase();
    var filter = selected || '全部';
    cards.forEach(function (card) {
      var text = (card.getAttribute('data-search') || '').toLowerCase();
      var tags = card.getAttribute('data-tags') || '';
      var kind = card.getAttribute('data-kind') || '';
      var textMatch = !q || text.indexOf(q) !== -1;
      var filterMatch = filter === '全部' || tags.indexOf(filter) !== -1 || kind.indexOf(filter) !== -1 || text.indexOf(filter.toLowerCase()) !== -1;
      card.style.display = textMatch && filterMatch ? '' : 'none';
    });
  }

  document.querySelectorAll('.search-panel').forEach(function (panel) {
    var input = panel.querySelector('.search-input');
    var buttons = Array.prototype.slice.call(panel.querySelectorAll('.filter-btn'));
    var selected = '全部';
    var scope = document;
    if (input) {
      input.addEventListener('input', function () {
        filterCards(scope, input.value, selected);
      });
    }
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        selected = button.getAttribute('data-filter') || '全部';
        buttons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        filterCards(scope, input ? input.value : '', selected);
      });
    });
  });

  var heroSearch = document.querySelector('.hero-search-input');
  if (heroSearch) {
    heroSearch.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && heroSearch.value.trim()) {
        var target = document.querySelector('.search-input');
        if (target) {
          target.value = heroSearch.value.trim();
          target.dispatchEvent(new Event('input'));
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }
})();
