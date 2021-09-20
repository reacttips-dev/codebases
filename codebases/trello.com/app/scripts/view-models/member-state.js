// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const {
  LocalStorageModel,
} = require('app/scripts/view-models/internal/local-storage-model');
const _ = require('underscore');

module.exports.MemberState = new (class extends LocalStorageModel {
  constructor() {
    super();
    this.set({ id: `memberState-${Auth.myId()}` });
    this.fetch();
    this.enableTabSync();
  }

  default() {
    return {
      cardsPageSortType: 'board',
      cardsPageFilter: 'active-month',
      cardsPageGroup: 'all',
      processingAttachmentsLength: 0,
      idCollapsedChecklists: [],
      appcuesOptOut: false,
      showSuggestions: true,
      useAnimatedStickers: true,
    };
  }

  getCardsPageSortType() {
    return this.get('cardsPageSortType');
  }

  getCardsPageFilter() {
    return this.get('cardsPageFilter');
  }

  getCardsPageGroup() {
    return this.get('cardsPageGroup');
  }

  sortCardsPageByBoard() {
    return this.save('cardsPageSortType', 'board');
  }

  sortCardsPageByDate() {
    return this.save('cardsPageSortType', 'date');
  }

  setCardsPageFilter(filter) {
    return this.save('cardsPageFilter', filter);
  }

  setCardsPageGroup(group) {
    return this.save('cardsPageGroup', group);
  }

  setShowSuggestions(enabled) {
    return this.save('showSuggestions', enabled);
  }

  getCollapsedChecklists() {
    return this.get('idCollapsedChecklists');
  }

  pullCollapsedChecklist(idChecklist) {
    return this.pull('idCollapsedChecklists', idChecklist);
  }

  pushCollapsedChecklist(idChecklist) {
    this.pull('idCollapsedChecklists', idChecklist);
    this.addToSet('idCollapsedChecklists', idChecklist);
    const collapsed = this.getCollapsedChecklists();
    const collapsedTrunc = _.rest(
      collapsed,
      Math.max(0, collapsed.length - 256),
    );
    return this.save('idCollapsedChecklists', collapsedTrunc);
  }

  getAppcuesOptOut() {
    return this.get('appcuesOptOut');
  }

  setAppcuesOptOut(value) {
    return this.save('appcuesOptOut', value);
  }

  getBoardCollapsedPowerUps() {
    return this.get('idBoardCollapsedPowerUps');
  }

  pullBoardCollapsedPowerUps(idBoard) {
    return this.pull('idBoardCollapsedPowerUps', idBoard);
  }

  pushBoardCollapsedPowerUps(idBoard) {
    this.pull('idBoardCollapsedPowerUps', idBoard);
    this.addToSet('idBoardCollapsedPowerUps', idBoard);
    const collapsed = this.getBoardCollapsedPowerUps();
    const collapsedTrunc = _.rest(
      collapsed,
      Math.max(0, collapsed.length - 256),
    );
    return this.save('idBoardCollapsedPowerUps', collapsedTrunc);
  }

  getUseAnimatedStickers() {
    return this.get('useAnimatedStickers');
  }

  setUseAnimatedStickers(value) {
    return this.save('useAnimatedStickers', value);
  }
})();
