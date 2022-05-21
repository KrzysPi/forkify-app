import { async } from 'regenerator-runtime';
import { API_URL, KEY, RES_PER_PAGE, KEY } from './config.js'; // jeżeli chcemy importować tylko jedną zmienną zapisujemy ją w {}
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: ``,
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  // const recipe = data.data.recipe;
  // jeżeli mamy taką samą nazwę możemy zrobić destructuring
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // E308 min 33
    // nie wszystie elementy mają key wiec piszemy
    ...(recipe.key && { key: recipe.key }),
    // && pyta czy recipe.key istnieje
    // jeżeli tak to tworzy obiekt `{ key: recipe.key }`
    // który następnie zostaje `...` co z obekt tworzy `key: recipe.key`
    // inaczej nie możemy urzyć &&
  };
};

export const loadRecipe = async function (id) {
  try {
    // const data = await AJAX(`${API_URL}${id}`);
    // E309 zienimono powyższe

    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    // E303 ///////////////////////////// Bookmark ///////////////////////////
    // dzięki temu wsztkie przepisy będą miały prypisany bookmark jako true/false
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    // temporary error handeling
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};
// E296 /////////////////////// Implementing search results //////////////////////////////////////

// 1. user wpisuje w texbox frazę jaką chce wyszukać
// 2.

// ta funkcja pobier dane z AP! i przeżuca do controller rezultat
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    // const data = await AJAX(`${API_URL}?search=${query}`);
    // E 309 //// zmianiono powyższ
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    // console.log(state.search.results);
    // console.log(state.search.query);
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

export const getSearchResultPage = function (page = 1) {
  // it will return only part of results

  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; // 0;
  const end = page * state.search.resultsPerPage; // 9;

  return state.search.results.slice(start, end);
};

// E301 /////////////////////////////////////////////////
// 2. tworzymy updateServings

export const updateSevings = function (newServings) {
  state.recipe.ingredients.forEach(element => {
    element.quantity = (element.quantity / state.recipe.servings) * newServings;
  });
  state.recipe.servings = newServings;
};

// E305 ///// Storing bookmarks with localStorage ////////////////////////////
const persistBookmarks = function () {
  localStorage.setItem(`bookmarks`, JSON.stringify(state.bookmarks));
  // localStorage.setItem(`nazwa`, JSON.stringify(co zachowujemy))
};

// E303
// 1.

export const addBookmark = function (recipe) {
  // Adds buckmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  // jeżeli Id przepisu który wrzucamy w funkcję jest równy aktualnemu przepisowi

  // E305 wyołujemy funkcję zapisującą bookmarks (1/2)
  persistBookmarks();
  // w consoli zmieniamy na Application local storage, i widzimy że zostały zapisane
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id); // szuka indeksu elementu w tablicy
  state.bookmarks.splice(index, 1); // usuwa element o danym indeksie

  // Mark current recipe as NOT bookmarked

  if (id === state.recipe.id) state.recipe.bookmarked = false; // jeżeli Id przepisu który wrzucamy w funkcję jest równy aktualnemu przepisowi

  // E305 wyołujemy funkcję zapisującą bookmarks (2/2)
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem(`bookmarks`);
  // zaciąga z localStorage string o nazwie bookmarks i zapisuje w storage
  if (storage) state.bookmarks = JSON.parse(storage);
  // jezeli istnieje to zapisuje przekonwertowany na kod strin w state.bookmarks
};

init();
// console.log(state.bookmarks);

const cleareBookmarks = function () {
  localStorage.clear(`bookmarks`);
  // Czyści localStorage przydatne do testów
};
cleareBookmarks();

// E308 ///////////////////////// Upload Recipe /////////////////////////////////////////////////

export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(Object.entries(newRecipe));
    // 1. Formatujemy dane wpisane na dane nadające się do przesłania do API
    const ingredients = Object.entries(newRecipe)
      // `Object.entries` zamienia object na array
      .filter(
        entry => entry[0].startsWith(`ingredient`) && entry[1] !== ``
        // pierwszy element tabeli musi się zaczynać na `ingredient` natomiast 2 element nie może być pusty
      )
      .map(ing => {
        const ingArr = ing[1] // bierze kazdy drugi element tabeli rozdziela i zapisuje w zmiennych
          // .replaceAll(` `, ``) // jeżlei są spacje to je kasuje
          .split(`,`)
          .map(el => el.trim()); // rozdziel elementy przedzielone `,`

        if (ingArr.length !== 3) throw new Error(`Wrong ingredient format!!!`);

        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        }; // zwraca obiekt, gdzie quantyty musi być liczbą lub null( null w przypadku gdy jest to ``)
      });
    // `Object.entries` zamienia object na array

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl === `` ? `No URL` : newRecipe.sourceUrl,
      image_url: newRecipe.image === `` ? `No Image` : newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data); // spowrotem zamieniemy wszstko na obiekt czytelny dla naszego App
    addBookmark(state.recipe); // wrzucamy go do localStorrage za pomocą metody addBookmark
  } catch (err) {
    throw err;
  }
};
