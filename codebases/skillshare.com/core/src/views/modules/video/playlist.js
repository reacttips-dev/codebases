import SSView from 'core/src/views/base/ss-view';
import VideoUnitsCollection from 'core/src/collections/video-units';
import VideoPlayerUnitItemView from 'core/src/views/item-views/video-player-unit-item-view';
import VideoPlayerUnitsCollectionView from 'core/src/views/collection-views/video-player-units-collection-view';

const VideoPlaylist = SSView.extend({

  className: 'video-playlist-module',

  units: null,
  unitItemView: null,

  unitsCollectionView: null,

  events: {
    'click .view-my-notes': 'onViewMyNotesClick',
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, [
      'units',
      'unitItemView',
    ]));

    this.initializeUnits();
    this.initializeUnitItemView();
    this.initializeUnitsCollectionView();

    SSView.prototype.initialize.apply(this, arguments);
  },

  initializeUnits: function() {
    if (_.isNull(this.units)) {
      this.units = VideoUnitsCollection;
    }
  },

  initializeUnitItemView: function() {
    if (_.isNull(this.unitItemView)) {
      this.unitItemView = VideoPlayerUnitItemView;
    }
  },

  initializeUnitsCollectionView: function() {
    this.unitsCollectionView = new VideoPlayerUnitsCollectionView({
      el: this.$('.unit-list'),
      collection: this.units,
      itemView: this.unitItemView,
    });
    this.listenTo(this.unitsCollectionView, 'click:session', this.onSessionClick);
    this.listenTo(this.unitsCollectionView, 'click:viewNotes', this.onViewNotesClick);
    this.listenTo(this.unitsCollectionView, 'change:playbackState', this.onPlaybackStateChange);
    this.listenTo(this.unitsCollectionView, 'video:complete', this.onVideoComplete);
  },

  onViewMyNotesClick: function() {
    this.trigger('video:playlist:viewMyNotesClick');
  },

  onSessionClick: function(event) {
    this.trigger('video:playlist:sessionClick', event.session);
  },

  onViewNotesClick: function(session) {
    this.trigger('video:playlist:viewNotesClick', session);
  },

  onPlaybackStateChange: function(event) {
    this.trigger('video:playlist:playbackStateChange', event.session);
  },

  onVideoComplete: function(event) {
    this.trigger('video:playlist:videoComplete', {
      videoIndex: event.videoIndex,
      session: event.session,
    });
  },
});

export default VideoPlaylist;

