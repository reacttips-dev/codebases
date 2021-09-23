import I18n from 'I18n';
export var DEFAULT_SUBSCRIPTIONS = [16, 7818550, 4898827, 349169, 1281077, 121, 50894];
export var getLegalConsentOptions = function getLegalConsentOptions() {
  var privacyPolicyText = I18n.text('upgrades.legalConsentOptions.privacyPolicy');
  return {
    legitimateInterest: {
      value: true,
      text: privacyPolicyText,
      legalBasis: 'LEAD',
      subscriptionTypeIds: DEFAULT_SUBSCRIPTIONS
    }
  };
};