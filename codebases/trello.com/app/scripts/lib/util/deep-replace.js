/* eslint-disable
    eqeqeq,
    @trello/disallow-filenames,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const { isPlainObject } = require('app/scripts/lib/util/is-plain-object');

module.exports.deepReplace = function (obj, predicate, transform) {
  if (transform == null) {
    transform = (value, key, predicateResult) => predicateResult;
  }

  const process = function (value, key) {
    let predicateResult;
    if ((predicateResult = predicate(value, key))) {
      return transform(value, key, predicateResult);
    } else if (_.isArray(value)) {
      return value.map(process);
    } else if (isPlainObject(value)) {
      return _.mapObject(value, process);
    } else {
      return value;
    }
  };

  return process(obj);
};
