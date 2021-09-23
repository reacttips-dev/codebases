'use es6';

import { connect } from 'react-redux';
import EmbeddableComponentClientWrapper from '../components/EmbeddableComponentClientWrapper';
import { setCallData, resetCallData, setThreadId } from '../../active-call-settings/actions/activeCallSettingsActions';
import { isWidgetReadyToStartCalls } from '../../active-call-settings/selectors/getActiveCallSettings';
import { setDeviceError } from '../../device-errors/actions/deviceErrorActions';
import { addPhoneNumberProperty } from '../../callee-properties/actions/calleePropertiesActions';
import { getUserEmailFromState } from '../../Auth/selectors/authSelectors';
import { getEngagementFromState } from '../../engagement/selectors/getEngagement';
import { getClientStatusFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { getSelectedCallProviderFromState, getIsUsingTwilioConnectFromState } from '../../calling-providers/selectors/getCallingProviders';
import { thirdPartyStatusChange, thirdPartyLogIn, thirdPartyLogOut } from '../../third-party-calling/actions/thirdPartyCallingActions';
import { setSelectedProvider } from '../../calling-providers/actions/callingProvidersActions';
import { setSelectedCallMethod, setSelectedConnectFromNumber, setSelectedFromNumber } from '../../active-call-settings/actions/activeCallSettingsActions';
import { setCapabilities } from '../../capabilities/actions/capabilitiesActions';
import { fetchCalleeIfNeeded, disassociateCallee } from '../../callees/actions/calleesActions';
import { setCalleeToUpdate } from '../../callees/actions/addingPropertyActions';
import { setRegisterFromNumberType, setShouldShowOnboardingIntro } from '../../onboarding/actions/actions';
import { updateUASAssociations } from '../../associations/actions/updateUASAssociations';

var mapStateToProps = function mapStateToProps(state) {
  return {
    isWidgetReadyToStartCalls: isWidgetReadyToStartCalls(state),
    clientStatus: getClientStatusFromState(state),
    userEmail: getUserEmailFromState(state),
    selectedCallProvider: getSelectedCallProviderFromState(state),
    isUsingTwilioConnect: getIsUsingTwilioConnectFromState(state),
    engagement: getEngagementFromState(state)
  };
};

var mapDispatchToProps = {
  setCallData: setCallData,
  setDeviceError: setDeviceError,
  resetCallData: resetCallData,
  addPhoneNumberProperty: addPhoneNumberProperty,
  onThirdPartyStatusChange: thirdPartyStatusChange,
  onThirdPartyLogIn: thirdPartyLogIn,
  onThirdPartyLogOut: thirdPartyLogOut,
  setSelectedProvider: setSelectedProvider,
  setSelectedFromNumber: setSelectedFromNumber,
  setSelectedConnectFromNumber: setSelectedConnectFromNumber,
  setSelectedCallMethod: setSelectedCallMethod,
  setThreadId: setThreadId,
  setCapabilities: setCapabilities,
  fetchCalleeIfNeeded: fetchCalleeIfNeeded,
  setCalleeToUpdate: setCalleeToUpdate,
  setRegisterFromNumberType: setRegisterFromNumberType,
  setShouldShowOnboardingIntro: setShouldShowOnboardingIntro,
  updateUASAssociations: updateUASAssociations,
  disassociateCallee: disassociateCallee
};
export default connect(mapStateToProps, mapDispatchToProps)(EmbeddableComponentClientWrapper);