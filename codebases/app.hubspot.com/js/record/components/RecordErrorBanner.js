'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import CallBanner from 'calling-settings-ui-library/banners/components/CallBanner';
import ClientStatusPropType from 'calling-internal-common/widget-status/prop-types/ClientStatusPropType';
import { MARIGOLD_LIGHT } from 'HubStyleTokens/colors';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { isClientAnswered } from 'calling-internal-common/widget-status/operators/getClientState';

var RecordErrorBanner = /*#__PURE__*/function (_Component) {
  _inherits(RecordErrorBanner, _Component);

  function RecordErrorBanner() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, RecordErrorBanner);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RecordErrorBanner)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      isHidden: false
    };
    _this.bannerElementRef = /*#__PURE__*/createRef();

    _this.handleClose = function () {
      _this.setState({
        isHidden: true
      });
    };

    return _this;
  }

  _createClass(RecordErrorBanner, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          recordError = _this$props.recordError,
          clientStatus = _this$props.clientStatus,
          isRecording = _this$props.isRecording;
      var shouldRenderError = recordError && isClientAnswered(clientStatus) && !this.state.isHidden;

      if (!shouldRenderError) {
        return null;
      }

      var langKey = isRecording ? 'toggleOff' : 'toggleOn';

      var message = /*#__PURE__*/_jsx(FormattedMessage, {
        message: "calling-communicator-ui.activeCallBar.recordingError." + langKey + ".message"
      });

      var title = /*#__PURE__*/_jsx(FormattedMessage, {
        message: "calling-communicator-ui.activeCallBar.recordingError." + langKey + ".title"
      });

      return /*#__PURE__*/_jsx(CallBanner, {
        bannerType: "Recording Error",
        message: message,
        title: title,
        backgroundColor: MARIGOLD_LIGHT,
        onCloseClick: this.handleClose,
        ref: this.bannerElementRef
      });
    }
  }]);

  return RecordErrorBanner;
}(Component);

RecordErrorBanner.propTypes = {
  isRecording: PropTypes.bool.isRequired,
  recordError: PropTypes.object,
  clientStatus: ClientStatusPropType.isRequired
};
export default RecordErrorBanner;