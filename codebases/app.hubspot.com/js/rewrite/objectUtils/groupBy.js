'use es6';

import invariant from 'react-utils/invariant';
import { mutableUpdateIn } from './mutableUpdateIn';
/**
 * Used to group the elements in an iterable by an arbitrary key, determined by the getGroupId function. The
 * order of the elements in each group is preserved from their order in the initial iterable. This is a direct
 * equivalent to {@link https://immutable-js.github.io/immutable-js/docs/#/Collection/groupBy|immutable.js's "groupBy"}.
 *
 * @template T - Whatever type is in your iterable.
 * @param {(elt: T) => string} getGroupId - A required function that converts an element into a (string, or coercable to a string)
 * group id.
 * @param {T[]} iterable - The iterable to group
 * @returns {{[groupId: string]: T[]}} - An object whose keys are the return value of getGroupId and whose values are
 * an array of all objects that have a given group id.
 *
 * @example
 * const items = [
 *  { name: 'one', group: 1 },
 *  { name: 'two', group: 2 },
 *  { name: 'three', group: 1 },
 *  { name: 'empty' }
 * ];
 *
 * const output = groupBy(({ group }) => group, items);
 *
 * expect(output).toEqual({
 *    1: [{ name: 'one', group: 1 }, { name: 'three', group: 1 }],
 *    2: [{ name: 'two', group: 2 }],
 *    undefined: [{ name: 'empty' }]
 * });
 */

export var groupBy = function groupBy(getGroupId, iterable) {
  var result = {};
  invariant(typeof getGroupId === 'function', 'Expected getGroupId to be a function, but got "%s"', getGroupId);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var item = _step.value;
      mutableUpdateIn([getGroupId(item)], function () {
        var group = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        group.push(item);
        return group;
      }, result);
    };

    for (var _iterator = (iterable || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
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

  return result;
};