'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import PropTypes from 'prop-types';
import { upgradeDataPropsInterface } from '../../common/data/upgradeData/interfaces/upgradeDataPropsInterface';
import { submitAdditionalPqlForm } from '../../pql/submitPql';
import { track } from '../../common/eventTracking/tracker';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H2 from 'UIComponents/elements/headings/H2';
import UIButton from 'UIComponents/button/UIButton';
import PhoneNumberInput from 'ui-addon-i18n/components/PhoneNumberInput';
import { CallConfirmationSection } from './CallConfirmationSection';
import { MODAL_TYPES } from '../constants';
export var GetACallSection = function GetACallSection(_ref) {
  var handleIframeSizeChange = _ref.handleIframeSizeChange,
      onBackClick = _ref.onBackClick,
      upgradeData = _ref.upgradeData;

  var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      phoneNumber = _useState2[0],
      setPhoneNumber = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isPhoneNumberSubmitted = _useState4[0],
      setIsPhoneNumberSubmitted = _useState4[1];

  var handleSubmit = function handleSubmit() {
    submitAdditionalPqlForm(Object.assign({}, upgradeData, {
      isAssignable: true,
      isRetail: false
    }), {
      phoneNumber: phoneNumber
    });
    track('communicationMethodsInteraction', Object.assign({
      action: 'submitted phone number'
    }, upgradeData));
    handleIframeSizeChange(MODAL_TYPES.PHONE_NUMBER_SUBMITTED);
    setIsPhoneNumberSubmitted(true);
  };

  if (isPhoneNumberSubmitted) {
    return /*#__PURE__*/_jsx(CallConfirmationSection, {});
  }

  var handleInputChange = function handleInputChange(_ref2) {
    var phoneNumberValue = _ref2.phoneNumber;
    setPhoneNumber(phoneNumberValue);
  };

  return /*#__PURE__*/_jsxs("div", {
    className: "text-center",
    "data-test-id": "communication-selected-method-call",
    children: [/*#__PURE__*/_jsx(H2, {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "upgrades.communicationMethods.callTitle"
      })
    }), /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx(PhoneNumberInput, {
        className: "m-bottom-6",
        style: {
          width: 'auto'
        },
        value: phoneNumber,
        onChange: handleInputChange
      }), /*#__PURE__*/_jsx(UIButton, {
        className: "communication-call-submit-button center-block m-bottom-4",
        onClick: handleSubmit,
        use: "primary",
        disabled: !phoneNumber,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "upgrades.communicationMethods.callButton"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        className: "communication-call-back-button center-block",
        use: "link",
        onClick: onBackClick,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "upgrades.communicationMethods.backButton"
        })
      })]
    })]
  });
};
GetACallSection.propTypes = Object.assign({
  handleIframeSizeChange: PropTypes.func.isRequired,
  onBackClick: PropTypes.func.isRequired
}, upgradeDataPropsInterface);