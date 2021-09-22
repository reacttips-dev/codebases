import CollectionView from 'core/src/views/base/collection-view';
import TabItemView from 'core/src/views/item-views/tab-item-view';
import template from 'text!core/src/templates/shared/_underline-tabs.mustache';
import Mustache from 'mustache';

const TabsCollectionView = CollectionView.extend({
  itemView: TabItemView,

  template: template,
  templateFunc: Mustache.compile(template),

  insertView: function(item, view) {
    this.$('ul.list').append(view.$el);
    view.trigger('addedToParent');

    if (item) {
      // Update the list of visible items, trigger a `visibilityChange` event
      this.updateVisibleItems(item);
    }

    this.trigger('didInsertView');
  },
});

export default TabsCollectionView;

