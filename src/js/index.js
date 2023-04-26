import { PixabayAPI } from './PixabayAPI';
import createGallery from '../templates/markup-gallery.hbs';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const DEBOUNCE_DELAY_NOTE_USER = 500;
const pixabayApi = new PixabayAPI();
const refs = {
  inputEl: document.querySelector("#search-form"),
  photoListEl: document.querySelector(".gallery")
}

// !==== create object for SimpleLightbox ====

let lightbox = new SimpleLightbox('.gallery__link', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});
// !==== information note for user ====
refs.inputEl.firstElementChild.addEventListener("mouseover", debounce(noteUsers, DEBOUNCE_DELAY_NOTE_USER, {
      leading: true,
      trailing: false,
}));

refs.inputEl.addEventListener("submit", request);

// !==== processing a request from a user ====

function request(event) {
  event.preventDefault();

  const {
    elements: { searchQuery }
  } = event.currentTarget;
  pixabayApi.requestSearch = searchQuery.value.trim();
  refs.photoListEl.innerHTML = "";

  pixabayApi.resetPage();

  if (pixabayApi.requestSearch === "") {
    searchEmpty();
    return;
  }
  searchPhoto();
  return;
}

// !==== Function for seek photo https://pixabay.com/api/

async function searchPhoto() {

try {
  const response = await pixabayApi.getPhotoViaRequest();
  const { totalHits, hits } = response.data;

  if (totalHits === 0) {
    noImagesFinded();
    return;
  };

  createMarkup(hits);

  lightbox.refresh();
  autoScroll();


  if (pixabayApi.countPages === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  };

  if (Math.ceil(totalHits / pixabayApi.per_page) > pixabayApi.countPages) {

    if (pixabayApi.countPages === 1) {
      window.addEventListener('scroll', handleScroll);
    }

    pixabayApi.countPages += 1;

  } else {
    if (totalHits <= 40) {
      refs.inputEl.firstElementChild.value = "";
      return;
    }

    if (Math.ceil(totalHits / pixabayApi.per_page) === pixabayApi.countPages) {
      window.removeEventListener('scroll', handleScroll);
      noteUsersEndView();
      return;
    }
  }

} catch (err) {
    sendUserError();
  }
}

// !========================== All functions =====================================

// !==== Function create markup

function createMarkup(array) {
  const markup = createGallery(array);
  refs.photoListEl.insertAdjacentHTML("beforeend", markup);
}
// !==== Function send note user ("Please enter keyword") =======

function noteUsers(event) {
  if (event.target.value === "") {
    Notiflix.Notify.info('Please enter keyword for photos you are looking for')
  }
}

// !==== Function search is empty ====
function searchEmpty() {
  Notiflix.Notify.failure('The search string cannot be empty. Please specify your search query.');
}

// !==== Function send user - no images & clear of input====
function noImagesFinded() {
  Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  refs.inputEl.firstElementChild.value = "";
}

// !==== Function send note user ("reached the end") & clear of input ====

function noteUsersEndView() {
  Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results.");
    refs.inputEl.firstElementChild.value = "";
}

// !==== Function send to user about error ====
function sendUserError() {
Notiflix.Notify.failure("We're sorry, but we received error from server. Please try enter new keyword for photos.");
}

// !==== Function for infinity scroll ====

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    searchPhoto();
  }
}

// !==== Function for autoscroll screen ====

function autoScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}