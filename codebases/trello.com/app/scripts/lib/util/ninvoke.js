/* eslint-disable @trello/disallow-filenames */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Promise = require('bluebird');

module.exports.ninvoke = (obj, methodName, ...args) =>
  Promise.fromNode((next) => obj[methodName](...Array.from(args), next));
