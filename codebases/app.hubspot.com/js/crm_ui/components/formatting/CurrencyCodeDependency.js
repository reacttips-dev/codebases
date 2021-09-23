'use es6';

import * as LoadingStatus from 'crm_data/flux/LoadingStatus';
import MultiCurrencySettingsStore from 'crm_data/multiCurrency/MultiCurrencySettingsStore';
export default {
  stores: [MultiCurrencySettingsStore],
  deref: function deref() {
    var multiCurrencySettings = MultiCurrencySettingsStore.get();
    var homeCurrencyCode = LoadingStatus.isResolved(multiCurrencySettings) ? multiCurrencySettings.get('homeCurrencyCode') : LoadingStatus.EMPTY;
    var fallbackCurrencyCode = 'USD';
    return homeCurrencyCode || fallbackCurrencyCode;
  }
};