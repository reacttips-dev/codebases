import CollectionView from 'core/src/views/base/collection-view';
import InlineDiscussionItemView from 'core/src/views/item-views/inline-discussion-item-view';

const InlineDiscussionsCollectionView = CollectionView.extend({
  className: 'inline-discussions',
  itemView: InlineDiscussionItemView,
});

export default InlineDiscussionsCollectionView;

