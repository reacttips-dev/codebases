import SSView from 'core/src/views/base/ss-view';
import FacebookShareButtonView from 'core/src/views/modules/facebook-share-button';
import TwitterShareButtonView from 'core/src/views/modules/twitter-share-button';
import VideoEmbedPopupView from 'core/src/views/popups/video-embed-popup';
import EmailSharePopupView from 'core/src/views/popups/email-share-popup';
import template from 'text!core/src/templates/shared/_share-links.mustache';

const ShareLinksView = SSView.extend({

  template: template,

  templateData: function() {
    return _.defaults({
      showEmbedButton: this.session ? this.session.get('showEmbedButton') : false,
    }, this.model.attributes);
  },

  events: {
    'click .video-embed': 'onClickVideoEmbed',
    'click .share-email': 'onClickEmail',
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, ['session']));
    SSView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    this.initializeFacebookButton();
    this.initializeTwitterButton();
    SSView.prototype.afterRender.apply(this, arguments);
  },

  initializeFacebookButton: function() {
    new FacebookShareButtonView({
      el: this.$('.share-fb'),
      countUrl: this.model.get('url'),
      showCounter: false,
      shareOptions: {
        name: this.model.get('classTitle'),
        link: this.model.get('fbShareUrl'),
        picture: this.model.get('fbSharePhoto'),
        caption: 'An Online Skillshare Class by ' + this.model.get('teacherFullName'),
        description: this.model.get('fbShareDescription'),
      },
      modelTrackingParams: {
        name: 'Classes',
        id: this.model.get('classId'),
      },
    });
  },

  initializeTwitterButton: function() {
    new TwitterShareButtonView({
      el: this.$('.share-twitter'),
      modelTrackingParams: {
        name: 'Classes',
        id: this.model.get('classId'),
      },
    });
  },

  onClickVideoEmbed: function() {
    const sessionId = this.session.get('id');
    const authToken = this.session.get('authToken');

    new VideoEmbedPopupView({
      sessionId: sessionId,
      authToken: authToken,
      linkTitle: this.model.get('embedTitle'),
      linkUrl: this.model.get('embedUrl'),
      tagLine: this.model.get('embedTagline'),
      basicPopup: true,
    });
  },

  onClickEmail: function() {
    new EmailSharePopupView({
      model: this.model.get('parentClass'),
    });
  },

});

export default ShareLinksView;

