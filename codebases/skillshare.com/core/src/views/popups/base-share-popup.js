import AbstractPopupView from 'core/src/views/popups/abstract-popup';
import Share from 'core/src/models/share';
import SocialShareButtonsView from 'core/src/views/modules/social-share-buttons';
import ReferralFormView from 'core/src/views/forms/referral-form';
import GoogleContactsView from 'core/src/views/modules/google-contacts';
import classSocialShareButtonsTemplate from 'text!core/src/templates/shared/_class-social-share-buttons.mustache';
import emailInviteTemplate from 'text!core/src/templates/shared/_email-invite.mustache';
import template from 'text!core/src/templates/modules/base-share.mustache';

const BaseSharePopupView = AbstractPopupView.extend({

  className: 'base-share-popup base-share',

  template: template,

  templatePartials: {
    'shared/_email-invite': emailInviteTemplate,
  },

  events: function() {
    return _.extend(AbstractPopupView.prototype.events.call(this), {
      'click .invite-contacts': 'onInviteContactsClick',
      'click .manual-toggle': 'onManualToggleClick',
    });
  },

  initialize: function() {
    AbstractPopupView.prototype.initialize.apply(this, arguments);
    this.trackingParams = _.extend({
      via: this.via,
    }, _.pick(this.model.get('formData'), ['parentClassId', 'workshopId']));
  },

  afterRender: function() {
    AbstractPopupView.prototype.afterRender.apply(this, arguments);

    this.$email = this.$('.email-invite');
    this.$emailForm = this.$email.find('form');
    this.$manualToggle = this.$('.manual-toggle');
    this.$manualSection = this.$('.manual-section');
    this.$contactsSection = this.$('.contacts-section');

    const socialShareButtons = new SocialShareButtonsView({
      template: classSocialShareButtonsTemplate,
      el: this.$('.social-share-buttons-wrapper'),
      model: this.model,
      trackingParams: this.trackingParams,
      showCompact: this.showCompact,
      showEmail: this.showEmail,
      hideShortUrl: true,
    });

    this.listenTo(socialShareButtons, 'facebook:click', function() {
      this.trackSocialShare(Share.METHODS.FACEBOOK);
    });
    this.listenTo(socialShareButtons, 'twitter:click', function() {
      this.trackSocialShare(Share.METHODS.TWITTER);
    });
    this.listenTo(socialShareButtons, 'link:button:click', function() {
      this.trigger('link:button:click');
    });

    new ReferralFormView({
      el: this.$emailForm,
      trackingParams: this.trackingParams,
    });

    this.centerPopup();
  },

  trackSocialShare: function(method) {
    const data = _.extend(this.model.get('formData'), this.trackingParams, {
      method: method,
      type: Share.TYPES.REFERRAL_LINK,
    });
    const share = new Share(data);
    share.save();
  },

  onInviteContactsClick: function() {
    const referralData = _.extend({
      endpoint: this.model.get('formData').action,
      method: Share.METHODS.GMAIL_CONTACTS,
    }, this.trackingParams);

    this.googleContactsView = new GoogleContactsView({
      el: this.$contactsSection,
      trackingParams: this.trackingParams,
      referralData: referralData,
    });

    if (this.showCompact) {
      this.$('.compact-gmail-contacts-show').show();
      this.$('.compact-gmail-contacts-hide').hide();
    } else {
      this.googleContactsView.on('user:authorized', this.hideForm, this);
    }

    this.googleContactsView.on('user:authorized', this.onUserAuthorized, this);
    this.googleContactsView.authorize();

    SS.EventTracker.track('Clicked Invite Gmail Contacts', {}, this.trackingParams);
  },

  onManualToggleClick: function() {
    this.showForm();
    this.centerPopup();
  },

  hideForm: function() {
    this.$manualSection.hide();
    this.$manualToggle.css('display', 'inline-block');
  },

  showForm: function() {
    this.$manualSection.show();
    this.$manualToggle.hide();
  },

  onUserAuthorized: function() {
    this.trigger('google:user:authorized');
  },
});

export default BaseSharePopupView;
