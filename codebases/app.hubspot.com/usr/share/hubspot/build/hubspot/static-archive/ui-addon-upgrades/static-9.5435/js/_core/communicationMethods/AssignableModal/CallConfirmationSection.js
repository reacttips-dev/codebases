'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import H4 from 'UIComponents/elements/headings/H4';
import H6 from 'UIComponents/elements/headings/H6';
import Small from 'UIComponents/elements/Small';
import UILink from 'UIComponents/link/UILink';
import getSalesPhoneNumber from '../../common/adapters/getSalesPhoneNumber';
var PHONE_NUMBERS_URL = 'https://www.hubspot.com/company/contact';
export var CallConfirmationSection = function CallConfirmationSection() {
  var _getSalesPhoneNumber = getSalesPhoneNumber(),
      salesPhoneNumber = _getSalesPhoneNumber.phoneNumber,
      countryCode = _getSalesPhoneNumber.countryCode;

  return /*#__PURE__*/_jsxs("div", {
    className: "communication-call-submit-success",
    children: [/*#__PURE__*/_jsx("p", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "upgrades.communicationMethods.callSuccess"
      })
    }), /*#__PURE__*/_jsx(H6, {
      className: "is--heading-6 uppercase",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "upgrades.communicationMethods.localization.or"
      })
    }), /*#__PURE__*/_jsx("span", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "upgrades.communicationMethods.localization.callNow"
      })
    }), /*#__PURE__*/_jsx(H4, {
      className: "is--heading-4 m-bottom-0",
      children: salesPhoneNumber
    }), /*#__PURE__*/_jsx(Small, {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "SharedI18nStrings.countryCodes." + countryCode
      })
    }), /*#__PURE__*/_jsx("p", {
      className: "m-top-8",
      children: /*#__PURE__*/_jsx(UILink, {
        href: PHONE_NUMBERS_URL,
        external: true,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "upgrades.communicationMethods.localization.viewAllButton"
        })
      })
    })]
  });
};