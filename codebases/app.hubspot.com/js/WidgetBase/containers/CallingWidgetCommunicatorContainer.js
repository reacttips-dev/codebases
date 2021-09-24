'use es6';

import { connect } from 'react-redux';
import { getClientStatusFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import CallingWidgetCommunicator from '../components/CallingWidgetCommunicator';
import { getOnboardingStatusFromState } from '../../onboarding/selectors/getOnboardingStatusFromState';
import { getSelectedCallProviderFromState } from '../../calling-providers/selectors/getCallingProviders';

var mapStateToProps = function mapStateToProps(state) {
  return {
    clientStatus: getClientStatusFromState(state),
    onboardingStatus: getOnboardingStatusFromState(state),
    selectedCallProvider: getSelectedCallProviderFromState(state)
  };
};

export default connect(mapStateToProps)(CallingWidgetCommunicator);