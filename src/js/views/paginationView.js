import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const btnNext = `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>`;
    // do powyższego HTML dodliśmy `data-goto="${curPage + 1}" żeby muc to zczytać do zmiennej goToPage (linia 54)

    const btnPrev = `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>`;
    // console.log(numPages);

    const numPagesView = `<span class="num__pages"> ${numPages} pages</span>`;

    // Page 1 there are other pages
    if (curPage === 1 && numPages > 1) {
      return btnNext + numPagesView;
    }

    //  Last page
    if (curPage === numPages && numPages > 1) {
      return btnPrev + numPagesView;
    }
    // Other page
    if (curPage < numPages) {
      return btnPrev + btnNext + numPagesView;
    }
    // Page one there are NO other pages
    return ``;
  }

  addHandlerClick(hendler) {
    this._parentElement.addEventListener(`click`, function (e) {
      const btn = e.target.closest(`.btn--inline`);
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      hendler(goToPage); // hendler = controlPagination z controll.js
    });
  }
}
export default new PaginationView();
