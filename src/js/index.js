// import { PixabayAPI } from './PixabayAPI';
import createGallery from '../templates/markup-gallery.hbs'
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Notiflix from 'notiflix';
import axios from "axios";
import debounce from 'lodash.debounce';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';



const DEBOUNCE_DELAY_NOTE_USER = 500;
const URL = "https://pixabay.com/api/";
let requestSearch = "";
let countPages = 1;

const refs = {
  inputEl: document.querySelector("#search-form"),
  photoListEl: document.querySelector(".gallery"),
  buttonLoadMore: document.querySelector(".load-more")
}

console.log("inputEl:", refs.inputEl);
console.log("photoListEl:", refs.photoListEl);
console.log("buttonLoadMore:", refs.buttonLoadMore);


const searchParams = new URLSearchParams({
  key: "35599387-daff3be7791dba4aa3b1a02ca",
  image_type: "photo",
  orientation: "horizontal",
  safesearch: true,
  per_page: 40,
});

refs.inputEl.addEventListener("mouseover", debounce(noteUsers, DEBOUNCE_DELAY_NOTE_USER, {
      leading: true,
      trailing: false,
}));

// !========== создание класса для SimpleLightbox (разбираться!!!)
let lightbox = new SimpleLightbox('.gallery__link', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

refs.inputEl.addEventListener("submit", request);

function request(event) {
  event.preventDefault();
  const {
    elements: { searchQuery }
  } = event.currentTarget;
  requestSearch = searchQuery.value.trim();
  refs.photoListEl.innerHTML = "";
  countPages = 1;
  refs.buttonLoadMore.classList.add("load-more");

  if (requestSearch === "") {
    console.log('The search string cannot be empty. Please specify your search query.');
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }

  searchPhoto()
}

async function searchPhoto(){
try {
  const response = await getPhotoViaRequest();
  console.log("searchPhoto() countPages==>>", countPages);
  console.log("response", response);
  console.log("response.data", response.data);
  console.log("response.data.totalHits ==>>", response.data.totalHits);
  const { totalHits, hits } = response.data;
  console.log("file: index.js:74 ~ searchPhoto ~ hits:", hits);
  console.log("file: index.js:74 ~ searchPhoto ~ totalHits, :", totalHits,);
  if (totalHits === 0) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    return
      };
  createMarkup(hits);

  lightbox.refresh();

  if (countPages === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  };


  if (Math.ceil(totalHits / 40) > countPages ) {
    countPages += 1;
    console.log("выполнился первый if", countPages);
    if (countPages === 2) {
    console.log("выполнился второй if", countPages);
    refs.buttonLoadMore.classList.remove("load-more");
    refs.buttonLoadMore.addEventListener("click", searchPhoto);
    }

  } else {
    refs.buttonLoadMore.classList.add("load-more");
    refs.buttonLoadMore.removeEventListener("click", searchPhoto);
    Notiflix.Notify.warning(
    "We're sorry, but you've reached the end of search results.")
  }
} catch (err) {

    console.log(err);
  }
}

// !========================== Functions =====================================

function getPhotoViaRequest() {
  console.log("requestSearch:", requestSearch, "CountPage:", countPages);
  return axios.get(`${URL}?${searchParams}&q=${requestSearch}&page=${countPages}`)
}


function createMarkup(array) {
  const markup = createGallery(array);
  refs.photoListEl.insertAdjacentHTML("beforeend", markup);
}

function noteUsers(event) {
  console.log("event.target.value ===>>>>", event.target.value);
  if (event.target.value === "") {
    Notiflix.Notify.info('Please enter keyword for photos you are looking for')
  }
}