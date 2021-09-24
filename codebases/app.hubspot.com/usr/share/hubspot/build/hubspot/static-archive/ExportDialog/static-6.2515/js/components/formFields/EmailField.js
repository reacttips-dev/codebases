'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";

var _stateToLang;

import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import Big from 'UIComponents/elements/Big';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UITextInput from 'UIComponents/input/UITextInput';
import { EmailValidationStates, EmailValidationStateNames } from 'ExportDialog/Constants';

function createValueExtractor(onChangeCallback) {
  return function (event) {
    onChangeCallback(event.target.value);
  };
}

var stateToLang = (_stateToLang = {}, _defineProperty(_stateToLang, EmailValidationStates.VALID, null), _defineProperty(_stateToLang, EmailValidationStates.INVALID, /*#__PURE__*/_jsx(FormattedMessage, {
  message: "exportDialog.emailErrors.invalidEmail"
})), _stateToLang);

var isSend = function isSend(preference) {
  return preference === 'SEND';
};

var isEmailNotValid = function isEmailNotValid(validationState) {
  return validationState !== EmailValidationStates.VALID;
};

var getNotificationText = function getNotificationText(email, notification, value) {
  if (email && notification) {
    return /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "exportDialog.preference.exportToBothText",
      options: {
        value: value
      }
    });
  } else if (email) {
    return /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "exportDialog.preference.exportToEmailText",
      options: {
        value: value
      }
    });
  } else {
    return /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "exportDialog.preference.exportToNotificationCenterText"
    });
  }
};

var EmailField = function EmailField(_ref) {
  var onChange = _ref.onChange,
      validationState = _ref.validationState,
      value = _ref.value,
      preferences = _ref.preferences;

  if (isEmailNotValid(validationState, value)) {
    return /*#__PURE__*/_jsx(UIFormControl, {
      label: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "exportDialog.fields.emailLabel"
      }),
      help: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "exportDialog.fields.emailDescription"
      }),
      error: validationState !== EmailValidationStates.VALID,
      validationMessage: stateToLang[validationState],
      className: "m-bottom-6",
      children: /*#__PURE__*/_jsx(UITextInput, {
        value: value,
        onChange: createValueExtractor(onChange)
      })
    });
  }

  return /*#__PURE__*/_jsx(Big, {
    className: "m-bottom-6",
    tagName: "p",
    children: getNotificationText(isSend(preferences.EMAIL), isSend(preferences.NOTIFICATION_SIDEBAR), value)
  });
};

EmailField.propTypes = {
  onChange: PropTypes.func.isRequired,
  validationState: PropTypes.oneOf(EmailValidationStateNames).isRequired,
  value: PropTypes.string.isRequired,
  preferences: PropTypes.object
};
export default EmailField;