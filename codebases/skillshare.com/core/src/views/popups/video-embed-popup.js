import AbstractPopupView from 'core/src/views/popups/abstract-popup';
import VideoEmbedView from 'core/src/views/modules/video-embed';
import template from 'text!core/src/templates/popups/video-embed-popup.mustache';

const VideoEmbedPopupView = AbstractPopupView.extend({

  initialize: function(options) {
    AbstractPopupView.prototype.initialize.apply(this, arguments);
    this.options = options || {};
  },

  template: template,

  afterRender: function() {
    AbstractPopupView.prototype.afterRender.apply(this, arguments);
    new VideoEmbedView({
      el: this.$('.video-embed-wrapper'),
      templateOptions: this.options,
    });
    this.centerPopup();
  },

});

export default VideoEmbedPopupView;

