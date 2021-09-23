'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import partial from 'transmute/partial';
import { COMPANY_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import PhoneNumberOption from './PhoneNumberOption';
import AddNumberToCallee from './AddNumberToCallee';
import CalleeObjectGroupOption from './CalleeObjectGroupOption';
import { createPropertyKey } from 'calling-lifecycle-internal/callees/operators/getPropertyKeys';
import { getPhoneNumberProperties, getObjectTypeId, getObjectId, getValue } from 'calling-lifecycle-internal/callees/operators/calleesOperators';

function CalleeNumbersOptions(_ref) {
  var editPermissionsResults = _ref.editPermissionsResults,
      callableObject = _ref.callableObject,
      onEditProperty = _ref.onEditProperty,
      onSelectToNumber = _ref.onSelectToNumber,
      disabled = _ref.disabled,
      OptionIcon = _ref.OptionIcon,
      onAddPropertyClick = _ref.onAddPropertyClick,
      TourStepOne = _ref.TourStepOne,
      showCalleeNames = _ref.showCalleeNames;
  var hasWrappedFirstNumberInTourStep = useRef(false);
  var callableOptions = getPhoneNumberProperties(callableObject);
  var optionText = "getText(option)";
  var objectId = getObjectId(callableObject);
  var objectTypeId = getObjectTypeId(callableObject);
  var canAddNumber = objectTypeId !== COMPANY_TYPE_ID || objectTypeId === COMPANY_TYPE_ID && !getValue(callableOptions.first());
  var editPermissions;

  if (editPermissionsResults) {
    var propertyKey = createPropertyKey({
      objectId: objectId,
      objectTypeId: objectTypeId
    });
    editPermissions = editPermissionsResults.get(propertyKey);
  }

  var options = useMemo(function () {
    return callableOptions.reduce(function (array, phoneNumberProperty) {
      var groupedOptionValue = getValue(phoneNumberProperty);

      if (!groupedOptionValue) {
        return array;
      }

      var OptionComponent = /*#__PURE__*/_jsx(PhoneNumberOption, {
        className: "p-left-4",
        phoneNumberProperty: phoneNumberProperty,
        onSelect: onSelectToNumber,
        callableObject: callableObject,
        editPermissions: editPermissions,
        onEditProperty: onEditProperty,
        disabled: disabled,
        OptionIcon: OptionIcon
      }, callableObject.hashCode() + "__" + phoneNumberProperty.hashCode());

      if (!hasWrappedFirstNumberInTourStep.current && TourStepOne) {
        hasWrappedFirstNumberInTourStep.current = true;
        array.push( /*#__PURE__*/_jsx(TourStepOne, {
          children: OptionComponent
        }, "calling-tour-step-one"));
      } else {
        array.push(OptionComponent);
      }

      return array;
    }, []);
  }, [OptionIcon, TourStepOne, callableObject, callableOptions, disabled, editPermissions, onEditProperty, onSelectToNumber]);
  var calleeName = showCalleeNames ? /*#__PURE__*/_jsx("div", {
    className: "m-top-1",
    children: /*#__PURE__*/_jsx(CalleeObjectGroupOption, {
      callableObject: callableObject,
      objectTypeId: objectTypeId
    })
  }, callableObject.hashCode()) : null;
  var addNumberLink = canAddNumber ? /*#__PURE__*/_jsx(AddNumberToCallee, {
    onClick: partial(onAddPropertyClick, {
      callableObject: callableObject
    }),
    editPermissions: editPermissions
  }, optionText + "_addNumber") : null;
  return [calleeName, options, addNumberLink];
}

CalleeNumbersOptions.propTypes = {
  onEditProperty: PropTypes.func,
  onSelectToNumber: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  editPermissionsResults: ImmutablePropTypes.map,
  options: ImmutablePropTypes.list,
  OptionIcon: PropTypes.object,
  onAddPropertyClick: PropTypes.func,
  TourStepOne: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  showCalleeNames: PropTypes.bool.isRequired
};
CalleeNumbersOptions.defaultProps = {
  editPermissionsResults: null
};
export default /*#__PURE__*/memo(CalleeNumbersOptions);