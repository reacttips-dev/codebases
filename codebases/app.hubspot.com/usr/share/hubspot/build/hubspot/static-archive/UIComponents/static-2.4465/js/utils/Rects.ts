/**
 * @param {number} top
 * @param {number} right
 * @param {number} bottom
 * @param {number} left
 * @return {Object} A `getBoundingClientRect()`-style rect
 */
export var makeRect = function makeRect(top, right, bottom, left) {
  return {
    width: right - left,
    height: bottom - top,
    top: top,
    right: right,
    bottom: bottom,
    left: left
  };
};
/**
 * @param {Object} rect
 * @param {number} x
 * @param {number} y
 * @return {Object} A copy of `rect` moved `x` px to the right and `y` px down
 */

export var translateRect = function translateRect(rect, x, y) {
  return makeRect(rect.top + y, rect.right + x, rect.bottom + y, rect.left + x);
};
/**
 * @param {Object} rect
 * @return {Object} A `getBoundingClientRect()`-style rect
 */

export var copyRect = function copyRect(rect) {
  return makeRect(rect.top, rect.right, rect.bottom, rect.left);
};