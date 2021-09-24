'use es6';

import SettingsStore from 'crm_data/settings/SettingsStore';
import isTrue from '../utils/isTrue';
import { GDPR_COMPLIANCE_ENABLED } from 'crm_data/constants/PortalSettingsKeys';
var gdprEnabledDependency = {
  stores: [SettingsStore],
  deref: function deref() {
    var settings = SettingsStore.get();
    return settings ? isTrue(settings.get(GDPR_COMPLIANCE_ENABLED)) : false;
  }
};
export default gdprEnabledDependency;