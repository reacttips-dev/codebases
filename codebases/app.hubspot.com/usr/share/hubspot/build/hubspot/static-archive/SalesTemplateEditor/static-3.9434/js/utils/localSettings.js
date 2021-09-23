'use es6';

var PREFIX = 'LocalSettings:Sales:';
export default {
  set: function set(key, value) {
    localStorage[PREFIX + key] = JSON.stringify(value);
  },
  delete: function _delete(key) {
    delete localStorage[PREFIX + key];
  },
  get: function get(key) {
    var item;

    try {
      item = JSON.parse(localStorage[PREFIX + key]);
      return item;
    } catch (e) {
      return item;
    }
  }
};