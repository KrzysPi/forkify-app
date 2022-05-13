class SearchView {
  _parentEl = document.querySelector(`.search`);

  getQuery() {
    const query = this._parentEl.querySelector(`.search__field`).value; // pobiera z DOM tekst wpisany w okno wyszukiwania
    this._cleareInput(); //czyći pole tekstowe
    return query;
  }

  _cleareInput() {
    this._parentEl.querySelector(`.search__field`).value = ``;
  }

  addHandlerSearch(handeler) {
    // this will be a publisher

    this._parentEl.addEventListener(`submit`, function (e) {
      // po naciśnięciu submit (dzięki temu że możemy wpisać `submit` zamiast `click` to możemy nasłuchiwać na sałym parentElement)
      e.preventDefault(); // wstrzymujemy automatyczne odświerzanie // when we submit form we need to prevent default actions
      handeler(); // it will be controllSearchResult function
    });
  }
}
export default new SearchView();
