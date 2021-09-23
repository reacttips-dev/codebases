'use es6';

import { connect } from 'react-redux';
import StartCallButton from '../components/StartCallButton';
import { getIsMicrophoneAccessDeniedFromState } from '../../microphone-access/selectors/getMicrophonePermissions';
import { getSelectedCallMethodFromState, getInvalidPhoneNumberMessageFromState, getSelectedToNumberFromState, getValidatedToNumberFromState, getProviderSupportsCurrentObjectTypeFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { getHasMinutesAvailableFromState } from '../../minutes-alert-banner/selectors/getMinutesUsage';
import { getIsCallProviderReady } from '../../selectors/getIsCallProviderReady';
import getIsLoggedIn from '../../selectors/getIsLoggedIn';
import compose from 'transmute/compose';

var mapStateToProps = function mapStateToProps(state) {
  return {
    callProviderIsReady: getIsCallProviderReady(state),
    isMicrophoneAccessDenied: getIsMicrophoneAccessDeniedFromState(state),
    selectedCallMethod: getSelectedCallMethodFromState(state),
    selectedToNumber: getSelectedToNumberFromState(state),
    invalidPhoneNumberMessage: getInvalidPhoneNumberMessageFromState(state),
    hasMinutesAvailable: getHasMinutesAvailableFromState(state),
    isLoggedIn: getIsLoggedIn(state),
    validatedToNumber: getValidatedToNumberFromState(state),
    providerSupportsObjectType: getProviderSupportsCurrentObjectTypeFromState(state)
  };
};

export default compose(connect(mapStateToProps))(StartCallButton);