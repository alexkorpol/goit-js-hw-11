import axios from "axios";
export class PixabayAPI {
  #URL = "https://pixabay.com/api/";
  #requestSearch = "";

  constructor() {
    this.countPages = 1;
    this.per_page = 40;

    this.searchParams = new URLSearchParams({
  key: "35599387-daff3be7791dba4aa3b1a02ca",
  image_type: "photo",
  orientation: "horizontal",
  safesearch: true,
  per_page: 40,
});

  }

getPhotoViaRequest() {
  return axios.get(`${this.#URL}?${this.searchParams}&q=${this.#requestSearch}&page=${this.countPages}`)
}
  
  resetPage() {
    this.countPages = 1;
  }
  get requestSearch() {
    return this.#requestSearch;
  }

  set requestSearch(newRequestSearch) {
    this.#requestSearch = newRequestSearch;
  }
}

