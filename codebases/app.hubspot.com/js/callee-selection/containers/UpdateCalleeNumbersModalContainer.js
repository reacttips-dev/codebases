'use es6';

import { connect } from 'react-redux';
import UpdateCalleeNumbersModal from '../components/UpdateCalleeNumbersModal';
import { addPhoneNumberProperty, removePhoneNumberProperty, resetPhoneNumberPropertyStatus } from '../../callee-properties/actions/calleePropertiesActions';
import { getCalleesUpdatesStatus } from '../../callees/selectors/calleesUpdatesSelectors';
import { getUserEmailFromState } from '../../Auth/selectors/authSelectors';
import { getCalleeToUpdateFromState, getUpdateTypeFromState } from '../../callees/selectors/addingPropertySelectors';
import { setCalleeToUpdate } from '../../callees/actions/addingPropertyActions';
import { editPermissionsResultsFromState } from '../../permissions/selectors/getPermissions';
import { getSelectedObjectToEditFromState, getSubjectIdFromState, getObjectTypeIdFromState } from '../../active-call-settings/selectors/getActiveCallSettings';

var mapStateToProps = function mapStateToProps(state) {
  var selectedObject = getSelectedObjectToEditFromState(state);
  return {
    selectedObject: selectedObject,
    updateType: getUpdateTypeFromState(state),
    calleeToUpdate: getCalleeToUpdateFromState(state),
    calleesUpdatesStatus: getCalleesUpdatesStatus(state),
    userEmail: getUserEmailFromState(state),
    editPermissionsResults: editPermissionsResultsFromState(state, {
      options: [selectedObject]
    }),
    objectIdContext: getSubjectIdFromState(state),
    objectTypeIdContext: getObjectTypeIdFromState(state)
  };
};

var mapDispatchToProps = {
  addPhoneNumberProperty: addPhoneNumberProperty,
  removePhoneNumberProperty: removePhoneNumberProperty,
  resetPhoneNumberPropertyStatus: resetPhoneNumberPropertyStatus,
  setCalleeToUpdate: setCalleeToUpdate
};
export default connect(mapStateToProps, mapDispatchToProps)(UpdateCalleeNumbersModal);