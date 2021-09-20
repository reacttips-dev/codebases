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
const { Dates } = require('app/scripts/lib/dates');
const TrelloModel = require('app/scripts/models/internal/trello-model');

class CheckItem extends TrelloModel {
  static initClass() {
    this.prototype.typeName = 'CheckItem';
  }
  urlRoot() {
    const checklist = this.getChecklist();
    return `${checklist.getCard().url()}/checklist/${checklist.id}/checkItem`;
  }

  sync(method, model, options) {
    // We can't sync our checkItem models until we know the id of the checklist
    // the check item is being added to
    if (this.getChecklist() == null) {
      return;
    }
    return this.waitForId(this.getChecklist(), () => {
      return CheckItem.prototype.__proto__.sync.call(
        this,
        method,
        model,
        options,
      );
    });
  }

  getChecklist() {
    return this.collection.sourceModel;
  }

  getCard() {
    return this.getChecklist().getCard();
  }

  getBoard() {
    return this.getCard().getBoard();
  }

  editable() {
    return this.getChecklist().editable();
  }

  getContext() {
    return this.getChecklist();
  }

  move(index) {
    this.update('pos', this.getChecklist().calcPos(index, this));
    this.collection.sort({ silent: true });
  }

  changeDueDateMaintainTime(targetDate, traceId, next) {
    let left;
    const oldDateData =
      (left = new Date(this.get('due'))) != null
        ? left
        : new Date().setHours(12, 0, 0, 0);
    const newDate = Dates.getDateWithSpecificTime(oldDateData, targetDate);
    return this.update({ due: newDate, traceId }, next);
  }
}
CheckItem.initClass();

module.exports.CheckItem = CheckItem;
