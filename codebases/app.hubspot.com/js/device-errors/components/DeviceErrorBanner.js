'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UILink from 'UIComponents/link/UILink';
import CallBanner from 'calling-settings-ui-library/banners/components/CallBanner';
import { createZorseTicketMessage } from 'calling-internal-common/iframe-events/internalEventMessageCreators';
import { getErrorCodeTranslationInfo, getIsSuspendedAccountError } from 'calling-ui-library/error-banner/operators/getErrorCodeTranslationInfo';
import CallExtensionsContext from '../../WidgetBase/context/CallingExtensionsContext';
import { SHOW_SUSPENDED_WARNING_MESSAGE } from '../../userSettings/constants/UserSettingsKeys';
import { getCode, getMessage } from 'calling-client-interface/operators/deviceErrorOperators';
import { getShouldShowEndCallState } from 'calling-internal-common/widget-status/operators/getCallState';
import ClientStatusPropType from 'calling-internal-common/widget-status/prop-types/ClientStatusPropType';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';

var DeviceErrorBanner = /*#__PURE__*/function (_PureComponent) {
  _inherits(DeviceErrorBanner, _PureComponent);

  function DeviceErrorBanner() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, DeviceErrorBanner);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DeviceErrorBanner)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleLogClickEvent = function () {
      var deviceError = _this.props.deviceError;
      CommunicatorLogger.log('communicator_bannerInteraction', {
        activity: 'call',
        channel: 'outbound call',
        source: 'communicator window',
        bannerType: 'Device Error',
        errorCode: getCode(deviceError) || 'unknown'
      });
    };

    _this.handleOpenSupportTicket = function () {
      var message = createZorseTicketMessage();

      _this.context.postMessageToHost(message);

      _this.handleLogClickEvent();
    };

    return _this;
  }

  _createClass(DeviceErrorBanner, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this$props = this.props,
          clientStatus = _this$props.clientStatus,
          deviceError = _this$props.deviceError,
          showSuspendedWarningMessage = _this$props.showSuspendedWarningMessage; // Twilio Suspended Account Error

      if (getIsSuspendedAccountError(deviceError) && !showSuspendedWarningMessage) {
        this.setShowSuspendedWarningMessageUserSettings(true);
      } else if (getShouldShowEndCallState(clientStatus) && !getIsSuspendedAccountError(deviceError) && showSuspendedWarningMessage) {
        this.setShowSuspendedWarningMessageUserSettings(false);
      }
    }
  }, {
    key: "setShowSuspendedWarningMessageUserSettings",
    value: function setShowSuspendedWarningMessageUserSettings(value) {
      var saveUserSetting = this.props.saveUserSetting;
      saveUserSetting({
        key: SHOW_SUSPENDED_WARNING_MESSAGE,
        value: value
      });
    }
  }, {
    key: "getMessage",
    value: function getMessage(code, _ref) {
      var messageKey = _ref.messageKey,
          jsxOptions = _ref.jsxOptions;
      var isPaidHub = this.props.isPaidHub;
      var Message;

      if (jsxOptions) {
        var openSupportTicket = jsxOptions.openSupportTicket,
            options = _objectWithoutProperties(jsxOptions, ["openSupportTicket"]);

        if (openSupportTicket) {
          options.onClick = this.handleOpenSupportTicket;
        } else {
          options.onClick = this.handleLogClickEvent;
        }

        Message = /*#__PURE__*/_jsx(FormattedJSXMessage, {
          message: messageKey,
          options: options,
          elements: {
            UILink: UILink
          }
        });
      } else {
        Message = /*#__PURE__*/_jsx(FormattedMessage, {
          message: messageKey
        });
      }

      var hasNumericErrorCode = !!Number(code);
      return /*#__PURE__*/_jsxs("div", {
        children: [Message, isPaidHub && hasNumericErrorCode && /*#__PURE__*/_jsx("small", {
          className: "is--text--help display-block",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "twilioClientErrors.errorCode",
            options: {
              code: "CALL" + code + "ERR"
            }
          })
        })]
      });
    }
  }, {
    key: "getTitle",
    value: function getTitle(_ref2) {
      var titleKey = _ref2.titleKey;
      return /*#__PURE__*/_jsx(FormattedMessage, {
        message: titleKey
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          deviceError = _this$props2.deviceError,
          isPaidHub = _this$props2.isPaidHub,
          isUsingTwilioConnect = _this$props2.isUsingTwilioConnect;

      if (!deviceError) {
        return null;
      }

      var code = getCode(deviceError) || 'unknown';
      var errorMessage = getMessage(deviceError);
      var translationInfo = getErrorCodeTranslationInfo(code, isPaidHub, isUsingTwilioConnect, errorMessage);
      var message = this.getMessage(code, translationInfo);
      var titleMessage = this.getTitle(translationInfo);
      return /*#__PURE__*/_jsx(CallBanner, {
        bannerType: "Device Error",
        message: message,
        title: titleMessage,
        isError: true
      });
    }
  }]);

  return DeviceErrorBanner;
}(PureComponent);

DeviceErrorBanner.propTypes = {
  clientStatus: ClientStatusPropType.isRequired,
  deviceError: RecordPropType('DeviceError'),
  isUsingTwilioConnect: PropTypes.bool.isRequired,
  isPaidHub: PropTypes.bool.isRequired,
  saveUserSetting: PropTypes.func.isRequired,
  showSuspendedWarningMessage: PropTypes.bool
};
DeviceErrorBanner.contextType = CallExtensionsContext;
export default DeviceErrorBanner;