'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

var _stateToLang;

import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UITextInput from 'UIComponents/input/UITextInput';
import Small from 'UIComponents/elements/Small';
import H7 from 'UIComponents/elements/headings/H7';
import HR from 'UIComponents/elements/HR';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIHelpLink from 'UIComponents/tooltip/UIHelpLink';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UILink from 'UIComponents/link/UILink';
import styled from 'styled-components';
import { EmailValidationStates, EmailValidationStateNames, Urls } from 'ExportDialog/Constants';

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
    return /*#__PURE__*/_jsx(FormattedJSXMessage, {
      message: "exportDialog.preference.exportToBothText_jsx",
      options: {
        url: Urls.notificationCenterUrl,
        value: value
      },
      elements: {
        Link: UILink
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
    return /*#__PURE__*/_jsx(FormattedJSXMessage, {
      message: "exportDialog.preference.exportToNotificationCenterText_jsx",
      options: {
        url: Urls.notificationCenterUrl
      },
      elements: {
        Link: UILink
      }
    });
  }
};

var getEmailInputField = function getEmailInputField(validationState, value, onChange) {
  return /*#__PURE__*/_jsx(UIFormControl, {
    className: "p-top-0",
    label: /*#__PURE__*/_jsx(Small, {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "exportDialog.fields.emailAddressLabel"
      })
    }),
    help: /*#__PURE__*/_jsx(Small, {
      use: "help",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "exportDialog.fields.emailAddressLabelDescription"
      })
    }),
    error: validationState !== EmailValidationStates.VALID,
    validationMessage: stateToLang[validationState],
    children: /*#__PURE__*/_jsx(UITextInput, {
      value: value,
      onChange: createValueExtractor(onChange)
    })
  });
};

var getNotificationHelpText = function getNotificationHelpText(preferences, value) {
  return /*#__PURE__*/_jsx(Small, {
    use: "help",
    children: getNotificationText(isSend(preferences.EMAIL), isSend(preferences.NOTIFICATION_SIDEBAR), value)
  });
};

var StyledH7 = styled(H7).withConfig({
  displayName: "EmailFieldAndNotificationHelpText__StyledH7",
  componentId: "go760u-0"
})(["line-height:24px;"]);

var EmailFieldAndNotificationHelpText = function EmailFieldAndNotificationHelpText(_ref) {
  var onChange = _ref.onChange,
      validationState = _ref.validationState,
      value = _ref.value,
      preferences = _ref.preferences;
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsxs(UIFlex, {
      align: "start",
      justify: "between",
      direction: "row",
      children: [/*#__PURE__*/_jsx("div", {
        children: /*#__PURE__*/_jsx(StyledH7, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "exportDialog.preference.sendTo"
          })
        })
      }), /*#__PURE__*/_jsx("div", {
        children: /*#__PURE__*/_jsx(UIHelpLink, {
          defaultOpen: false,
          showCloseButton: true,
          content: {
            body: /*#__PURE__*/_jsx("p", {
              className: "p-top-3 p-x-3",
              children: /*#__PURE__*/_jsx(Small, {
                use: "help",
                style: {
                  textAlign: 'center'
                },
                children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
                  message: "exportDialog.preference.allowlistHelpText_jsx",
                  options: {
                    allowlistUrl: Urls.allowlistUrl,
                    notificationUrl: Urls.notificationUrl
                  },
                  elements: {
                    Link: UILink
                  }
                })
              })
            })
          },
          children: /*#__PURE__*/_jsx(Small, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "exportDialog.preference.notGettingEmail"
            })
          })
        })
      })]
    }), isEmailNotValid(validationState, value) ? getEmailInputField(validationState, value, onChange) : getNotificationHelpText(preferences, value), /*#__PURE__*/_jsx(HR, {})]
  });
};

EmailFieldAndNotificationHelpText.propTypes = {
  onChange: PropTypes.func.isRequired,
  validationState: PropTypes.oneOf(EmailValidationStateNames).isRequired,
  value: PropTypes.string.isRequired,
  preferences: PropTypes.object
};
export default EmailFieldAndNotificationHelpText;