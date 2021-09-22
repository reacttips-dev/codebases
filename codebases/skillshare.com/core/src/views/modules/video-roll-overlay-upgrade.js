import Common from 'core/src/common';
import VideoRollOverlayView from 'core/src/views/modules/video-roll-overlay';
import template from 'text!core/src/templates/modules/video-roll-overlay-upgrade.mustache';

const VideoRollOverlayUpgradeView = VideoRollOverlayView.extend({

  className: 'video-roll-overlay video-roll-overlay-upgrade',

  template: template,

  initialize: function() {
    _.extend(this, this.options);
    VideoRollOverlayView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    Common.initRestrictedAccessHandlers(this);
    VideoRollOverlayView.prototype.afterRender.apply(this, arguments);
  },

});

export default VideoRollOverlayUpgradeView;
