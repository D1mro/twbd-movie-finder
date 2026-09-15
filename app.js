const API_KEY = 'd2daecb9e8c8de8243aa323db239e842';

const grid = document.getElementById('grid');
const statusEl = document.getElementById('status');
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');

function showMovies(movies) {
  if (!movies || movies.length === 0) {
    statusEl.hidden = false;
    statusEl.textContent = 'Ничего не найдено';
    grid.innerHTML = '';
    return;
  }

  statusEl.hidden = true;

  grid.innerHTML = movies.map(movie => `
    <div class="card">
      <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w342' + movie.poster_path : 'https://placehold.co/342x513?text=No+Poster'}" alt="${movie.title}">
      <div class="card-body">
        <div class="card-title">${movie.title}</div>
        <div class="card-meta">
          <span>${(movie.release_date || '—').slice(0, 4)}</span>
          <span class="card-rating">★ ${movie.vote_average ? movie.vote_average.toFixed(1) : '—'}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function loadMovies(url) {
  statusEl.hidden = false;
  statusEl.textContent = 'Загрузка...';

  fetch(url)
    .then(response => response.json())
    .then(data => showMovies(data.results))
    .catch(() => {
      statusEl.textContent = 'Ошибка загрузки данных';
    });
}

loadMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ru-RU`);

form.addEventListener('submit', event => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) return;
  loadMovies(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ru-RU&query=${query}`);
});
