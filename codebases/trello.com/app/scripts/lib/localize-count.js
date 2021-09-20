/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { tryBabble } = require('app/scripts/lib/try-babble');
const _ = require('underscore');
const { counting } = require('locale');

module.exports.localizeCount = function (key, count, data, options) {
  if (data == null) {
    data = {};
  }
  if (options == null) {
    options = {};
  }
  const args = _.extend({ count: String(count) }, data);
  return tryBabble(['counts', key, counting(count)], args, options);
};
