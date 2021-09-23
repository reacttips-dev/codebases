'use es6';

import { createSelector } from 'reselect';
import getIn from 'transmute/getIn';
import { getHubSpotCallingEnabled } from 'calling-lifecycle-internal/records/calling-admin-settings/getters';
import { isUngatedFor } from '../../Auth/selectors/authSelectors';
import { CALLING_PHONE_NUMBER_ACQUISITION } from 'calling-lifecycle-internal/constants/CallingGates';
export var getCallingAdminSettingsFromState = getIn(['callingAdminSettings', 'data']);
export var getHubSpotCallingEnabledFromState = createSelector([getCallingAdminSettingsFromState], getHubSpotCallingEnabled);
export var getIsUngatedForPhoneNumberAcquisition = function getIsUngatedForPhoneNumberAcquisition(state) {
  return isUngatedFor(state, {
    gate: CALLING_PHONE_NUMBER_ACQUISITION
  });
};