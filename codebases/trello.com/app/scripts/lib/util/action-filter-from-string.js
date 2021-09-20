/* eslint-disable
    eqeqeq,
    no-prototype-builtins,
    @trello/disallow-filenames,
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

module.exports.actionFilterFromString = function (str) {
  const map = _.reduce(
    str.split(','),
    function (map, actionEntry) {
      const [actionType, attr] = Array.from(actionEntry.split(':'));

      if (attr != null) {
        if (map[actionType] == null) {
          map[actionType] = [];
        }
        map[actionType].push(attr);
      } else {
        map[actionType] = true;
      }

      return map;
    },

    {},
  );

  return function (action) {
    const entry = map[action.get('type')];
    if (entry == null) {
      return false;
    } else if (entry === true) {
      return true;
    } else {
      // For actionTypes like updateCard:idList
      const { old } = action.get('data');
      return old != null && _.any(entry, (attr) => old.hasOwnProperty(attr));
    }
  };
};
