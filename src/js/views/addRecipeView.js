import View from './view.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');

  // E308
  _message = `Recipe was successfully uploaded :)`;

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnUpload = document.querySelector('.btn upload__btn');

  constructor() {
    super(); // it is child class so we need super(), dzieki temu możemy używać this key word
    this._addHendlerShowWindow();
    this._addHendlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden'); // w tym wypadku `this` wskazuje na button wić musimy przeżucić do odrębnej metody  // togle zmiania stan w zależności od stanu początkowego (jeżeli było hidden to zamiania na nie ma i odwrotnie)
    this._window.classList.toggle('hidden');
  }

  _addHendlerShowWindow() {
    this._btnOpen.addEventListener(
      'click',
      this.toggleWindow.bind(this) // dzieki temu przypisujemy `this` do funkcji toggleWindow
      //  function () {
      //   this._overlay.classList.toggle(`hidden`); // w tym wypadku `this` wskazuje na button wić musimy przeżucić do odrębnej metody  // togle zmiania stan w zależności od stanu początkowego (jeżeli było hidden to zamiania na nie ma i odwrotnie)
      //   this._window.classList.toggle(`hidden`);
      // }
    );
  }

  _addHendlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerUploadRecipe(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // zwraca Arr ze wsztskimi polami i ich wartościami
      const data = Object.fromEntries(dataArr); // zamianiea Arr na Obj
      handler(data); // hendler() is controlAddRecipe form controll.js
      // console.log(data);
    });
  }

  _generateMarkup() {}
}
export default new AddRecipeView();
