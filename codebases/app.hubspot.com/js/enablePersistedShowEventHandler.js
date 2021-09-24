"use strict";
'use es6';
/*

  The back/forward cache in browsers caches the state of the page
  and reuses that state when using the back/forward buttons in the browser.
  This can cause a leak of data after a user logs out. For now we are
  just forcing the page to reload as if it was not cached.

*/

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  });
}

module.exports = exports.default;