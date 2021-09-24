'use es6';

import DoubleOptInStore from 'crm_data/email/DoubleOptInStore';
var doubleOptInEnabledDependency = {
  stores: [DoubleOptInStore],
  deref: function deref() {
    var doiSettings = DoubleOptInStore.get();
    return doiSettings ? doiSettings.get('enabledInAnyWay') : false;
  }
};
export default doubleOptInEnabledDependency;