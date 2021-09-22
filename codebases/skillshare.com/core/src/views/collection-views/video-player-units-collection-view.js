import CollectionView from 'core/src/views/base/collection-view';
import VideoPlayerUnitItemView from 'core/src/views/item-views/video-player-unit-item-view';

const VideoPlayerUnitsCollectionView = CollectionView.extend({
  itemView: VideoPlayerUnitItemView,
  initialize: function() {
    CollectionView.prototype.initialize.apply(this, arguments);
  },
});

export default VideoPlayerUnitsCollectionView;

