'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import UIIconCircle from 'UIComponents/icon/UIIconCircle';
import UIButton from 'UIComponents/button/UIButton';
import { OLAF, OBSIDIAN, BATTLESHIP } from 'HubStyleTokens/colors';
import Keypad from './Keypad';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { CALL_FROM_PHONE, CALL_FROM_BROWSER } from 'calling-lifecycle-internal/constants/CallMethods';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';

var KeypadDropdown = /*#__PURE__*/function (_Component) {
  _inherits(KeypadDropdown, _Component);

  function KeypadDropdown() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, KeypadDropdown);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(KeypadDropdown)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      showKeypad: false
    };

    _this.toggleKeypad = function () {
      var showKeypad = !_this.state.showKeypad;
      var action = showKeypad ? 'show keypad' : 'hide keypad';
      CommunicatorLogger.log('communicatorInteraction', {
        action: action,
        activity: 'call',
        channel: 'outbound call',
        source: _this.props.appIdentifier
      });
      return _this.setState({
        showKeypad: showKeypad
      });
    };

    return _this;
  }

  _createClass(KeypadDropdown, [{
    key: "renderKeypadButton",
    value: function renderKeypadButton() {
      return /*#__PURE__*/_jsxs("div", {
        className: "flex-column align-center",
        children: [/*#__PURE__*/_jsx(UIButton, {
          onClick: this.toggleKeypad,
          use: "unstyled",
          "data-selenium-test": "calling-widget-keypad-button",
          children: /*#__PURE__*/_jsx(UIIconCircle, {
            name: "grid",
            color: OBSIDIAN,
            backgroundColor: OLAF,
            borderColor: BATTLESHIP,
            padding: 0.3,
            size: 16
          })
        }), /*#__PURE__*/_jsx("small", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "calling-communicator-ui.activeCallBar.keypadLabel"
          })
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.selectedCallMethod === CALL_FROM_PHONE) {
        return null;
      }

      return /*#__PURE__*/_jsxs(_Fragment, {
        children: [this.renderKeypadButton(), this.state.showKeypad && /*#__PURE__*/_jsx(Keypad, {
          onReject: this.toggleKeypad
        })]
      });
    }
  }]);

  return KeypadDropdown;
}(Component);

KeypadDropdown.propTypes = {
  selectedCallMethod: PropTypes.oneOf([CALL_FROM_PHONE, CALL_FROM_BROWSER]).isRequired,
  appIdentifier: PropTypes.string.isRequired
};
export { KeypadDropdown as default };