import SSView from 'core/src/views/base/ss-view';
import Share from 'core/src/models/share';
import SocialShareButtonsView from 'core/src/views/modules/social-share-buttons';
import ReferralFormView from 'core/src/views/forms/referral-form';
import GoogleContactsView from 'core/src/views/modules/google-contacts';
import classSocialShareAllButtonsTemplate from 'text!core/src/templates/shared/_class-social-share-all-buttons.mustache';
import emailInviteTemplate from 'text!core/src/templates/shared/_email-invite.mustache';
import template from 'text!core/src/templates/modules/base-share.mustache';
import socialShareButtonsTemplate from 'text!core/src/templates/shared/_social-share-buttons-popup-format.mustache';

const BaseShareView = SSView.extend({

  className: 'base-share',

  template: template,

  templatePartials: {
    'shared/_email-invite': emailInviteTemplate,
  },

  events: {
    'click .invite-contacts': 'onInviteContactsClick',
    'click .manual-toggle': 'onManualToggleClick',
  },

  initialize: function() {
    SSView.prototype.initialize.apply(this, arguments);
    this.trackingParams = _.extend({
      via: this.via,
    }, _.pick(this.model.get('formData'), ['parentClassId', 'workshopId']));
  },

  afterRender: function() {
    SSView.prototype.afterRender.apply(this, arguments);

    this.$email = this.$('.email-invite');
    this.$emailForm = this.$email.find('form');
    this.$manualToggle = this.$('.manual-toggle');
    this.$manualSection = this.$('.manual-section');
    this.$contactsSection = this.$('.contacts-section');

    const socialShareButtons = new SocialShareButtonsView({
      template: classSocialShareAllButtonsTemplate,
      el: this.$('.social-share-buttons-wrapper'),
      model: this.model,
      trackingParams: this.trackingParams,
      showCompact: this.showCompact,
      showEmail: !this.showCompact,
      linkOnly: true,
    });

    this.listenTo(socialShareButtons, 'link:button:click', function() {
      this.trigger('link:button:click');
    });

    new ReferralFormView({
      el: this.$emailForm,
      trackingParams: this.trackingParams,
    });

    const shareModel = new Backbone.Model(_.extend(
      SS.serverBootstrap.pageData.videoPlayerData.shareLinks,
      SS.serverBootstrap.classData.parentClass,
      {
        hideShortUrl: false,
        showLinkBtn: true,
        showEmail: false,
      }
    ));
    new SocialShareButtonsView({
      el: this.$('.share-popup-all-buttons'),
      model: shareModel,
      template: socialShareButtonsTemplate,
    });
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

export default BaseShareView;
