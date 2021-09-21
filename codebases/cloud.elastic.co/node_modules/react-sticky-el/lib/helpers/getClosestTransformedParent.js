"use strict";

exports.__esModule = true;
exports.default = getClosestTransformedParent;

function getClosestTransformedParent(el) {
  do {
    var style = window.getComputedStyle(el);
    if (style.transform !== 'none' || style.webkitTransform !== 'none') return el; // $FlowFixMe - it's fine

    el = el.parentElement || el.parentNode;
  } while (el !== null && el.nodeType === 1);

  return null;
}

module.exports = exports.default;