import icons from 'url:../../img/icons.svg';
import View from './view.js';
import previewView from './previewView.js';

// E297 ///////////////////////////////////////////////////////
class ResultsView extends View {
  // dodając `extends` i wskazując clase rodzica mamy dostęp do wszstkich metod i danych z rodzica (view.js)
  _parentElement = document.querySelector(`.results`);
  _errorMessage = `No recipes found for your query!`;
  _message = ``;

  _generateMarkup() {
    // console.log(this._data);
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new ResultsView();
