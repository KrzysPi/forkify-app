import * as model from './model.js'; // importuje wszystko (*), zapisuje jako model z pliku znajdującego się w tym foldeże (./) o nazwie model.js
import { MODEL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// import icons from '../img/icons.svg'// parcel 1

import 'core-js/stable'; // polyfills everything else (polyfills - modyfikuje nowe funkcje na stare, takie które będą możliwe do odczytania przez starsze przeglądarki)
import 'regenerator-runtime/runtime'; // polyfills single waight

if (module.hot) {
  module.hot.accept(); // ta komenda pochodzi z parcel (powoduje, że strona się nie odświerza)
}
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// E288 ////////////// Loading recepies from API
// E289 ////////////// Renderin the recipie ////////////////
// w terminalu `npm i core-js regenerator-runtime`- instaluje te 2 paczki odpowiedzialne za polly filing
// importujemy je do js na samej góre tego pliku
// dzięki temu nasza strona bedzie obsługiwana przez większość przeglądarek

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return; // zapobiega powstawaniu błędu ze względu na brak id (jak wkleimy aders bez id)
    recipeView.renderSpiner();

    // 0) Update results view to mark selected search result //E302
    resultsView.update(model.getSearchResultPage());

    // 1)Updateing bookmarks view
    // debugger; // kod idzie po kolei w consoli zakładka sources
    bookmarksView.update(model.state.bookmarks);

    // 2) loading recipe
    await model.loadRecipe(id); // funcja loadRecipe nie zwraca nic dlatego jej nie zapisujemy do nowej zmiennej
    // zamiast tego zapisuje ona dane w pliku model.js w zmiennej state.recipe
    // żeby zwrócić te dane musimy zapisać w zminnej obiekt z pliku model.js

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

// E296 //////////////////////
const controlSerchResults = async function () {
  // subscriber
  try {
    resultsView.renderSpiner();
    // console.log(recipeView);

    // 1. Get search quary
    const query = searchView.getQuery(); // pobiera wpisane dane z DOM (searchView.js)
    if (!query) return; // Jeżeli nie ma query kończy pracę natychmiastowo

    // 2. Load search results
    await model.loadSearchResults(query); // pobiera z model.js obiekt z danymi dotyczącymi danego zapytania

    // 3. Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage(1));

    // 4. render initial pagination buttons

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1. Render NEW results
  resultsView.render(model.getSearchResultPage(goToPage));

  // 2. render NEW pagination buttons
  paginationView.render(model.state.search);
};

// E301 /////////////////////////// Update recipe servings /////////////////////
// All control functions are simply event hendlers
// services - ilość dań/osób
// 1. tworzymy controlServings a. =>
// 2. tworzymy updateServings (model.js) =>
// 3. tworzymy controlServings b. =>
// 4. tworzymy addHandlerUpdateServices (recipeView.js)=>
// 5. Zmieniemy w recipeView tekst HTML dodając data-update-to=""

const controlServings = function (newServings = 4) {
  // a. Update recipe servings in the state
  model.updateSevings(newServings); // delegujemy (tworzymy metode w model.js)
  // b. Update the recipe view
  // recipeView.render(model.state.recipe);

  // E302 /////////////////// DOM Update algoritm (nie ładuje wszystkich elementów od nowa) ////////////////////////////////

  recipeView.update(model.state.recipe);
};

// E303 ////////////////////// bookmark

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update rcipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// E308 //////////////////////////////////////////////////
const controlAddRecipe = async function (newRecipe) {
  // sends recipe to model.js which Uploads recipe to API
  // console.log(newRecipe);
  try {
    // Schow loading spinner
    addRecipeView.renderSpiner();

    // Update new recipe data
    await model.uploadRecipe(newRecipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmarkView
    bookmarksView.render(model.state.bookmarks);
    // urzywamy rende nie upadet bo musimy dodać do bookmarks

    // Change ID in URL
    window.history.pushState(null, ``, `#${model.state.recipe.id}`);
    // pushState (state, title, URL )
    // window.history.back() - pozwala nam wrócić do poprzedniej strony

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`💥`, err);
    addRecipeView.renderError(err.message);
  }
  location.reload();
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServices(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSerchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUploadRecipe(controlAddRecipe);
  // addRecipeView._addHandlerUploadRecipe(data);
};
init();

// Controller is a hedeler of functions (connect model and ...Viwe)
