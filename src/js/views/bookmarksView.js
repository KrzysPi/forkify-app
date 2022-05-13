import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
// E297 ///////////////////////////////////////////////////////
class BookmarksView extends View {
  // dodając `extends` i wskazując clase rodzica mamy dostęp do wszstkich metod i danych z rodzica (view.js)
  _parentElement = document.querySelector(`.bookmarks__list`);
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it!`;
  _message = ``;

  addHandlerRender(handler) {
    window.addEventListener(`load`, handler);
  }

  _generateMarkup() {
    // console.log(this._data);
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}
export default new BookmarksView();
