const API_KEY = 'd2daecb9e8c8de8243aa323db239e842';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w342';

const grid = document.getElementById('grid');
const statusEl = document.getElementById('status');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

function setStatus(text) {
  if (!text) {
    statusEl.hidden = true;
    statusEl.textContent = '';
    return;
  }
  statusEl.hidden = false;
  statusEl.textContent = text;
}

function renderMovies(movies) {
  grid.innerHTML = '';

  if (!movies || movies.length === 0) {
    setStatus('Ничего не найдено');
    return;
  }

  setStatus('');

  const fragment = document.createDocumentFragment();

  for (const movie of movies) {
    const card = document.createElement('div');
    card.className = 'card';

    const poster = movie.poster_path
      ? `${IMG_URL}${movie.poster_path}`
      : 'https://placehold.co/342x513?text=No+Poster';

    const year = movie.release_date ? movie.release_date.slice(0, 4) : '—';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '—';

    card.innerHTML = `
      <img src="${poster}" alt="${movie.title}" loading="lazy" />
      <div class="card-body">
        <div class="card-title">${movie.title}</div>
        <div class="card-meta">
          <span>${year}</span>
          <span class="card-rating">★ ${rating}</span>
        </div>
      </div>
    `;

    fragment.appendChild(card);
  }

  grid.appendChild(fragment);
}

async function request(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'ru-RU');

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url);

  if (response.status === 401) {
    throw new Error('Неверный или просроченный API-ключ');
  }

  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status}`);
  }

  return response.json();
}

async function loadPopular() {
  setStatus('Загрузка популярных фильмов...');
  try {
    const data = await request('/movie/popular');
    renderMovies(data.results);
  } catch (error) {
    setStatus(error.message);
  }
}

async function searchMovies(query) {
  setStatus('Поиск...');
  try {
    const data = await request('/search/movie', { query });
    renderMovies(data.results);
  } catch (error) {
    setStatus(error.message);
  }
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    searchMovies(query);
  } else {
    loadPopular();
  }
});

loadPopular();
