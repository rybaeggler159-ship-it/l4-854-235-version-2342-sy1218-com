(function () {
  var menuToggle = document.querySelector("[data-menu-toggle]");
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      document.body.classList.toggle("menu-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var heroIndex = 0;

  function showHero(index) {
    if (!slides.length) {
      return;
    }
    heroIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, itemIndex) {
      slide.classList.toggle("active", itemIndex === heroIndex);
    });
    dots.forEach(function (dot, itemIndex) {
      dot.classList.toggle("active", itemIndex === heroIndex);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showHero(Number(dot.getAttribute("data-hero-dot")) || 0);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showHero(heroIndex + 1);
    }, 5200);
  }

  function movieCard(movie) {
    var meta = [movie.region, movie.type, movie.year].filter(Boolean).map(function (item) {
      return "<span>" + item + "</span>";
    }).join("");
    return [
      "<article class=\"movie-card search-card\">",
      "<a class=\"poster-link\" href=\"" + movie.url + "\" aria-label=\"" + movie.title + "\">",
      "<img src=\"" + movie.cover + "\" alt=\"" + movie.title + "\" loading=\"lazy\">",
      "<span class=\"poster-shade\"></span>",
      "<span class=\"play-badge\">▶</span>",
      "</a>",
      "<div class=\"movie-card-body\">",
      "<div class=\"meta-row\">" + meta + "</div>",
      "<h3><a href=\"" + movie.url + "\">" + movie.title + "</a></h3>",
      "<p>" + movie.oneLine + "</p>",
      "</div>",
      "</article>"
    ].join("");
  }

  var searchInput = document.getElementById("global-search");
  var searchResults = document.getElementById("search-results");
  var searchClear = document.getElementById("search-clear");

  function renderSearch() {
    if (!searchInput || !searchResults || !window.SITE_MOVIES) {
      return;
    }
    var query = searchInput.value.trim().toLowerCase();
    if (!query) {
      searchResults.innerHTML = "";
      return;
    }
    var items = window.SITE_MOVIES.filter(function (movie) {
      return movie.searchText.indexOf(query) !== -1;
    }).slice(0, 24);
    if (!items.length) {
      searchResults.innerHTML = "<div class=\"no-results\">没有找到相关影片</div>";
      return;
    }
    searchResults.innerHTML = items.map(movieCard).join("");
  }

  if (searchInput) {
    searchInput.addEventListener("input", renderSearch);
  }

  if (searchClear) {
    searchClear.addEventListener("click", function () {
      searchInput.value = "";
      renderSearch();
      searchInput.focus();
    });
  }

  var pageFilter = document.querySelector(".page-filter");
  var sortSelect = document.querySelector(".sort-select");
  var cardList = document.querySelector("[data-card-list]");

  function filterCards() {
    if (!cardList) {
      return;
    }
    var cards = Array.prototype.slice.call(cardList.querySelectorAll(".movie-card"));
    var query = pageFilter ? pageFilter.value.trim().toLowerCase() : "";
    cards.forEach(function (card) {
      var text = [
        card.getAttribute("data-title") || "",
        card.getAttribute("data-region") || "",
        card.getAttribute("data-type") || "",
        card.getAttribute("data-year") || "",
        card.getAttribute("data-genre") || ""
      ].join(" ").toLowerCase();
      card.style.display = text.indexOf(query) === -1 ? "none" : "";
    });
  }

  function sortCards() {
    if (!cardList || !sortSelect) {
      return;
    }
    var cards = Array.prototype.slice.call(cardList.querySelectorAll(".movie-card"));
    var value = sortSelect.value;
    cards.sort(function (a, b) {
      if (value === "newest" || value === "oldest") {
        var yearA = Number(a.getAttribute("data-year")) || 0;
        var yearB = Number(b.getAttribute("data-year")) || 0;
        return value === "newest" ? yearB - yearA : yearA - yearB;
      }
      if (value === "title") {
        return (a.getAttribute("data-title") || "").localeCompare(b.getAttribute("data-title") || "", "zh-Hans-CN");
      }
      return 0;
    });
    cards.forEach(function (card) {
      cardList.appendChild(card);
    });
    filterCards();
  }

  if (pageFilter) {
    pageFilter.addEventListener("input", filterCards);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", sortCards);
  }
})();
