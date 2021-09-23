'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback, useEffect } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import UIIcon from 'UIComponents/icon/UIIcon';
import FormattedMessage from 'I18n/components/FormattedMessage';
import styled from 'styled-components';
import classNames from 'classnames';
import { EERIE, CALYPSO_LIGHT } from 'HubStyleTokens/colors';
import UIIconButton from 'UIComponents/button/UIIconButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import PhoneNumberWithProperty from './PhoneNumberWithProperty';
import { getValue, getPropertyName, getObjectId } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
import { logCallingError } from 'calling-error-reporting/report/error';
import { PhoneNumberIdentifier } from 'calling-lifecycle-internal/callees/records/PhoneNumberIdentifier';
import { getObjectTypeId } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
var Wrapper = styled.div.withConfig({
  displayName: "PhoneNumberOption__Wrapper",
  componentId: "sc-4yjia1-0"
})(["cursor:pointer;background-color:transparent;&.is--disabled{opacity:0.5;}&:hover{background-color:", ";}"], CALYPSO_LIGHT);
export function PhoneNumberOption(_ref) {
  var className = _ref.className,
      onSelect = _ref.onSelect,
      onEditProperty = _ref.onEditProperty,
      phoneNumberProperty = _ref.phoneNumberProperty,
      callableObject = _ref.callableObject,
      editPermissions = _ref.editPermissions,
      disabled = _ref.disabled,
      OptionIcon = _ref.OptionIcon;
  var phoneNumberValue = getValue(phoneNumberProperty);
  var propertyName = getPropertyName(phoneNumberProperty);
  useEffect(function () {
    if (!phoneNumberValue) {
      logCallingError({
        errorMessage: 'PhoneNumberOption displayed a number without a value',
        extraData: {
          phoneNumberProperty: phoneNumberProperty,
          callableObject: callableObject
        }
      });
    }
  }, [callableObject, phoneNumberProperty, phoneNumberValue]);
  var isLoadingPermissions = false;
  var canEdit = true;
  var tooltipKey = 'noEditPermissions';

  if (editPermissions) {
    isLoadingPermissions = editPermissions.get('isLoading');
    canEdit = editPermissions.get('canEdit');
    tooltipKey = isLoadingPermissions ? 'loadingPermissions' : tooltipKey;
  }

  var handleSelect = useCallback(function () {
    if (!disabled && phoneNumberValue) {
      var numberIdentifier = new PhoneNumberIdentifier({
        objectTypeId: getObjectTypeId(callableObject),
        objectId: getObjectId(callableObject),
        propertyName: propertyName
      });
      onSelect({
        numberIdentifier: numberIdentifier,
        callableObject: callableObject
      });
    }
  }, [disabled, phoneNumberValue, propertyName, onSelect, callableObject]);
  var handleEditOption = useCallback(function (evt) {
    evt.stopPropagation();
    onEditProperty(callableObject, phoneNumberProperty);
  }, [callableObject, onEditProperty, phoneNumberProperty]);
  var classes = classNames('calling-phone-option align-center p-y-2 p-x-3', className, disabled && 'is--disabled');
  return /*#__PURE__*/_jsxs(Wrapper, {
    className: classes,
    onClick: handleSelect,
    "data-number-property": propertyName,
    "data-object-id": getObjectId(callableObject),
    "data-raw-number": phoneNumberValue,
    children: [/*#__PURE__*/_jsxs("div", {
      style: {
        flexGrow: 1
      },
      children: [OptionIcon && /*#__PURE__*/_jsx(OptionIcon, {}), /*#__PURE__*/_jsx(PhoneNumberWithProperty, {
        phoneNumberProperty: phoneNumberProperty
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "m-left-2",
      children: onEditProperty && /*#__PURE__*/_jsx(UITooltip, {
        disabled: canEdit,
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "callee-selection.phoneNumberErrors." + tooltipKey
        }),
        children: /*#__PURE__*/_jsx(UIIconButton, {
          style: {
            zIndex: 100
          },
          use: "unstyled",
          "data-selenium-test": "edit-number-button",
          onClick: handleEditOption,
          disabled: !canEdit || isLoadingPermissions,
          children: /*#__PURE__*/_jsx(UIIcon, {
            name: "edit",
            size: "xxs",
            color: EERIE
          })
        })
      })
    })]
  });
}
PhoneNumberOption.propTypes = {
  className: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onEditProperty: PropTypes.func,
  editPermissions: ImmutablePropTypes.map,
  disabled: PropTypes.bool,
  OptionIcon: PropTypes.object,
  phoneNumberProperty: RecordPropType('PhoneNumberProperty').isRequired,
  callableObject: RecordPropType('CallableObject').isRequired
};
PhoneNumberOption.defaultProps = {
  editPermissions: null,
  disabled: false,
  OptionIcon: null
};
export default /*#__PURE__*/memo(PhoneNumberOption);