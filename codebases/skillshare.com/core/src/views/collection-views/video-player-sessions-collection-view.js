import CollectionView from 'core/src/views/base/collection-view';
import VideoPlayerSessionItemView from 'core/src/views/item-views/video-player-session-item-view';

const VideoPlayerSessionsCollectionView = CollectionView.extend({

  itemView: VideoPlayerSessionItemView,

  initialize: function(options) {
    CollectionView.prototype.initialize.apply(this, arguments);
    _.extend(this, _.pick(options, ['unitsCollectionView']));
    _.bindAll(this, 'onSessionClick', 'onPlaybackStateChange', 'onVideoComplete');

    this.on('click:session', this.onSessionClick);
    this.on('change:playbackState', this.onPlaybackStateChange);
    this.listenTo(this, 'click:viewNotes', this.onViewNotes);
    this.on('video:complete', this.onVideoComplete);
  },

  onSessionClick: function(ev) {
    this.unitsCollectionView.trigger('click:session', { session: ev.session });
  },

  onViewNotes: function(data) {
    this.unitsCollectionView.trigger('click:viewNotes', data);
  },

  onPlaybackStateChange: function(ev) {
    this.unitsCollectionView.trigger('change:playbackState', { session: ev.session });
  },

  onVideoComplete: function(ev) {
    this.unitsCollectionView.trigger('video:complete', { videoIndex: ev.videoIndex, session: ev.session });
  },
});

export default VideoPlayerSessionsCollectionView;

