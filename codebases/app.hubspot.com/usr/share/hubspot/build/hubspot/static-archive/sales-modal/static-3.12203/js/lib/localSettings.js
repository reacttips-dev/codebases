/* eslint-disable no-unsafe-finally */
'use es6';

export function set(key, value) {
  localStorage[key] = JSON.stringify(value);
}
export function remove(key) {
  delete localStorage[key];
}
export function get(key) {
  var item;

  try {
    item = JSON.parse(localStorage[key]);
  } finally {
    return item;
  }
}