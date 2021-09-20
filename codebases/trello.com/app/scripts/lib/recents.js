/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { TrelloStorage } = require('@trello/storage');
const _ = require('underscore');

const MAX_RECENT = 10;

class Recents {
  _getKey(type) {
    return `recent_${type}`;
  }

  add(type, value) {
    const current = this.get(type);
    const newValue = _.chain([value, ...Array.from(current)])
      .uniq()
      .first(MAX_RECENT)
      .value();

    return TrelloStorage.set(this._getKey(type), newValue);
  }

  get(type, count) {
    let left;
    if (count == null) {
      count = MAX_RECENT;
    }
    return _.chain(
      (left = TrelloStorage.get(this._getKey(type))) != null ? left : [],
    )
      .compact()
      .first(count)
      .value();
  }
}

module.exports.Recents = new Recents();
