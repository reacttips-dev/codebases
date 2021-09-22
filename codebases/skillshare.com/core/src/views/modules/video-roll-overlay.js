import SSView from 'core/src/views/base/ss-view';
import Common from 'core/src/common';
import EmailSharePopupView from 'core/src/views/popups/email-share-popup';

const VideoRollOverlayView = SSView.extend({

  events: {
    'click .email.share-button': 'onClickEmailShare',
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, ['currentSession', 'nextSession', 'parentClass', 'baseUrl']));
    SSView.prototype.initialize.apply(this, arguments);
  },

  close: function() {
    this.trigger('close');
    this.$el.remove();
  },

  nextVideo: function() {
    this.trigger('nextVideo');
  },

  viewAssignment: function() {
    this.trigger('scrollToHeaders');
  },

  replay: function() {
    this.trigger('replay');
  },

  afterRender: function() {
    Common.initRestrictedAccessHandlers(this);
    SSView.prototype.afterRender.apply(this, arguments);
  },

  onClickEmailShare: function() {
    if (!SS.currentUser.isGuest()) {
      new EmailSharePopupView({
        model: this.parentClass,
      });
    }
  },
});

export default VideoRollOverlayView;

