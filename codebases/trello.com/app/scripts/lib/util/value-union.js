/* eslint-disable @trello/disallow-filenames */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS203: Remove `|| {}` from converted for-own loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');

module.exports.valueUnion = function (getKey, ...colls) {
  let key;
  const collection = {};
  _.flatten(colls).forEach(function (x) {
    key = getKey(x);
    if (collection[key] && _.isObject(collection[key])) {
      return (collection[key] = _.extend({}, collection[key], x));
    } else {
      return (collection[key] = x);
    }
  });
  return (() => {
    const result = [];
    for (key of Object.keys(collection || {})) {
      const value = collection[key];
      result.push(value);
    }
    return result;
  })();
};
