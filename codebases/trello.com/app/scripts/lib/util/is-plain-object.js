/* eslint-disable
    eqeqeq,
    @trello/disallow-filenames,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
module.exports.isPlainObject = function (value) {
  let needle;
  if (value == null) {
    return false;
  }

  if (typeof value !== 'object') {
    return false;
  }

  return (
    (needle = Object.getPrototypeOf(value)),
    [null, Object.prototype].includes(needle)
  );
};
