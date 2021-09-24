'use es6';

import { connect } from 'react-redux';
import { setSelectedProvider } from '../actions/callingProvidersActions';
import CallProviderDropdown from '../components/CallProviderDropdown';
import { getObjectTypeIdFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { hasCallingProvidersCapability } from '../../capabilities/selectors/getCapabilities';
import { getInitialLoadSettingsFromState } from '../../initial-load-settings/selectors/getInitialLoadSettings';
import { getPortalIdFromState } from '../../Auth/selectors/authSelectors';
import { getHubSpotCallingEnabledFromState } from '../../calling-admin-settings/selectors/getCallingAdminSettingsFromState';
var mapDispatchToProps = {
  setSelectedProvider: setSelectedProvider
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    objectTypeId: getObjectTypeIdFromState(state),
    hasCallingProvidersCapability: hasCallingProvidersCapability(state),
    initialLoadSettings: getInitialLoadSettingsFromState(state),
    hubSpotCallingEnabled: getHubSpotCallingEnabledFromState(state),
    portalId: getPortalIdFromState(state)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CallProviderDropdown);