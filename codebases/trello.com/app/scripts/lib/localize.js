// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { tryBabble } = require('./try-babble');
const assert = require('./assert');

module.exports.l = function (keyPath, formatArgs, options) {
  const result = tryBabble(keyPath, formatArgs, options);
  assert(typeof result === 'string', `babble: key ${keyPath} not found`);
  return result;
};
