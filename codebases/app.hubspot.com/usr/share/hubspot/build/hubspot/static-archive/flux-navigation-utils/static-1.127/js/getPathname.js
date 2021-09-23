'use es6'; // separate function to allow mocking in tests

export function getPathname() {
  return window.location.pathname;
}