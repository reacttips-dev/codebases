'use es6';

import { List } from 'immutable';
import getIn from 'transmute/getIn';
import { getHubSpotCallingProvider, getTwilioCallingProvider } from './callProviderOperators';

function addTwilioBasedWidgets(result, hasTwilioConnect, isCallingEnabled, isUngatedForCallingDisabledAllowThirdParty, hasInstalledCallingProviders) {
  var shouldAddHubSpotCallingProvider = !isUngatedForCallingDisabledAllowThirdParty || isCallingEnabled || !isCallingEnabled && !hasInstalledCallingProviders;

  if (shouldAddHubSpotCallingProvider) {
    result = result.push(getHubSpotCallingProvider());
  }

  if (hasTwilioConnect) {
    result = result.push(getTwilioCallingProvider());
  }

  return result;
}

export function getCallProviders(_ref) {
  var hasTwilioConnect = _ref.hasTwilioConnect,
      isCallingEnabled = _ref.isCallingEnabled,
      isUngatedForCallingDisabledAllowThirdParty = _ref.isUngatedForCallingDisabledAllowThirdParty,
      hasInstalledCallingProviders = _ref.hasInstalledCallingProviders;
  var providers = List();
  providers = addTwilioBasedWidgets(providers, hasTwilioConnect, isCallingEnabled, isUngatedForCallingDisabledAllowThirdParty, hasInstalledCallingProviders);
  return providers;
} // omnibusResponse url: /twilio/v1/settings

export default function getCallProvidersFromOmnibus(omnibusResponse, isUngatedForCallingDisabledAllowThirdParty, hasInstalledCallingProviders) {
  var initialLoadSettings = getIn(['initialLoadSettings'], omnibusResponse);
  var hasTwilioConnect = initialLoadSettings.hasTwilioConnect;
  var isCallingEnabled = initialLoadSettings.isEnabled;
  return getCallProviders({
    hasTwilioConnect: hasTwilioConnect,
    isCallingEnabled: isCallingEnabled,
    isUngatedForCallingDisabledAllowThirdParty: isUngatedForCallingDisabledAllowThirdParty,
    hasInstalledCallingProviders: hasInstalledCallingProviders
  });
}