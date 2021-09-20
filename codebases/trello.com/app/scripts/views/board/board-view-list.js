// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Util } = require('app/scripts/lib/util');
const DragSort = require('app/scripts/views/lib/drag-sort');

module.exports.openListComposer = function () {
  return this.model.viewState.openListComposer();
};

module.exports.scrollToList = function (list) {
  Util.scrollElementIntoView(this.$('#board')[0], this.viewForList(list).el, {
    horizontal: true,
    animated: true,
  });
};

module.exports.viewForList = function (list) {
  return this.listListView.viewForModel(list);
};

module.exports.postListListRender = function () {
  this.renderFilteringStatus();
  return DragSort.refreshListCardSortable();
};

module.exports.renderLists = function () {
  this.listListView.$el.toggleClass('js-list-sortable', this.model.editable());
  this.$('.board-canvas').append(this.listListView.el);
  // Render after adding because postListListRender is dumb and wants the
  // #board element to be in the DOM already
  this.listListView.render();
  this.listListView.delegateEvents();
  return this;
};

module.exports.sortCommit = (e, ui) => ui.item.trigger('movelist', ui);
