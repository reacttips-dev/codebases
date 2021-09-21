"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = preventInputBlur;
/**
 * Prevent the main input from blurring when a menu item or the clear button is
 * clicked. (#226 & #310)
 */
function preventInputBlur(e) {
  e.preventDefault();
}