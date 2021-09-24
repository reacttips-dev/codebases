'use es6';

import { createSelector } from 'reselect';
import getIn from 'transmute/getIn';
import { getIsPaidHub, getTrialTypes } from 'calling-settings-ui-library/settings-omnibus/records/PortalSummaryGetters';
export var getPortalSummaryFromState = getIn(['settingsOmnibus', 'data', 'portalSummary']);
export var getIsPaidHubFromState = createSelector([getPortalSummaryFromState], getIsPaidHub);
export var getIsSalesEnterpriseTrialFromState = createSelector([getPortalSummaryFromState], function (portalSummary) {
  var trialTypes = getTrialTypes(portalSummary);
  return trialTypes.includes('SALES_ENTERPRISE');
});