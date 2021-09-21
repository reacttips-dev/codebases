"use strict";

exports.__esModule = true;
exports.default = find;
var basicSelectors = {};

if (typeof document !== 'undefined') {
  basicSelectors.body = document.body;
  basicSelectors.window = window;
  basicSelectors.document = document;
}

var matchesMethodName = function () {
  if (typeof document !== 'undefined' && document.body) {
    var body = document.body;
    return typeof body.matches === 'function' ? 'matches' : // $FlowFixMe - flow doesn't like vendors, so do I, but we have to support such case
    typeof body.webkitMatchesSelector === 'function' ? 'webkitMatchesSelector' : //webkit
    // $FlowFixMe - see above
    typeof body.mozMatchesSelector === 'function' ? 'mozMatchesSelector' : //mozilla
    // $FlowFixMe - see above
    typeof body.msMatchesSelector === 'function' ? 'msMatchesSelector' : //ie
    // $FlowFixMe - see above
    typeof body.oMatchesSelector === 'function' ? 'oMatchesSelector' : //old opera
    null;
  }

  return null;
}();

function find(selector, el) {
  if (!selector) {
    return null;
  }

  if (basicSelectors.hasOwnProperty(selector)) {
    return basicSelectors[selector];
  } // select by id


  if (selector[0] === '#') {
    return document.getElementById(selector.slice(1));
  }

  if (matchesMethodName === null) {
    return null;
  }

  var temp = el; // eslint-disable-next-line no-cond-assign

  while (temp = temp.parentElement) {
    // $FlowFixMe - flow does not approve it, but it works fine :)
    if (temp[matchesMethodName](selector)) {
      return temp || null;
    }
  } // nothing has been found :(


  return null;
}

module.exports = exports.default;