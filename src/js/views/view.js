import icons from 'url:../../img/icons.svg'; // parcel 2

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      // Jeżeli data nie istnieje(null or undefined)  ||(or) jeżeli jest to tablica &&(and) ta tablica ma 0 obiektów to renderError()
      return this.renderError();

    this._data = data; // tutaj pobieramy dane z model.js
    const markup = this._generateMarkup();

    if (!render) return markup;
    // recipeContainer.innerHTML = ``; // czyści cały teks HTML w tym kontenerze
    // Refactored
    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    // porównany HTML stary z nwym i zmienimy tylko zmianione elementy

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // powyższe funkcje tworzą wirtualny element DOM
    const newElements = Array.from(newDOM.querySelectorAll(`*`)); // wirtualny element DOM zapisany w tabeli
    const curElements = Array.from(this._parentElement.querySelectorAll(`*`)); // zeczywisty element DOM zapisny w tabeli

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Update changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ``
      ) {
        // Sprawdz Advenst DOM section (wyjasnienia struktury i metod)
        // jeżeli newEl jest różny od curEl to i jeżeli węzeł jest tekstem
        // console.log(`💥`, newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Update changed ATRIBUTS
      if (!newEl.isEqualNode(curEl)) {
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(
          attr => curEl.setAttribute(attr.name, attr.value) // ustawia warość i atrybut w curEl
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = ``; // bedzie można jej urzywać o ile będą miały class `.recipe`
  }

  renderSpiner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
             <p>${message}</p>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-alert-smile"></use>
              </svg>
            </div>
             <p>${message}</p>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
