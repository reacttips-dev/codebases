'use es6';

import SettingsStore from 'crm_data/settings/SettingsStore';
import { LOADING } from 'crm_data/flux/LoadingStatus';
import { isLoading } from 'crm_data/flux/LoadingStatus';
import isTrue from '../../../crm_ui/utils/isTrue';
import { VIEWED_MARKETING_EVENT_CONFIRM_MODAL } from 'crm_data/constants/PortalSettingsKeys';
export var ViewedMarketingEventConfirmModalDependency = {
  stores: [SettingsStore],
  deref: function deref() {
    var settings = SettingsStore.get();

    if (isLoading(settings)) {
      return LOADING;
    }

    return settings && isTrue(settings.get(VIEWED_MARKETING_EVENT_CONFIRM_MODAL));
  }
};