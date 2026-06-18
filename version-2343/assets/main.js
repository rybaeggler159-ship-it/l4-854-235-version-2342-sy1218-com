(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.site-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        nav.classList.toggle('is-open');
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var index = 0;

    function showSlide(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(index + 1);
      }, 5600);
    }

    var filterAreas = Array.prototype.slice.call(document.querySelectorAll('[data-filter-area]'));
    filterAreas.forEach(function (area) {
      var input = area.querySelector('[data-search-input]');
      var selects = Array.prototype.slice.call(area.querySelectorAll('[data-filter-select]'));
      var cards = Array.prototype.slice.call(area.querySelectorAll('.movie-card'));
      var empty = area.querySelector('.empty-state');

      function normalize(value) {
        return String(value || '').trim().toLowerCase();
      }

      function applyFilters() {
        var keyword = normalize(input ? input.value : '');
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.dataset.title,
            card.dataset.region,
            card.dataset.type,
            card.dataset.year,
            card.dataset.genre,
            card.dataset.category
          ].map(normalize).join(' ');

          var matched = !keyword || haystack.indexOf(keyword) !== -1;
          selects.forEach(function (select) {
            var key = select.getAttribute('data-filter-select');
            var value = normalize(select.value);
            if (value && normalize(card.dataset[key]) !== value) {
              matched = false;
            }
          });

          card.style.display = matched ? '' : 'none';
          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      if (input) {
        input.addEventListener('input', applyFilters);
      }
      selects.forEach(function (select) {
        select.addEventListener('change', applyFilters);
      });
      applyFilters();
    });
  });
})();
