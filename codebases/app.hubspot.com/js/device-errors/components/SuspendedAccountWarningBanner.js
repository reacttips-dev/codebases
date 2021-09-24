'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CallBanner from 'calling-settings-ui-library/banners/components/CallBanner';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { MARIGOLD_LIGHT } from 'HubStyleTokens/colors';

var SuspendedAccountWarningBanner = /*#__PURE__*/function (_PureComponent) {
  _inherits(SuspendedAccountWarningBanner, _PureComponent);

  function SuspendedAccountWarningBanner() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, SuspendedAccountWarningBanner);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(SuspendedAccountWarningBanner)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      onClose: false
    };

    _this.onCloseClick = function () {
      _this.setState({
        onClose: true
      });
    };

    return _this;
  }

  _createClass(SuspendedAccountWarningBanner, [{
    key: "render",
    value: function render() {
      return this.props.showSuspendedWarningMessage && !this.state.onClose ? /*#__PURE__*/_jsx(CallBanner, {
        bannerType: "Device Warning",
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "calling-communicator-ui.suspendedAccountWarningBanner.message"
        }),
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "calling-communicator-ui.suspendedAccountWarningBanner.title"
        }),
        isError: false,
        backgroundColor: MARIGOLD_LIGHT,
        onCloseClick: this.onCloseClick
      }) : null;
    }
  }]);

  return SuspendedAccountWarningBanner;
}(PureComponent);

SuspendedAccountWarningBanner.propTypes = {
  showSuspendedWarningMessage: PropTypes.bool
};
export default SuspendedAccountWarningBanner;