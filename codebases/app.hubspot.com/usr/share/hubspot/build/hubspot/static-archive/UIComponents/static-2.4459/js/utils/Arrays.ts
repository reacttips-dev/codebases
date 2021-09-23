/**
 * @param {Array} arr
 * @param {*} fulcrum
 * @return A copy of the given array "rotated" so that the `fulcrum` is the first entry and the
 * entry before the `fulcrum` is the last
 */
export var rotateAround = function rotateAround(arr, fulcrum) {
  var fulcrumIndex = arr.indexOf(fulcrum);
  return fulcrumIndex === -1 ? arr : arr.slice(fulcrumIndex).concat(arr.slice(0, fulcrumIndex));
};