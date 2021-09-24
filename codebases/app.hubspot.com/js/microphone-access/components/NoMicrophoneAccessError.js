'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import { PureComponent } from 'react';
import UIAlert from 'UIComponents/alert/UIAlert';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { CALL_FROM_PHONE, CALL_FROM_BROWSER } from 'calling-lifecycle-internal/constants/CallMethods';

var NoMicrophoneAccessError = /*#__PURE__*/function (_PureComponent) {
  _inherits(NoMicrophoneAccessError, _PureComponent);

  function NoMicrophoneAccessError() {
    _classCallCheck(this, NoMicrophoneAccessError);

    return _possibleConstructorReturn(this, _getPrototypeOf(NoMicrophoneAccessError).apply(this, arguments));
  }

  _createClass(NoMicrophoneAccessError, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handleLogBannerView();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.isMicrophoneAccessDenied !== false && this.props.isMicrophoneAccessDenied === false) {
        this.handleLogBannerView();
      }
    }
  }, {
    key: "handleLogBannerView",
    value: function handleLogBannerView() {
      var selectedCallMethod = this.props.selectedCallMethod;
      var isCallMyPhone = selectedCallMethod === CALL_FROM_PHONE;

      if (isCallMyPhone) {
        return;
      } // TODO: Add logging
      // if (this.props.hasMicrophoneAccess === false) {
      // CommunicatorLogger.log('communicator_bannerView', {
      //   activity: 'call',
      //   channel: 'outbound call',
      //   source: 'profile',
      //   bannerType: 'Pre call - no microphone access',
      // });
      // }

    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          selectedCallMethod = _this$props.selectedCallMethod,
          isMicrophoneAccessDenied = _this$props.isMicrophoneAccessDenied;
      var isCallFromBrowser = selectedCallMethod === CALL_FROM_BROWSER;

      if (isCallFromBrowser && isMicrophoneAccessDenied) {
        return /*#__PURE__*/_jsx(UIAlert, {
          titleText: I18n.text('microphoneAccess.noMicTitle'),
          type: "danger",
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "microphoneAccess.noMicMessage"
          })
        });
      }

      return null;
    }
  }]);

  return NoMicrophoneAccessError;
}(PureComponent);

NoMicrophoneAccessError.propTypes = {
  isMicrophoneAccessDenied: PropTypes.bool.isRequired,
  selectedCallMethod: PropTypes.oneOf([CALL_FROM_PHONE, CALL_FROM_BROWSER])
};
export default NoMicrophoneAccessError;