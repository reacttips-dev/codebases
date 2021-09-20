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
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { LabelList } = require('app/scripts/models/collections/label-list');
const { LabelsHelper } = require('app/scripts/models/internal/labels-helper');
const {
  LocalStorageModel,
} = require('app/scripts/view-models/internal/local-storage-model');
const _ = require('underscore');

class CardComposer extends LocalStorageModel {
  static initClass() {
    this.prototype.typeName = 'CardComposer';

    this.lazy({
      labelList() {
        return new LabelList()
          .syncModel(this, 'idLabels')
          .syncCache(this.modelCache, [], (label) => {
            let left, needle;
            return (
              (needle = label.id),
              Array.from(
                (left = this.get('idLabels')) != null ? left : [],
              ).includes(needle)
            );
          });
      },
    });

    this.prototype.syncedKeys = ['title'];
  }

  constructor(attrs, { board }) {
    super(...arguments);
    this.board = board;
    this.waitForId(this.board, (idBoard) => {
      this.set({ id: `boardCardComposerSettings-${idBoard}` });
      return this.fetch();
    });
  }

  default() {
    return {
      list: null,
      index: null,
      idMembers: [],
      idLabels: [],
      pos: 'bottom',
      title: '',
      vis: false,
    };
  }

  clear() {
    return this.save(this.default());
  }

  clearItems() {
    this.labelList.reset();
    this.save({
      idMembers: [],
      idLabels: [],
      title: '',
    });
  }

  moveToNext() {
    let left;
    this.save({
      index: ((left = this.get('index')) != null ? left : 0) + 1,
    });
  }

  getBoard() {
    return this.board;
  }

  getList() {
    return this.get('list');
  }

  editable() {
    return this.getBoard().editable();
  }

  addMember(idMember) {
    return this.addToSet('idMembers', idMember);
  }

  // This is a passthrough proxy for CardMemberSelectView.selectMem which
  // can have a model of type CardComposer (this view model) or Card.
  addMemberWithTracing(idMember, traceId, next) {
    this.addMember(idMember);
  }

  removeMember(idMember) {
    return this.pull('idMembers', idMember);
  }

  // This is a passthrough proxy for CardMemberSelectView.selectMem which
  // can have a model of type CardComposer (this view model) or Card.
  removeMemberWithTracing(idMember, traceId, next) {
    this.removeMember(idMember);
  }

  // For the LabelsHelper mixin
  labelCreateUrl() {
    return `/1/board/${this.getBoard().id}/labels/`;
  }

  // For now, no suggestions on card composer
  isValidSuggestion() {
    return false;
  }
}
CardComposer.initClass();

_.extend(CardComposer.prototype, LabelsHelper);

module.exports.CardComposer = CardComposer;
