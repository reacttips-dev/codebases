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

module.exports.filterByKeys = function (limits, keys) {
  if (limits == null) {
    return [];
  }

  return keys
    .map(function (key) {
      const [model, limitType] = Array.from(key.split('.'));
      const result =
        limits[model] != null ? limits[model][limitType] : undefined;
      if ((result != null ? result.status : undefined) != null) {
        return _.extend({ key }, _.pick(result, 'status', 'count'));
      }
    })
    .filter((result) => result != null);
};

const statusToSeverity = {
  maxExceeded: 0,
  disabled: 1,
  warn: 2,
  ok: 3,
};

module.exports.sort = (limits) =>
  _.sortBy(limits, (l) => statusToSeverity[l.status]);
