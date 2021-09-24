'use es6'; // separate function to allow mocking in tests

export function getSearch() {
  return window.location.search;
}