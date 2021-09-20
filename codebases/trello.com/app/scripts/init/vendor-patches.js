/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');

_.mixin({
  // Loop over objects, applying a transformation function to each key and value
  // and returning a new object consisting of the transformed keys/values
  // Example: mapObj { a: 1 }, (val, key) -> ["new_#{key}", val + 2]
  //          === { new_a: 3 }
  mapObj: _.compose(_.object, _.map),

  count(array, predicate) {
    if (predicate == null) {
      predicate = () => true;
    }
    let count = 0;
    for (const obj of Array.from(array)) {
      if (predicate(obj)) {
        count++;
      }
    }
    return count;
  },
});
