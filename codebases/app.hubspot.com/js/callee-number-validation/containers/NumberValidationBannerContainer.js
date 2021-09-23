'use es6';

import { connect } from 'react-redux';
import NumberValidationBanner from '../components/NumberValidationBanner';
import { getSelectedFromNumberFromState, getInvalidPhoneNumberMessageFromState, getValidatedToNumberFromState, getSelectedToNumberFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { getIsUsingTwilioConnectFromState } from '../../calling-providers/selectors/getCallingProviders';
import { getIsPaidHubFromState } from '../../settings-omnibus/selectors/getPortalSettingsFromState';
import { getData } from 'conversations-async-data/async-data/operators/getters';

var mapStateToProps = function mapStateToProps(state) {
  var isUsingTwilioConnect = getIsUsingTwilioConnectFromState(state);
  var selectedFromNumber = getSelectedFromNumberFromState(state);
  var validatedToNumber = getValidatedToNumberFromState(state);
  var isPaidHub = getIsPaidHubFromState(state);
  var validationErrorMessage = getInvalidPhoneNumberMessageFromState(state);
  var selectedToNumber = getSelectedToNumberFromState(state);
  return {
    validationErrorMessage: validationErrorMessage,
    isUsingTwilioConnect: isUsingTwilioConnect,
    selectedFromNumber: selectedFromNumber,
    validatedToNumber: getData(validatedToNumber),
    selectedToNumber: selectedToNumber,
    isPaidHub: isPaidHub
  };
};

export default connect(mapStateToProps)(NumberValidationBanner);