// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const moment = require('moment');

const callMaybe = function (context, functionOrValue) {
  if (typeof functionOrValue === 'function') {
    return functionOrValue.call(context);
  } else {
    return functionOrValue;
  }
};

module.exports = function (fmt) {
  fmt = { ...fmt };
  const { sameYear, sameElse } = fmt;
  delete fmt.sameYear;
  fmt.sameElse = function () {
    if (this.isSame(moment(), 'year')) {
      return callMaybe(this, sameYear);
    } else {
      return callMaybe(this, sameElse);
    }
  };
  return fmt;
};
