/**
 * Object representing a `getBoundingClientRect()`-style rect.
 * Rects are created using the `makeRect` helper.
 */

/**
 * Util for ensuring a number is >= 0.
 * Returns the input value if it's a positive number, otherwise returns `0`.
 */
var zeroBound = function zeroBound(num) {
  return Math.max(0, num);
};
/** Creates a Rect */


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
 * Returns a copy of the given `rect` moved `x` px to the right and `y` px down
 */

export var translateRect = function translateRect(rect, x, y) {
  return makeRect(rect.top + y, rect.right + x, rect.bottom + y, rect.left + x);
};
/** Returns a copy of the given Rect */

export var copyRect = function copyRect(rect) {
  return makeRect(rect.top, rect.right, rect.bottom, rect.left);
};
/**
 * Returns a Rect that indicates how much overlap there is with the constraint on each side
 */

export var getCollisionRect = function getCollisionRect(rect, constraintRect) {
  return makeRect(zeroBound(constraintRect.top - rect.top), zeroBound(rect.right - constraintRect.right), zeroBound(rect.bottom - constraintRect.bottom), zeroBound(constraintRect.left - rect.left));
};
/** Subtracts the given `[top, right, bottom, left]` values from a rect, shrinking it. */

export var clipRectByValues = function clipRectByValues(rect, top, right, bottom, left) {
  return makeRect(rect.top + top, rect.right - right, rect.bottom - bottom, rect.left + left);
};