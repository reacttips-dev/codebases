import SSView from 'core/src/views/base/ss-view';
import Utils from 'core/src/base/utils';
import contactTemplate from 'text!core/src/templates/contacts/_row.mustache';
import extractQueryParams from 'core/src/utils/extract-query-params';

const ReferralContactItemView = SSView.extend({

  tagName: 'li',

  className: 'contact-row',

  template: contactTemplate,

  templateData: function() {
    return this.model.attributes;
  },

  events: {
    'click .invite-btn': 'sendInvite',
  },

  initialize: function() {
    SSView.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'remove');
  },

  afterRender: function() {
    SSView.prototype.afterRender.apply(this, arguments);
    this.$inviteStatus = this.$('.invite-status');
    this.$inviteBtn = this.$('.invite-btn');
  },

  sendInvite: function() {
    const _this = this;

    this.showLoader();

    const { referralData } = this.model.collection;
    const endpoint = referralData ? referralData.endpoint : '/listings/emailReferrals';
    const queryParams = extractQueryParams();
    const data = _.extend({}, referralData, {
      emails: this.model.get('email'),
      utm_campaign: queryParams.utm_campaign,
      utm_source: queryParams.utm_source,
      utm_medium: queryParams.utm_medium,
    });

    Utils.ajaxRequest(endpoint, {
      type: 'POST',
      data: data,
      success: function(response) {
        if (response.success) {
          _this.showCheck();
          setTimeout(_this.remove, 1000);
        } else {
          _this.showButton();
        }
      },
    });
  },

  showButton: function() {
    this.clearStatus();
    this.$inviteStatus.addClass('initial');
  },

  showLoader: function() {
    this.clearStatus();
    this.$inviteStatus.addClass('loading icon-loading');
  },

  showCheck: function() {
    this.clearStatus();
    this.$inviteStatus.addClass('checked ss-icon-check');
  },

  clearStatus: function() {
    this.$inviteStatus.removeClass('initial checked loading ss-icon-check icon-loading');
  },

  remove: function() {
    this.model.collection.remove(this.model);
  },

});

export default ReferralContactItemView;
