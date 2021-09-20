/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');

module.exports.LimitMixin = {
  isOverLimit(limitName, limitType) {
    const limits = this.get('limits');

    if (limits == null) {
      // Fail open, the server will reject if we're over
      return false;
    }

    return _.chain(limits)
      .pairs()
      .any((...args) => {
        const [key, data] = Array.from(args[0]);
        const status =
          data[limitType] != null ? data[limitType].status : undefined;
        return (
          key.indexOf(limitName) === 0 &&
          (status === 'disabled' || status === 'maxExceeded')
        );
      })
      .value();
  },
};
