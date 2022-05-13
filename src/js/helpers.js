import { TIMEOUT_SEC } from './config.js';

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// E309 ////////////// Refactorning get i post JSON //////////////////////////////////////////

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); //.race([1,2]) 1,2 wstawiamy Promises, która pierwsza zakończy pracę ta jest zwrócona
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err; // throw powoduje, że będzie on zwracany na końcu zagnieżdzonych  async/await function
  }
};

// // export const getJSON = async function (url) {
// //   try {
// //     const res = await fetch(url);
// //     const data = await res.json();
// //     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
// //     return data;
// //   } catch (err) {
// //     throw err; // throw) powoduje, że będzie on zwracany na końcu zagnieżdzonych  async/await function
// //   }
// // };

// // Dodawanie setTimeout do powyższej funkcji
// export const getJSON = async function (url) {
//   try {
//     const fetchPro = fetch(url);
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); //.race([1,2]) 1,2 wstawiamy Promises, która pierwsza zakończy pracę ta jest zwrócona
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err; // throw powoduje, że będzie on zwracany na końcu zagnieżdzonych  async/await function
//   }
// };

// // E308 // Upload Recipe to API ///////////////////////////////////////////

// export const sendJSON = async function (url, uploadData) {
//   try {
//     // W poste request w odróżnieniu od get request
//     // prucz adresu url musimy podać obiekt z pewnym opcjami
//     const fetchPro = fetch(url, {
//       method: 'POST', // jaka metoda
//       headers: {
//         'content-Type': 'application/json', // jaki format
//       },
//       body: JSON.stringify(uploadData), // co wysyłamy
//     });
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); //.race([1,2]) 1,2 wstawiamy Promises, która pierwsza zakończy pracę ta jest zwrócona
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err; // throw powoduje, że będzie on zwracany na końcu zagnieżdzonych  async/await function
//   }
// };
