'use es6';

import identity from 'transmute/identity';
/**
 * A method for deduping arrays of either primitive or complex values.
 * Element identities are compared by adding them to a Set, which uses
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality|same-value-zero equality}.
 * The first ocurrence of an identity will survive, and any subsequent
 * ocurrences are ignored. This **does not** work on immutable structures
 * or objects, only plain JS arrays (the values within can be any type).
 * You can customize the identity of an element by passing the optional
 * second "getIdentity" parameter, which may be useful when deduping arrays of objects.
 *
 * **WARNING**: This does not mutate its input, so it will not work with immer-based code.
 *
 * @template T - Whatever type is in your array
 * @param {T[]} array - The array to dedupe
 * @param {(elt: T) => any} getIdentity - An optional function that is passed an
 * array element and returns the identity of the element. Defaults to the identity function.
 * @returns {T[]} A new array, deduped from your original array.
 */

export var unique = function unique(array) {
  var getIdentity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;

  // If given nothing or a non-array value, bail out.
  if (!array || !Array.isArray(array)) {
    return [];
  }

  var keys = new window.Set();
  var uniqueArray = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;
      var key = getIdentity(item);

      if (!keys.has(key)) {
        keys.add(key);
        uniqueArray.push(item);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return uniqueArray;
};