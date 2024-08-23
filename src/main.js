import { fetchGallery } from './js/pixabay-api.js';
import { renderGallery } from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import './css/loader.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loaderTop = document.querySelector('#loader-top');
const loaderBottom = document.querySelector('#loader-bottom');
const loadMoreBtn = document.querySelector('.js-load-more-btn');
let simpleLightbox;
let page = 1;
let currentQuery = '';

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();

  const query = event.target.elements.query.value.trim();

  if (query === '') {
    iziToast.info({
      message: 'Search query cannot be empty!',
      position: 'center',
    });
    return;
  }

  gallery.innerHTML = '';
  loaderTop.classList.remove('hidden');
  loadMoreBtn.classList.add('hidden');
  page = 1;

  try {
    const data = await fetchGallery(query, page);
    loaderTop.classList.add('hidden');

    if (data.hits.length === 0) {
      iziToast.info({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'center',
      });
      return;
    }

    renderGallery(data.hits);

    simpleLightbox = new SimpleLightbox('.gallery a');
    simpleLightbox.refresh();

    if (data.hits.length < 15) {
      loadMoreBtn.classList.add('hidden');
      iziToast.info({
        message: "You've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      loadMoreBtn.classList.remove('hidden');
    }

    page += 1;
    currentQuery = query;
  } catch (error) {
    loaderTop.classList.add('hidden');

    iziToast.error({
      title: 'Error',
      message: error.message,
      position: 'center',
    });
  }
}

async function onLoadMore(event) {
  event.preventDefault();
  loaderBottom.classList.remove('hidden');
  loadMoreBtn.classList.add('hidden');

  try {
    const data = await fetchGallery(currentQuery, page);

    renderGallery(data.hits);

    simpleLightbox.refresh();

    page += 1;

    if (page * 15 >= data.totalHits || data.hits.length < 15) {
      loadMoreBtn.classList.add('hidden');
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      loadMoreBtn.classList.remove('hidden');
    }

    loaderBottom.classList.add('hidden');

    smoothScroll();
  } catch (error) {
    loaderBottom.classList.add('hidden');
    iziToast.error({
      title: 'Error',
      message: error.message,
      position: 'center',
    });
  }
}

function smoothScroll() {
  const firstCard = gallery.firstElementChild;

  if (!firstCard) return;

  const firstCardRect = firstCard.getBoundingClientRect();
  const cardHeight = firstCardRect.height;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
