import createGallery from '../templates/markup-gallery.hbs'
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import axios from "axios";
// import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const DEBOUNCE_DELAY_NOTE_USER = 500;
const URL = "https://pixabay.com/api/"

const refs = {
  inputEl: document.querySelector("#search-form"),
  photoListEl: document.querySelector(".gallery")
}
console.log("inputEl:", refs.inputEl);
console.log("photoListEl:", refs.photoListEl);

// const options = {
//   key: "35599387-daff3be7791dba4aa3b1a02ca",
//   image_type: "photo",
//   orientation: "horizontal",
//   safesearch: true,
//   q: "",
// }

const searchParams = new URLSearchParams({
  key: "35599387-daff3be7791dba4aa3b1a02ca",
  image_type: "photo",
  orientation: "horizontal",
  safesearch: true
});

refs.inputEl.addEventListener("submit", searchPhoto);
// https://pixabay.com/api/
// ?key = 35599387-daff3be7791dba4aa3b1a02ca & q=yellow + flowers & image_type=photo
function searchPhoto(event) {
  event.preventDefault();
  const {
    elements: {searchQuery }
  } = event.currentTarget;
  const q = searchQuery.value.trim();

  if (q === "") return
  // console.log("event", searchParams);
  // console.log(JSON.stringify(options));
  fetch(`${URL}?${searchParams}&q=${q}`)
    .then(response => response.json())
    .then(data => {
      const arrPhoto = data.hits;
      console.log(arrPhoto);
      createMarkup(arrPhoto);


      // const markup = items.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads, id }) =>
      // `<div>
      //  <img src="${webformatURL}" alt="${tags}" width="200" height="100" >
      //  <p>likes: ${likes}</p>
      //  <p>views: ${views}</p>
      //  <p>comments: ${comments}</p>
      //  <p>downloads: ${downloads}</p>
      //  </div>`
      // )
      //   .join('');
      // console.log("markup", markup);
      // refs.photoListEl.insertAdjacentHTML("beforeend", markup);

      })
}

function createMarkup(array) {
  const markup = createGallery(array);
  refs.photoListEl.insertAdjacentHTML("beforeend", markup);
}