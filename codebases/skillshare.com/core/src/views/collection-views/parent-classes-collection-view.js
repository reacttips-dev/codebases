import CollectionView from 'core/src/views/base/collection-view';
import ParentClassItemView from 'core/src/views/item-views/parent-class-item-view';

const ParentClassesCollectionView = CollectionView.extend({
  itemView: ParentClassItemView,
});

export default ParentClassesCollectionView;
