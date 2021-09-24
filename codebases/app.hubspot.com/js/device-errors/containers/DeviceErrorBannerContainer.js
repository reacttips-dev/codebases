'use es6';

import { connect } from 'react-redux';
import DeviceErrorBanner from '../components/DeviceErrorBanner';
import { getDeviceErrors } from '../selectors/getDeviceErrors';
import { setDeviceError } from '../actions/deviceErrorActions';
import { getIsUsingTwilioConnectFromState } from '../../calling-providers/selectors/getCallingProviders';
import { getIsPaidHubFromState } from '../../settings-omnibus/selectors/getPortalSettingsFromState';
import { getShowSuspendedWarningMessage } from '../../userSettings/selectors/getUserSettingsData';
import { saveUserSetting } from '../../userSettings/actions/userSettingsActions';
var mapDispatchToProps = {
  setDeviceError: setDeviceError,
  saveUserSetting: saveUserSetting
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    deviceError: getDeviceErrors(state),
    isUsingTwilioConnect: getIsUsingTwilioConnectFromState(state),
    isPaidHub: getIsPaidHubFromState(state),
    showSuspendedWarningMessage: getShowSuspendedWarningMessage(state)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceErrorBanner);