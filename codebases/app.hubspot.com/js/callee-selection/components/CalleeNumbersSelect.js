'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useEffect, useMemo, useState, useCallback } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import FormattedMessage from 'I18n/components/FormattedMessage';
import styled from 'styled-components';
import { EERIE } from 'HubStyleTokens/colors';
import { logCallingError } from 'calling-error-reporting/report/error';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import UIAlert from 'UIComponents/alert/UIAlert';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import PropTypes from 'prop-types';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';
import { isFailed, isUninitialized, isStarted } from 'conversations-async-data/async-data/operators/statusComparators';
import { getObjectTypeId, getPropertyName, getObjectId, getPhoneNumberProperties, getValue } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
import CalleeDropdownSkeleton from 'calling-lifecycle-internal/skeleton-states/components/CalleeDropdownSkeleton';
import PhoneNumberWithProperty from 'calling-ui-library/callee-select/components/PhoneNumberWithProperty';
import CalleeSkeleton from 'calling-lifecycle-internal/skeleton-states/components/CalleeSkeleton';
import UpdateCalleeNumbersModalContainer from '../containers/UpdateCalleeNumbersModalContainer';
import ObjectTypeIdType from 'customer-data-objects-ui-components/propTypes/ObjectTypeIdType';
import CalleeOptionsWrapperContainer from '../containers/CalleeOptionsWrapperContainer';
import { PhoneNumberIdentifier } from 'calling-lifecycle-internal/callees/records/PhoneNumberIdentifier';
import { ADDING, EDITING } from '../../callees/operators/updatePropertyTypes';
import { isCallableObjectTypeId } from 'calling-lifecycle-internal/callees/operators/isCallableObjectTypeId';
import CalleeName from '../../callee-name/components/CalleeName';
var StyledUIDropdown = styled(UIDropdown).withConfig({
  displayName: "CalleeNumbersSelect__StyledUIDropdown",
  componentId: "sc-2wnlik-0"
})(["max-height:", ";overflow:auto;"], function (_ref) {
  var maxheight = _ref.maxheight;
  return maxheight;
});
var Caret = styled.div.withConfig({
  displayName: "CalleeNumbersSelect__Caret",
  componentId: "sc-2wnlik-1"
})(["border-color:transparent;border-style:solid;border-width:0.3125em;display:inline-block;vertical-align:middle;border-top-color:", ";margin-top:0.3125em;align-self:center;flex-shrink:0;"], EERIE);
var StyledUIButton = styled(UIButton).withConfig({
  displayName: "CalleeNumbersSelect__StyledUIButton",
  componentId: "sc-2wnlik-2"
})([".truncated-button-text{flex:1;min-width:0;text-overflow:ellipsis;overflow:hidden;}"]);

function CalleeNumbersSelect(props) {
  var callees = props.callees,
      setCalleeToUpdate = props.setCalleeToUpdate,
      clearCalleeToUpdate = props.clearCalleeToUpdate,
      onChange = props.onChange,
      toNumberIdentifier = props.toNumberIdentifier,
      isUpdatingProperty = props.isUpdatingProperty,
      selectedPhoneNumberProperty = props.selectedPhoneNumberProperty,
      isTwilioBasedCallProvider = props.isTwilioBasedCallProvider,
      callableObjectList = props.callableObjectList,
      hasNoAssociatedCallees = props.hasNoAssociatedCallees,
      selectedCallableObject = props.selectedCallableObject,
      resetPhoneNumberPropertyStatus = props.resetPhoneNumberPropertyStatus,
      appIdentifier = props.appIdentifier;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isOpen = _useState2[0],
      setIsOpen = _useState2[1];

  useEffect(function () {
    // Specific to deleting a number we specifically
    // set the toNumberIdentifier to null in the reducer
    if (!toNumberIdentifier && callableObjectList.size > 0) {
      var _propertyName;

      var firstCallableObjectWithNumbers = callableObjectList.find(function (callableObject) {
        var numberProperties = getPhoneNumberProperties(callableObject);
        var propertyWithNumber = numberProperties.find(getValue);
        _propertyName = propertyWithNumber && getPropertyName(propertyWithNumber);
        return _propertyName;
      });

      if (firstCallableObjectWithNumbers) {
        onChange({
          toNumberIdentifier: new PhoneNumberIdentifier({
            objectTypeId: getObjectTypeId(firstCallableObjectWithNumbers),
            objectId: getObjectId(firstCallableObjectWithNumbers),
            propertyName: _propertyName
          }),
          callee: firstCallableObjectWithNumbers
        });
        return;
      }

      var firstCallableObject = callableObjectList.find(function (callableObject) {
        return isCallableObjectTypeId(getObjectTypeId(callableObject));
      });

      if (firstCallableObject) {
        onChange({
          toNumberIdentifier: new PhoneNumberIdentifier({
            objectTypeId: getObjectTypeId(firstCallableObject),
            objectId: getObjectId(firstCallableObject)
          }),
          callee: firstCallableObjectWithNumbers
        });
      }
    }
  }, [callableObjectList, onChange, toNumberIdentifier]);
  var handleAddPropertyClick = useCallback(function (_ref2) {
    var callableObjectToEdit = _ref2.callableObject;

    if (!callableObjectToEdit) {
      callableObjectToEdit = callableObjectList.find(function (callableObject) {
        return isCallableObjectTypeId(getObjectTypeId(callableObject));
      });
    }

    setCalleeToUpdate({
      callee: callableObjectToEdit,
      calleeToUpdate: new PhoneNumberIdentifier({
        objectTypeId: getObjectTypeId(callableObjectToEdit),
        objectId: getObjectId(callableObjectToEdit)
      }),
      updateType: ADDING
    });
    setIsOpen(false);
  }, [callableObjectList, setCalleeToUpdate]);
  var handleToggleDropdown = useCallback(function () {
    setIsOpen(!isOpen);
  }, [isOpen]);
  var handleSelectToNumber = useCallback(function (_ref3) {
    var numberIdentifier = _ref3.numberIdentifier,
        callableObject = _ref3.callableObject;
    onChange({
      toNumberIdentifier: numberIdentifier,
      callee: callableObject
    });
    setIsOpen(false);
    CommunicatorLogger.log('communicatorInteraction', {
      action: 'Change "to" number',
      activity: 'call',
      channel: 'outbound call',
      source: appIdentifier
    });
  }, [onChange, appIdentifier]);
  var handleEditProperty = useCallback(function (callableObject, phoneNumberProperty) {
    resetPhoneNumberPropertyStatus();
    setCalleeToUpdate({
      callee: callableObject,
      calleeToUpdate: new PhoneNumberIdentifier({
        objectTypeId: getObjectTypeId(callableObject),
        objectId: getObjectId(callableObject),
        propertyName: getPropertyName(phoneNumberProperty)
      }),
      updateType: EDITING
    });
    setIsOpen(false);
  }, [resetPhoneNumberPropertyStatus, setCalleeToUpdate]);
  var closeUpdatePropertyModal = useCallback(function () {
    clearCalleeToUpdate();
  }, [clearCalleeToUpdate]);
  var buttonText = useMemo(function () {
    if (selectedPhoneNumberProperty && getValue(selectedPhoneNumberProperty)) {
      return /*#__PURE__*/_jsx(PhoneNumberWithProperty, {
        phoneNumberProperty: selectedPhoneNumberProperty
      });
    } else if (selectedPhoneNumberProperty) {
      logCallingError({
        errorMessage: 'selectedPhoneNumberProperty is set without a number value',
        extraData: {
          selectedPhoneNumberProperty: selectedPhoneNumberProperty,
          selectedCallableObject: selectedCallableObject
        }
      });
    }

    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "callee-selection.selectCalleePrompt"
    });
  }, [selectedCallableObject, selectedPhoneNumberProperty]);
  var CalleeSelectButton = useMemo(function () {
    return function (buttonProps) {
      return /*#__PURE__*/_jsx(StyledUIButton, Object.assign({}, buttonProps, {
        responsive: false,
        use: "transparent",
        className: "p-left-0 m-all-0 p-top-0 p-bottom-1 text-left",
        children: /*#__PURE__*/_jsxs("div", {
          className: "align-center",
          children: [/*#__PURE__*/_jsx("div", {
            className: "truncated-button-text",
            children: buttonText
          }), /*#__PURE__*/_jsx(Caret, {
            className: "m-left-2"
          })]
        })
      }));
    };
  }, [buttonText]);

  if (isFailed(callees)) {
    return /*#__PURE__*/_jsx(UIAlert, {
      type: "danger",
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "callee-selection.asyncError.title"
      }),
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "callee-selection.asyncError.body"
      })
    });
  }

  if (isUninitialized(callees) || isStarted(callees)) {
    return /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(CalleeSkeleton, {
        className: "m-top-1 m-bottom-2"
      }), /*#__PURE__*/_jsx(CalleeDropdownSkeleton, {
        className: "m-bottom-1"
      })]
    });
  }

  var placement = isTwilioBasedCallProvider ? 'bottom left' : 'top left'; // no associations are callable

  if (hasNoAssociatedCallees) {
    return /*#__PURE__*/_jsx("strong", {
      className: "display-block m-y-2",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "callee-selection.phoneNumbers.noAssociatedCallees"
      })
    });
  }

  var propertyName = getPropertyName(toNumberIdentifier);
  return /*#__PURE__*/_jsxs("div", {
    children: [selectedCallableObject ? /*#__PURE__*/_jsx("div", {
      "data-test-id": "callee-name",
      children: propertyName ? /*#__PURE__*/_jsx(CalleeName, {
        calleeObject: selectedCallableObject
      }) : /*#__PURE__*/_jsx(FormattedMessage, {
        message: "callee-selection.phoneNumbers.call"
      })
    }) : /*#__PURE__*/_jsx(CalleeSkeleton, {
      className: "p-top-1 p-bottom-2"
    }), /*#__PURE__*/_jsx(StyledUIDropdown, {
      "data-selenium-test": "calling-widget-callee-numbers-dropdown",
      open: isOpen,
      onOpenChange: handleToggleDropdown,
      className: "m-left-0 p-y-0",
      maxheight: isTwilioBasedCallProvider ? 'calc(100vh - 70px)' : '175px',
      Button: CalleeSelectButton,
      placement: placement,
      children: /*#__PURE__*/_jsx(CalleeOptionsWrapperContainer, {
        calleesData: getData(callees),
        onSelectToNumber: handleSelectToNumber,
        onEditProperty: handleEditProperty,
        onAddPropertyClick: handleAddPropertyClick,
        callableObjectList: callableObjectList
      })
    }), isUpdatingProperty ? /*#__PURE__*/_jsx(UpdateCalleeNumbersModalContainer, {
      onComplete: closeUpdatePropertyModal,
      onReject: closeUpdatePropertyModal
    }) : null]
  });
}

CalleeNumbersSelect.propTypes = {
  callees: RecordPropType('AsyncData'),
  callableObjectList: ImmutablePropTypes.orderedMap.isRequired,
  clearCalleesSearch: PropTypes.func.isRequired,
  setCalleeToUpdate: PropTypes.func.isRequired,
  clearCalleeToUpdate: PropTypes.func.isRequired,
  objectTypeId: ObjectTypeIdType.isRequired,
  isUpdatingProperty: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  selectedPhoneNumberProperty: RecordPropType('PhoneNumberProperty'),
  toNumberIdentifier: RecordPropType('PhoneNumberIdentifier'),
  validatedToNumber: RecordPropType('AsyncData'),
  selectedCallableObject: RecordPropType('CallableObject'),
  hasNoAssociatedCallees: PropTypes.bool.isRequired,
  isTwilioBasedCallProvider: PropTypes.bool.isRequired,
  resetPhoneNumberPropertyStatus: PropTypes.func.isRequired,
  appIdentifier: PropTypes.string.isRequired
};
export default /*#__PURE__*/memo(CalleeNumbersSelect);