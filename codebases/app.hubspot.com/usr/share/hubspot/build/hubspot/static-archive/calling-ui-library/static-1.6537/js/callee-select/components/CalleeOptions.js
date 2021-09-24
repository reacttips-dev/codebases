'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import CalleeNumberOptions from './CalleeNumberOptions';
import { getPhoneNumberProperties, getValue } from 'calling-lifecycle-internal/callees/operators/calleesOperators';

var getPhoneNumberValue = function getPhoneNumberValue(phoneNumberProperty) {
  return getValue(phoneNumberProperty);
};

function CalleeOptions(_ref) {
  var editPermissionsResults = _ref.editPermissionsResults,
      callableObjectList = _ref.callableObjectList,
      onEditProperty = _ref.onEditProperty,
      onSelectToNumber = _ref.onSelectToNumber,
      disabled = _ref.disabled,
      OptionIcon = _ref.OptionIcon,
      onAddPropertyClick = _ref.onAddPropertyClick,
      TourStepOne = _ref.TourStepOne,
      showCalleeNames = _ref.showCalleeNames;
  var hasWrappedFirstNumberInTourStep = useRef(false);
  var callableObjectArray = useMemo(function () {
    return callableObjectList.toArray();
  }, [callableObjectList]);
  return /*#__PURE__*/_jsx("div", {
    className: "m-top-2",
    children: callableObjectArray.map(function (callableObject) {
      // Only render the TourStepOne for the first phone number in the list
      var callableOptions = getPhoneNumberProperties(callableObject);
      var hasPhoneNumberValue = callableOptions.find(getPhoneNumberValue);
      var TourComponent = null;

      if (hasPhoneNumberValue && !hasWrappedFirstNumberInTourStep.current) {
        TourComponent = TourStepOne;
        hasWrappedFirstNumberInTourStep.current = true;
      }

      return /*#__PURE__*/_jsx(CalleeNumberOptions, {
        editPermissionsResults: editPermissionsResults,
        callableObject: callableObject,
        onEditProperty: onEditProperty,
        onSelectToNumber: onSelectToNumber,
        disabled: disabled,
        OptionIcon: OptionIcon,
        onAddPropertyClick: onAddPropertyClick,
        TourStepOne: TourComponent,
        showCalleeNames: showCalleeNames
      }, callableObject.hashCode());
    })
  });
}

CalleeOptions.propTypes = {
  onEditProperty: PropTypes.func,
  onSelectToNumber: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  editPermissionsResults: ImmutablePropTypes.map,
  callableObjectList: ImmutablePropTypes.orderedMap,
  OptionIcon: PropTypes.object,
  onAddPropertyClick: PropTypes.func,
  TourStepOne: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  showCalleeNames: PropTypes.bool.isRequired
};
CalleeOptions.defaultProps = {
  editPermissionsResults: null
};
export default /*#__PURE__*/memo(CalleeOptions);