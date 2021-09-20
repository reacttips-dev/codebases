/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const TrelloModel = require('app/scripts/models/internal/trello-model');
const _ = require('underscore');

class Label extends TrelloModel {
  static initClass() {
    this.prototype.typeName = 'Label';
    this.prototype.urlRoot = '/1/labels';

    this.colors = [
      'green',
      'yellow',
      'orange',
      'red',
      'purple',
      'blue',
      'sky',
      'lime',
      'pink',
      'black',
    ];
  }

  getBoard() {
    return this.modelCache.get('Board', this.get('idBoard'));
  }

  editable() {
    return this.getBoard().editable();
  }

  colorSortVal() {
    const v = _.indexOf(Label.colors, this.get('color'));
    if (v >= 0) {
      return v;
    } else {
      return Infinity;
    }
  }

  nameSortVal() {
    let left;
    return ((left = this.get('name')) != null ? left : '').toLowerCase();
  }

  static compare(a, b) {
    const cs = a.colorSortVal() - b.colorSortVal();
    if (cs !== 0 && !isNaN(cs)) {
      return cs;
    }
    return a.nameSortVal().localeCompare(b.nameSortVal());
  }
}
Label.initClass();

module.exports.Label = Label;
