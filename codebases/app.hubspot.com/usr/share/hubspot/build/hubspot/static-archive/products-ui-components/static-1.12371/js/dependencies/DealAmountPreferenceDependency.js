'use es6';

import PropTypes from 'prop-types';
import SettingsStore from 'crm_data/settings/SettingsStore';
import { DEAL_AMOUNT_CALCULATOR_PROPERTY } from 'crm_data/constants/PortalSettingsKeys';
import { LOADING } from 'crm_data/flux/LoadingStatus';
import { DEAL_AMOUNT_PREFERENCES } from 'products-ui-components/constants/DealAmountOptions';
export default {
  stores: [SettingsStore],
  deref: function deref() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        hasLegacyDealAmountCalculation = _ref.hasLegacyDealAmountCalculation;

    var settings = SettingsStore.get();

    if (!settings) {
      return LOADING;
    }

    var userDealAmountPreference = settings.get(DEAL_AMOUNT_CALCULATOR_PROPERTY);
    var fallbackPreference = hasLegacyDealAmountCalculation ? DEAL_AMOUNT_PREFERENCES.legacy : DEAL_AMOUNT_PREFERENCES.hs_acv;
    return DEAL_AMOUNT_PREFERENCES[userDealAmountPreference] || fallbackPreference;
  },
  propTypes: {
    hasLegacyDealAmountCalculation: PropTypes.bool.isRequired
  }
};