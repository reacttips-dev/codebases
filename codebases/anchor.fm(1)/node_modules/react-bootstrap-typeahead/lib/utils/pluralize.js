"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pluralize;
/**
 * Basic util for pluralizing words. By default, simply adds an 's' to the word.
 * Also allows for a custom plural version.
 */
function pluralize(text, count, plural) {
  plural = plural || text + "s";
  return count === 1 ? "1 " + text : count + " " + plural;
}