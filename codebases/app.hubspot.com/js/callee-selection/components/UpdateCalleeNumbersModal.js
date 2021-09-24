'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState, useCallback, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { SUCCEEDED, STARTED } from 'conversations-async-data/async-data/constants/asyncStatuses';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { getRawNumber, getObjectId, getObjectTypeId, getPropertyName } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
import CallExtensionsContext from '../../WidgetBase/context/CallingExtensionsContext';
import UIAlert from 'UIComponents/alert/UIAlert';
import { createUpdateCalleeMessage } from 'calling-internal-common/iframe-events/internalEventMessageCreators';
import FullscreenModal from '../../fullscreen-modal/components/FullscreenModal';
import UpdateCalleeNumbersContainer from '../containers/UpdateCalleeNumbersContainer';
import { PhoneNumberIdentifier } from 'calling-lifecycle-internal/callees/records/PhoneNumberIdentifier';
import { ADDING } from '../../callees/operators/updatePropertyTypes';
import { createPropertyKey } from 'calling-lifecycle-internal/callees/operators/getPropertyKeys';

function UpdateCalleeNumbersModal(_ref) {
  var selectedObject = _ref.selectedObject,
      addPhoneNumberProperty = _ref.addPhoneNumberProperty,
      removePhoneNumberProperty = _ref.removePhoneNumberProperty,
      calleesUpdatesStatus = _ref.calleesUpdatesStatus,
      calleeToUpdate = _ref.calleeToUpdate,
      setCalleeToUpdate = _ref.setCalleeToUpdate,
      onComplete = _ref.onComplete,
      onReject = _ref.onReject,
      userEmail = _ref.userEmail,
      resetPhoneNumberPropertyStatus = _ref.resetPhoneNumberPropertyStatus,
      editPermissionsResults = _ref.editPermissionsResults,
      objectIdContext = _ref.objectIdContext,
      objectTypeIdContext = _ref.objectTypeIdContext;
  var callExtensions = useContext(CallExtensionsContext);

  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      disabled = _useState2[0],
      setDisabled = _useState2[1];

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      validatedNumber = _useState4[0],
      setValidatedNumber = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      isValidatingNumber = _useState6[0],
      setIsValidatingNumber = _useState6[1];

  var selectedPropertyName = calleeToUpdate && getPropertyName(calleeToUpdate) || null;
  var sendCalleeUpdateMessage = useCallback(function () {
    var message = createUpdateCalleeMessage({
      objectId: objectIdContext,
      objectTypeId: objectTypeIdContext
    });
    callExtensions.postMessageToHost(message);
  }, [callExtensions, objectIdContext, objectTypeIdContext]);
  var saveProperty = useCallback(function () {
    setDisabled(true);
    var objectId = getObjectId(selectedObject);
    var objectTypeId = getObjectTypeId(selectedObject);
    addPhoneNumberProperty({
      objectId: objectId,
      objectTypeId: objectTypeId,
      property: selectedPropertyName,
      rawValue: getRawNumber(validatedNumber),
      validatedNumber: validatedNumber,
      userEmail: userEmail
    }).then(function () {
      sendCalleeUpdateMessage();
    });
  }, [selectedObject, addPhoneNumberProperty, selectedPropertyName, validatedNumber, userEmail, sendCalleeUpdateMessage]);
  var removeProperty = useCallback(function () {
    var objectId = getObjectId(selectedObject);
    var objectTypeId = getObjectTypeId(selectedObject);
    removePhoneNumberProperty({
      objectId: objectId,
      objectTypeId: objectTypeId,
      propertyName: selectedPropertyName
    }).then(function () {
      sendCalleeUpdateMessage();
      onReject();
    });
  }, [selectedObject, removePhoneNumberProperty, selectedPropertyName, sendCalleeUpdateMessage, onReject]);
  var handleDeleteNumber = useCallback(function () {
    var objectId = getObjectId(selectedObject);
    var objectTypeId = getObjectTypeId(selectedObject);
    addPhoneNumberProperty({
      objectId: objectId,
      objectTypeId: objectTypeId,
      property: selectedPropertyName,
      validatedNumber: validatedNumber,
      rawValue: '',
      userEmail: userEmail
    }).then(function () {
      sendCalleeUpdateMessage();
    });
  }, [selectedObject, addPhoneNumberProperty, selectedPropertyName, validatedNumber, userEmail, sendCalleeUpdateMessage]);
  var handlePropertyChange = useCallback(function (propertyName) {
    setCalleeToUpdate({
      calleeToUpdate: new PhoneNumberIdentifier({
        objectTypeId: calleeToUpdate.get('objectTypeId'),
        objectId: getObjectId(calleeToUpdate),
        propertyName: propertyName
      }),
      updateType: ADDING
    });
  }, [calleeToUpdate, setCalleeToUpdate]);
  var handleAddedNumberChange = useCallback(function (_ref2) {
    var updatedValidatedNumber = _ref2.validatedNumber,
        isValid = _ref2.isValid;
    setDisabled(!isValid);
    setValidatedNumber(updatedValidatedNumber);
    setIsValidatingNumber(false);
  }, []);
  var isAsyncUpdatesStarted = calleesUpdatesStatus === STARTED;
  var ConfirmButton = useMemo(function () {
    return function (props) {
      return /*#__PURE__*/_jsx(UITooltip, {
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "callee-selection.phoneNumbers.validatingPhoneNumber"
        }),
        disabled: !isValidatingNumber,
        placement: "top right",
        children: /*#__PURE__*/_jsx(UILoadingButton, Object.assign({
          loading: isAsyncUpdatesStarted || isValidatingNumber
        }, props))
      });
    };
  }, [isAsyncUpdatesStarted, isValidatingNumber]);

  var _useMemo = useMemo(function () {
    var objectTypeId = getObjectTypeId(selectedObject);
    var objectId = getObjectId(selectedObject);
    var editableKey = createPropertyKey({
      objectTypeId: objectTypeId,
      objectId: objectId
    });
    var editResult = editPermissionsResults && editPermissionsResults.get(editableKey);
    var hasEditResult = Boolean(editResult);
    var canEditContact = hasEditResult && Boolean(editResult.get('canEdit'));
    var isLoading = hasEditResult && Boolean(editResult.get('isLoading'));
    return {
      canEdit: canEditContact,
      isPermissionsLoading: !hasEditResult || isLoading
    };
  }, [editPermissionsResults, selectedObject]),
      canEdit = _useMemo.canEdit,
      isPermissionsLoading = _useMemo.isPermissionsLoading;

  var errorMessage = useMemo(function () {
    return !isPermissionsLoading && !canEdit ? /*#__PURE__*/_jsx(UIAlert, {
      type: "warning",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "callee-selection.phoneNumberErrors.noAddPermissions"
      })
    }) : null;
  }, [canEdit, isPermissionsLoading]);
  useEffect(function () {
    if (calleesUpdatesStatus === SUCCEEDED) {
      resetPhoneNumberPropertyStatus();
      onComplete();
    }
  }, [calleesUpdatesStatus, onComplete, resetPhoneNumberPropertyStatus]);
  var disableConfirm = disabled || isValidatingNumber || isAsyncUpdatesStarted;
  return /*#__PURE__*/_jsx(FullscreenModal, {
    onConfirm: saveProperty,
    onReject: onReject,
    disableConfirm: disableConfirm,
    ConfirmButton: ConfirmButton,
    errorMessage: errorMessage,
    bodyClassName: errorMessage ? 'p-top-0' : '',
    children: calleeToUpdate && /*#__PURE__*/_jsx(UpdateCalleeNumbersContainer, {
      addProperty: saveProperty,
      removeProperty: removeProperty,
      onNumberChange: handleAddedNumberChange,
      onPropertyChange: handlePropertyChange,
      selectedObject: selectedObject,
      selectedPropertyName: selectedPropertyName,
      onDeleteNumber: handleDeleteNumber,
      isAsyncUpdatesStarted: isAsyncUpdatesStarted,
      setIsValidatingNumber: setIsValidatingNumber,
      isValidatingNumber: isValidatingNumber,
      canEdit: canEdit,
      isPermissionsLoading: isPermissionsLoading
    })
  });
}

UpdateCalleeNumbersModal.propTypes = {
  addPhoneNumberProperty: PropTypes.func.isRequired,
  removePhoneNumberProperty: PropTypes.func.isRequired,
  calleesUpdatesStatus: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired,
  calleeToUpdate: RecordPropType('PhoneNumberIdentifier'),
  selectedObject: RecordPropType('CallableObject'),
  setCalleeToUpdate: PropTypes.func.isRequired,
  resetPhoneNumberPropertyStatus: PropTypes.func.isRequired,
  editPermissionsResults: ImmutablePropTypes.map,
  objectIdContext: PropTypes.string.isRequired,
  objectTypeIdContext: PropTypes.string.isRequired
};
export default UpdateCalleeNumbersModal;