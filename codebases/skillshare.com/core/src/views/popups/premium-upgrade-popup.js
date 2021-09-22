import AbstractPopupView from 'core/src/views/popups/abstract-popup';
import template from 'text!core/src/templates/popups/premium-upgrade-popup.mustache';

const PremiumUpgradePopup = AbstractPopupView.extend({

  className: 'premium-upgrade-popup-view',

  template: template,

  templateData: function() {
    return this.model.attributes;
  },

  events: function() {
    return _.extend(AbstractPopupView.prototype.events.call(this), {
      'click .actions a': 'handleClosePopupEvent',
    });
  },

  afterRender: function() {
    AbstractPopupView.prototype.afterRender.apply(this, arguments);

    const trackingParams = {
      'is_premium': SS.currentUser.isPremiumMember() === 'true' ? true : false,
      'is_user_signed_in': !SS.currentUser.isGuest()=== 'true' ? true : false,
      'can_get_free_trial': this.model.get('canGetFreeTrial'),
      'canGetPromoFreeTrial': this.model.get('canGetPromoFreeTrial'),
    };

    SS.EventTracker.track('Viewed Become Premium Enrollment Popup', {}, trackingParams);
  },

  handleClosePopupEvent: function(event) {
    event.preventDefault();
    this.closePopup();
  },
});

export default PremiumUpgradePopup;

