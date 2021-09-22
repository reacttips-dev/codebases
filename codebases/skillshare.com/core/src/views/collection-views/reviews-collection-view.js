import CollectionView from 'core/src/views/base/collection-view';
import ReviewItemView from 'core/src/views/item-views/review-item-view';

const ReviewsCollectionView = CollectionView.extend({
  itemView: ReviewItemView,
});

export default ReviewsCollectionView;

