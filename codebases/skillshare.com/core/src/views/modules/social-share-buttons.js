import SSView from 'core/src/views/base/ss-view';
import FacebookShareButtonView from 'core/src/views/modules/facebook-share-button';
import TwitterShareButtonView from 'core/src/views/modules/twitter-share-button';
import PinterestShareButtonView from 'core/src/views/modules/pinterest-share-button';
import VideoEmbedPopupView from 'core/src/views/popups/video-embed-popup';
import Share from 'core/src/models/share';
import template from 'text!core/src/templates/shared/_social-share-buttons.mustache';
import Common from 'core/src/common';

const SocialShareButtonsView = SSView.extend({

  darkVersion: false,

  template: template,

  templateData: function() {
    return _.extend({
      showCompact: this.showCompact,
      showEmail: this.showEmail,
      showLinkBtn: this.showLinkBtn,
      linkOnly: this.linkOnly,
      hideShortUrl: this.hideShortUrl,
    }, this.model.attributes);
  },

  events: {
    'click .link-input': 'onLinkSelect',
    'click .share-link': 'onLinkButtonClick',
    'click .share-button': 'onButtonClick',
    'click .video-embed-button': 'onClickVideoEmbed',
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, ['trackingParams', 'modelTrackingParams', 'darkVersion', 'shareModel', 'showCompact', 'showEmail', 'showLinkBtn', 'linkOnly', 'hideShortUrl']));
    SSView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    if (this.darkVersion) {
      this.$('.social-share-buttons').addClass('dark');
    }

    if (!this.linkOnly) {
      this.initializeFacebookButton();
      this.initializeTwitterButton();
      this.initializePinterestButton();
    }

    Common.initRestrictedAccessHandlers(this.$el);
    SSView.prototype.afterRender.apply(this, arguments);
  },

  getShortUrl: function(url, cb) {
    $.ajax({
      url: '/shortener',
      type: 'GET',
      async: false,
      datatype: 'JSON',
      data: {
        'url': url,
      },
      success: cb,
    });
  },

  initializeFacebookButton: function() {
    this.facebookShareButton = new FacebookShareButtonView({
      el: this.$('.share-button.fb'),
      shareOptions: this.model.get('facebookShare'),
      trackingParams: this.trackingParams,
      modelTrackingParams: this.modelTrackingParams,
    });
    this.listenTo(this.facebookShareButton, 'element:click', this.onButtonClick);
    this.listenTo(this.facebookShareButton, 'element:click', this.onFacebookButtonClick);
  },

  initializeTwitterButton: function() {
    this.twitterShareButton = new TwitterShareButtonView({
      el: this.$('.share-button.twitter'),
      trackingParams: this.trackingParams,
      modelTrackingParams: this.modelTrackingParams,
    });
    this.listenTo(this.twitterShareButton, 'element:click', this.onTwitterButtonClick);
  },

  initializePinterestButton: function() {
    this.pinterestShareButton = new PinterestShareButtonView({
      el: this.$('.share-pinterest'),
      trackingParams: this.trackingParams,
      modelTrackingParams: this.modelTrackingParams,
    });
    this.listenTo(this.pinterestShareButton, 'element:click', this.onPinterestButtonClick);
  },

  onClickVideoEmbed: function() {
    const sessionId = this.model.get('id');
    const authToken = this.model.get('authToken');

    new VideoEmbedPopupView({
      sessionId: sessionId,
      authToken: authToken,
      linkTitle: this.shareModel.get('embedTitle'),
      linkUrl: this.shareModel.get('embedUrl'),
      tagLine: this.shareModel.get('embedTagline'),
      basicPopup: true,
    });
  },

  onLinkSelect: function(ev) {
    const button = $(ev.currentTarget);
    const input = button.find('input');
    input.trigger('select');
  },

  onButtonClick: function() {
    if (this.$el.context.className === 'video-roll-overlay') {
      SS.EventTracker.track('Clicked-Premium-Share-End-Card');
    }

    this.trigger('button:click');
  },

  onLinkButtonClick: function() {
    const linkWrapper = this.$('.link-input');
    const linkInput = linkWrapper.find('input');
    const linkBtn = this.$('.share-link');

    if (!linkInput.val().length) {
      this.getShortUrl(linkBtn.attr('longurl'), function(data) {
        linkInput.val(data.shortURL);
      });
    }

    linkWrapper.removeClass('hidden');
    linkWrapper.animate({width: '100%'}, 250);
    this.trigger('link:button:click');
  },

  onFacebookButtonClick: function() {
    this.trigger('facebook:click');
    this.trackShare(Share.METHODS.FACEBOOK);
  },

  onTwitterButtonClick: function() {
    const {twitterShareButton} = this;
    if (twitterShareButton.$el.attr('shorturl') !== undefined && !twitterShareButton.$el.attr('shorturl').length) {
      this.getShortUrl(twitterShareButton.$el.attr('longurl'), function(data) {
        twitterShareButton.$el
          .attr('shorturl', data.shortURL)
          .attr('href', twitterShareButton.$el.attr('href') + data.shortURL);
      });
    }

    this.trigger('twitter:click');
    this.trackShare(Share.METHODS.TWITTER);
  },

  onPinterestButtonClick: function() {
    this.trigger('pinterest:click');
    this.trackShare(Share.METHODS.PINTEREST);
  },

  trackShare: function(method) {
    // Use the `trackShares` flag to determine if we should track this share event.
    if (this.trackingParams && this.trackingParams.trackShares) {
      new Share(_.extend({}, this.trackingParams, this.modelTrackingParams, {
        method: method,
        type: Share.TYPES.LINK,
        via: this.trackingParams.source,
        object_type: this.modelTrackingParams.name,
        object_id: this.modelTrackingParams.id,
      })).save();
    }
  },
});

export default SocialShareButtonsView;

