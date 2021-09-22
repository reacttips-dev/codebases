import CollectionView from 'core/src/views/base/collection-view';
import ReplyItemView from 'core/src/views/item-views/reply-item-view';

const RepliesCollectionView = CollectionView.extend({
  itemView: ReplyItemView,
});

export default RepliesCollectionView;

