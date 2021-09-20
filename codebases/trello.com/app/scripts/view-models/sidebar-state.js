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
const { Auth } = require('app/scripts/db/auth');
const {
  LocalStorageModel,
} = require('app/scripts/view-models/internal/local-storage-model');
const _ = require('underscore');

module.exports.SidebarState = new ((function () {
  const Cls = class extends LocalStorageModel {
    static initClass() {
      this.prototype.syncedKeys = [
        'idRecentBoards',
        'collapsedDrawerSections',
        'pinBoardsListSidebar',
        'showBoardsListSidebar',
      ];
    }

    constructor() {
      super();
      this.set({ id: `sidebarState-${Auth.myId()}` });
      this.fetch();
    }

    default() {
      return {
        pinBoardsListSidebar: false,
        showBoardsListSidebar: false,
        idRecentBoards: [],
        collapsedDrawerSections: [],
      };
    }

    getPinSidebar() {
      return this.get('pinBoardsListSidebar');
    }

    showPinSidebar() {
      return this.save('pinBoardsListSidebar', true);
    }

    hidePinSidebar() {
      return this.save('pinBoardsListSidebar', false);
    }

    getShowSidebar() {
      return this.get('showBoardsListSidebar');
    }

    showSidebar() {
      return this.save('showBoardsListSidebar', true);
    }

    hideSidebar() {
      return this.save('showBoardsListSidebar', false);
    }

    hideUnpinnedSidebar() {
      if (this.getShowSidebar() && !this.getPinSidebar()) {
        return this.hideSidebar();
      }
    }

    getRecentBoards() {
      return this.get('idRecentBoards');
    }

    pullBoard(idBoard) {
      let index;
      const viewArray = _.clone(this.getRecentBoards());
      while ((index = _.indexOf(viewArray, idBoard)) > -1) {
        viewArray.splice(index, 1);
      }

      return this.save('idRecentBoards', viewArray);
    }

    pushBoard(idBoard) {
      let viewArray = _.clone(this.getRecentBoards());

      if (_.contains(viewArray, idBoard)) {
        viewArray = _.without(viewArray, idBoard);
      }

      viewArray.unshift(idBoard);

      // we only show seven recent boards, but we exclude starred boards.
      // we store extra for when you star and unstar boards.
      viewArray = viewArray.slice(0, 16);

      return this.save('idRecentBoards', viewArray);
    }

    getCollapsedSections() {
      let left;
      return (left = this.get('collapsedDrawerSections')) != null
        ? left
        : this.default().collapsedDrawerSections;
    }

    isCollapsed(id) {
      return _.contains(this.getCollapsedSections(), id);
    }

    collapseSection(id) {
      return this.addToSet('collapsedDrawerSections', id);
    }

    expandSection(id) {
      return this.pull('collapsedDrawerSections', id);
    }
  };
  Cls.initClass();
  return Cls;
})())();
