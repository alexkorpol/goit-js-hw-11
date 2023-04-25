import createGallery from '../templates/markup-gallery.hbs';
import Notiflix from 'notiflix';
import axios from "axios";
import debounce from 'lodash.debounce';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const DEBOUNCE_DELAY_NOTE_USER = 500;
const URL = "https://pixabay.com/api/";
let requestSearch = "";
let countPages = 1;
const per_page = 40;

const refs = {
  inputEl: document.querySelector("#search-form"),
  photoListEl: document.querySelector(".gallery")
}

const searchParams = new URLSearchParams({
  key: "35599387-daff3be7791dba4aa3b1a02ca",
  image_type: "photo",
  orientation: "horizontal",
  safesearch: true,
  per_page: 40,
});

// !==== create object for SimpleLightbox ====

let lightbox = new SimpleLightbox('.gallery__link', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});
// !==== information
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
  requestSearch = searchQuery.value.trim();
  refs.photoListEl.innerHTML = "";
  countPages = 1;

  if (requestSearch === "") {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }

  searchPhoto();
  return;
}

// !==== Function for seek photo https://pixabay.com/api/

async function searchPhoto() {

try {
  const response = await getPhotoViaRequest();
  const { totalHits, hits } = response.data;

  if (totalHits === 0) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    return;
  };

  createMarkup(hits);

  lightbox.refresh();
  autoScroll();

  if (countPages === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

  if (totalHits <= 40) {
    noteUsersEndView();
    return;
  };
  };

  if (Math.ceil(totalHits / per_page) > countPages) {

    if (countPages === 1) {
      window.addEventListener('scroll', handleScroll);
    }
    countPages += 1;

  } else {
    if (Math.ceil(totalHits / per_page) - countPages === 0) {
      window.removeEventListener('scroll', handleScroll);
      noteUsersEndView();
      return;
    }
  }

} catch (err) {
    console.log(err);
  }
}

// !========================== All functions =====================================

// !==== Function get request for user

function getPhotoViaRequest() {
  return axios.get(`${URL}?${searchParams}&q=${requestSearch}&page=${countPages}`)
}

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

// !==== Function send note user ("reached the end") & clear of input ====

function noteUsersEndView() {
  Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results.");
    refs.inputEl.firstElementChild.value = "";
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