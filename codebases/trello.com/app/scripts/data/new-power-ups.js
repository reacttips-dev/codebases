// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS201: Simplify complex destructure assignments
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');

const idToDateMap = {
  // Package Tracker
  '55a5d917446f51777421000d': '2016-08-07',
  // Card Fields
  '56d5e249a98895a9797bebb9': '2016-08-23',
  // Screenful
  '570262ea1100fa611d7e200a': '2016-08-23',
  // Intercom
  '56cdf5f7071f133a93eb2363': '2016-08-23',
  // Card Repeater
  '57b47fb862d25a30298459b1': '2016-08-23',
};

module.exports.newPowerUps = _.chain(idToDateMap)
  .pairs()
  .map(function (...args) {
    const [key, value] = Array.from(args[0]);
    return [key, new Date(Date.parse(value))];
  })
  .object()
  .value();
