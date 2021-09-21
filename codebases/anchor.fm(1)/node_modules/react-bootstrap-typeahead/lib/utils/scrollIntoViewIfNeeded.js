'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Partial polyfill for webkit `scrollIntoViewIfNeeded()` method. Addresses
 * vertical scrolling only.
 *
 * Inspired by https://gist.github.com/hsablonniere/2581101, but uses
 * `getBoundingClientRect`.
 */
function scrollIntoViewIfNeeded(node) {
  // Webkit browsers
  if (Element.prototype.scrollIntoViewIfNeeded) {
    node.scrollIntoViewIfNeeded();
    return;
  }

  // FF, IE, etc.
  var rect = node.getBoundingClientRect();
  var parent = node.parentNode;
  var parentRect = parent.getBoundingClientRect();

  var parentComputedStyle = window.getComputedStyle(parent, null);
  var parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width'));

  if (rect.top < parentRect.top || rect.bottom > parentRect.bottom) {
    parent.scrollTop = node.offsetTop - parent.offsetTop - parent.clientHeight / 2 - parentBorderTopWidth + node.clientHeight / 2;
  }
}

exports.default = scrollIntoViewIfNeeded;