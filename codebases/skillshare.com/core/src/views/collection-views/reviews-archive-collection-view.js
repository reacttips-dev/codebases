import CollectionView from 'core/src/views/base/collection-view';
import ReviewArchiveItemView from 'core/src/views/item-views/review-archive-item-view';

const ReviewsArchiveCollectionView = CollectionView.extend({
  itemView: ReviewArchiveItemView,
});
export default ReviewsArchiveCollectionView;

