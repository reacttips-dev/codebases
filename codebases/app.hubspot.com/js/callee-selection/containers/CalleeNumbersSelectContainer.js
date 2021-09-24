'use es6';

import { connect } from 'react-redux';
import CalleeNumbersSelect from '../components/CalleeNumbersSelect';
import { clearCalleesSearch } from '../../callees/actions/calleesActions';
import { getCalleeToUpdateFromState, getIsUpdatingPropertyFromState } from '../../callees/selectors/addingPropertySelectors';
import { clearCalleeToUpdate, setCalleeToUpdate } from '../../callees/actions/addingPropertyActions';
import { getSelectedCallableObjectFromState, getSelectedToNumberFromState, getValidatedToNumberFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { getIsTwilioBasedCallProviderFromState } from '../../calling-providers/selectors/getCallingProviders';
import { getCallableObjectListFromState, getCalleesFromState, getHasNoAssociatedCalleesFromState } from '../../callees/selectors/calleesSelectors';
import { resetPhoneNumberPropertyStatus } from '../../callee-properties/actions/calleePropertiesActions';
import { getAppIdentifierFromState } from '../../active-call-settings/selectors/getActiveCallSettings';

var mapStateToProps = function mapStateToProps(state) {
  return {
    callees: getCalleesFromState(state),
    hasNoAssociatedCallees: getHasNoAssociatedCalleesFromState(state),
    callableObjectList: getCallableObjectListFromState(state),
    isUpdatingProperty: getIsUpdatingPropertyFromState(state),
    selectedPhoneNumberProperty: getSelectedToNumberFromState(state),
    validatedToNumber: getValidatedToNumberFromState(state),
    selectedCallableObject: getSelectedCallableObjectFromState(state),
    calleeToUpdate: getCalleeToUpdateFromState(state),
    isTwilioBasedCallProvider: getIsTwilioBasedCallProviderFromState(state),
    appIdentifier: getAppIdentifierFromState(state)
  };
};

var mapDispatchToProps = {
  resetPhoneNumberPropertyStatus: resetPhoneNumberPropertyStatus,
  clearCalleesSearch: clearCalleesSearch,
  clearCalleeToUpdate: clearCalleeToUpdate,
  setCalleeToUpdate: setCalleeToUpdate
};
export default connect(mapStateToProps, mapDispatchToProps)(CalleeNumbersSelect);