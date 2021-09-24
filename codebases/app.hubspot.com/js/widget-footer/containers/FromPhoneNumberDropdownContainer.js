'use es6';

import { connect } from 'react-redux';
import { getFromNumbersFromState } from '../../settings-omnibus/selectors/getInitialLoadSettings';
import { getSelectedFromNumberFromState, getAppIdentifierFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import FromPhoneNumberDropdown from '../components/FromPhoneNumberDropdown';
import { setSelectedConnectFromNumber, setSelectedFromNumber } from '../../active-call-settings/actions/activeCallSettingsActions';
import { getOmnibusSettings } from '../../settings-omnibus/actions/settingsOmnibusActions';
import { getIsUsingTwilioConnectFromState } from '../../calling-providers/selectors/getCallingProviders';
import { setRegisterFromNumberType } from '../../onboarding/actions/actions';

var mapStateToProps = function mapStateToProps(state) {
  return {
    fromPhoneNumbers: getFromNumbersFromState(state),
    selectedFromNumber: getSelectedFromNumberFromState(state),
    isUsingTwilioConnect: getIsUsingTwilioConnectFromState(state),
    appIdentifier: getAppIdentifierFromState(state)
  };
};

var mapDispatchToProps = {
  setSelectedConnectFromNumber: setSelectedConnectFromNumber,
  setSelectedFromNumber: setSelectedFromNumber,
  getOmnibusSettings: getOmnibusSettings,
  setRegisterFromNumberType: setRegisterFromNumberType
};
export default connect(mapStateToProps, mapDispatchToProps)(FromPhoneNumberDropdown);