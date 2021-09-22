import SSView from 'core/src/views/base/ss-view';
import template from 'text!core/src/templates/items/video-player-unit-item.mustache';
import VideoPlayerSessionsCollectionView from 'core/src/views/collection-views/video-player-sessions-collection-view';

const VideoPlayerUnitItemView = SSView.extend({

  template: template,
  tagName: 'li',
  className: 'unit-item',

  templateData: function() {
    return this.model.attributes;
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, ['collectionView']));
    this.model.view = this;
    SSView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    SSView.prototype.afterRender.apply(this, arguments);

    this.sessionsCollectionView = new VideoPlayerSessionsCollectionView({
      el: this.$('.session-list'),
      collection: this.model.sessions,
      unitsCollectionView: this.collectionView,
    });
  },

});

export default VideoPlayerUnitItemView;

