(function () {
  const data = window.MOVIE_SEARCH_DATA || [];
  const form = document.querySelector('[data-search-form]');
  const input = document.querySelector('[data-search-input]');
  const results = document.querySelector('[data-search-results]');
  const meta = document.querySelector('[data-search-meta]');

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function render(items, keyword) {
    if (!results || !meta) {
      return;
    }

    meta.textContent = keyword ? `找到 ${items.length} 条与“${keyword}”相关的影片` : '输入关键词后显示匹配结果。';

    results.innerHTML = items.slice(0, 240).map(function (movie) {
      const tags = [movie.category, movie.genre, movie.region, movie.year].filter(Boolean).slice(0, 4);
      return `
        <article class="movie-card compact" data-card>
          <a class="poster" href="${escapeHtml(movie.url)}" aria-label="${escapeHtml(movie.title)}">
            <img src="./${escapeHtml(movie.cover)}" alt="${escapeHtml(movie.title)}" loading="lazy" />
            <span class="play-dot">▶</span>
            <span class="year-badge">${escapeHtml(movie.year)}</span>
          </a>
          <div class="card-body">
            <a class="card-title" href="${escapeHtml(movie.url)}">${escapeHtml(movie.title)}</a>
            <p>${escapeHtml(movie.oneLine)}</p>
            <div class="tag-row">${tags.map(function (tag) { return `<span>${escapeHtml(tag)}</span>`; }).join('')}</div>
          </div>
        </article>`;
    }).join('');
  }

  function search(keyword) {
    const value = keyword.trim().toLowerCase();

    if (!value) {
      render([], '');
      return;
    }

    const items = data.filter(function (movie) {
      const text = [
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        movie.category,
        movie.oneLine,
        (movie.tags || []).join(' ')
      ].join(' ').toLowerCase();
      return text.includes(value);
    });

    render(items, keyword.trim());
  }

  if (form && input) {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get('q') || '';
    input.value = initial;
    search(initial);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const keyword = input.value.trim();
      const url = keyword ? `search.html?q=${encodeURIComponent(keyword)}` : 'search.html';
      window.history.replaceState(null, '', url);
      search(keyword);
    });

    input.addEventListener('input', function () {
      search(input.value);
    });
  }
})();
