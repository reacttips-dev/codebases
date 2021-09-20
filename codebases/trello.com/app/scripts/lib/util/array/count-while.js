/* eslint-disable
    eqeqeq,
    @trello/disallow-filenames,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS201: Simplify complex destructure assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Returns the index of the first index that a set of arrays differs at
//
// For example:
//
// countUntil([1,2,3], [1,2]) -> 2
// countUntil(['a', 'b', 'c'], ['a'], ['a', 'b']) -> 0
module.exports.countWhile = function (...args) {
  const adjustedLength = Math.max(args.length, 1),
    arrays = args.slice(0, adjustedLength - 1),
    predicate = args[adjustedLength - 1];
  const [first, ...rest] = Array.from(arrays);

  if (first == null) {
    return 0;
  }

  if (rest.length > 0) {
    for (let index = 0; index < first.length; index++) {
      const value = first[index];
      for (const other of Array.from(rest)) {
        if (other.length <= index || !predicate(value, other[index])) {
          return index;
        }
      }
    }
  }

  return first.length;
};
