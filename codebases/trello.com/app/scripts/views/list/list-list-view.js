/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let ListListView;
const CollectionView = require('app/scripts/views/internal/collection-view');
const DragSort = require('app/scripts/views/lib/drag-sort');
const InlineListComposerView = require('app/scripts/views/list/inline-list-composer-view');
const ListView = require('app/scripts/views/list/list-view');
const assert = require('app/scripts/lib/assert');

module.exports = ListListView = (function () {
  ListListView = class ListListView extends CollectionView {
    static initClass() {
      this.prototype.viewType = ListView;
    }

    initialize({ resetCallback }) {
      this.resetCallback = resetCallback;
      super.initialize(...arguments);

      assert(this.resetCallback != null);

      return this.listenTo(this.collection, {
        reset: this.resetCallback,
        'change:idBoard': this.boardChange,
      });
    }

    render() {
      const maxVisibleLists = Math.max(3, Math.ceil(window.innerWidth / 270)); // Hard coded list width

      const subviews = this.getModels().map((model, index) => {
        return this.subview(this.viewType, model, {
          deferCards: index >= maxVisibleLists,
        });
      });

      if (this.model.editable()) {
        subviews.push(this.subview(InlineListComposerView, this.model));
      }

      this.ensureSubviews(subviews);
      return this.resetCallback();
    }

    boardChange(list, idBoard) {
      if (idBoard === this.collection.board.get('id')) {
        return;
      }
      this.collection.remove(list);
      return DragSort.refreshIfInitialized(this.$el);
    }

    addModel() {
      super.addModel(...arguments);
      return this.resetCallback();
    }

    removeSubview() {
      super.removeSubview(...arguments);
      DragSort.refreshListCardSortable();
    }

    insertSubview(subview) {
      super.insertSubview(...arguments);
      if (subview.$el.find('.ui-sortable').length > 0) {
        DragSort.refreshIfInitialized(this.$el);
      } else {
        DragSort.refreshListCardSortable();
      }
    }
  };
  ListListView.initClass();
  return ListListView;
})();
