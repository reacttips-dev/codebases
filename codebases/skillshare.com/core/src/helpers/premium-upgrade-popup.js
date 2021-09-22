import PremiumUpgradePopup from 'core/src/views/popups/premium-upgrade-popup';
import ResumeMembershipPopup from 'core/src/views/popups/resume-membership-popup';
import deepRetrieve from 'core/src/utils/deep-retrieve';
import extractQueryParams from 'core/src/utils/extract-query-params';

export default {
  initializePremiumPopupOnClick: function(event) {
    if (!this._shouldShowPremiumPopup()) {
      return;
    }

    event.preventDefault();
    return this.initializePremiumPopup();
  },

  initializePremiumPopupOnRender: function() {
    if (!this._shouldShowPremiumPopup(true)) {
      return;
    }

    return this.initializePremiumPopup();
  },

  initializePremiumPopup: function() {
    if (this._userIsPaused()) {
      return new ResumeMembershipPopup();
    } else {
      return new PremiumUpgradePopup({
        model: new Backbone.Model(SS.serverBootstrap.premiumUpgradeData),
      });
    }
  },

  _userIsPaused: function() {
    return deepRetrieve(SS, 'serverBootstrap', 'pageData', 'resumeUrl');
  },

  _shouldShowPremiumPopup: function(queryCheck) {
    const queryParams = this._userIsPaused() ? extractQueryParams()['resume-membership-popup'] : extractQueryParams()['premium-upgrade-popup'];
    const queryMatch = (!queryCheck || queryParams);
    const isMemberNotPremium = SS.currentUser.isMember() && !SS.currentUser.isPremiumMember();
    const isFree = deepRetrieve(SS, 'serverBootstrap', 'premiumUpgradeData', 'isFree');
    return isMemberNotPremium && !isFree && queryMatch;
  },
};


