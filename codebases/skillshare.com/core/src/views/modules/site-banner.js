export const VALID_BANNER_TYPES = {
  DEFAULT: 'DEFAULT',
  REFERRAL: 'REFERRAL',
  PAUSED: 'PAUSED',
  COUPON: 'COUPON'
};

const SiteBannerView = Backbone.View.extend({

  el: '#site-banner',

  events: {
    'click .close-link': 'onClose',

    'click .banner-content':  'onClickBanner',
  },

  initialize: function() {
    const $closeLink = this.$('.close-link');
    this.cookieName = $closeLink.attr('data-ss-cookie-name') || 'ss_hide_site_banner';
    this.cookieValue = $closeLink.attr('data-ss-cookie-value');
  },

  onClickBanner: function() {
    if (SS.serverBootstrap.bannerType !== VALID_BANNER_TYPES.DEFAULT) {
      return;
    }
    SS.EventTracker.track('Clicked-Banner-DefaultFreeTrial');
  },

  onClose: function(e) {
    e.preventDefault();
    e.stopPropagation();
    const name = this.cookieName;
    const value = this.cookieValue || (new Date()).getTime() / 1000;
    jQuery.cookie(name, value, {
      path: '/',
      expires: 365,
    });
    this.$el.remove();
  },
});

export default SiteBannerView;