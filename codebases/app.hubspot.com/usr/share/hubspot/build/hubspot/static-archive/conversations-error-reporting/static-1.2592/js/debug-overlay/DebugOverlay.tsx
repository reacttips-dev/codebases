import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import Raven from 'Raven';
import styled from 'styled-components';
import { Component } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { isEnabled, toggleVerboseLogging as _toggleVerboseLogging } from './operators/verboseLogging';
var LETTER_D = 68;
var Backdrop = styled.div.withConfig({
  displayName: "DebugOverlay__Backdrop",
  componentId: "sc-1b7fd13-0"
})(["position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,0.75);z-index:1000;"]);
var Overlay = styled.div.withConfig({
  displayName: "DebugOverlay__Overlay",
  componentId: "sc-1b7fd13-1"
})(["display:flex;align-items:center;justify-content:center;height:100%;"]);
var OverlayContent = styled.div.withConfig({
  displayName: "DebugOverlay__OverlayContent",
  componentId: "sc-1b7fd13-2"
})(["background-color:white;position:relative;padding:20px;border:solid 1px;box-shadow:grey 0px 0px 10px;width:360px;"]);
var DebugButton = styled.button.withConfig({
  displayName: "DebugOverlay__DebugButton",
  componentId: "sc-1b7fd13-3"
})(["margin-right:4px;"]);
var CloseButton = styled.button.withConfig({
  displayName: "DebugOverlay__CloseButton",
  componentId: "sc-1b7fd13-4"
})(["position:absolute;border:white;top:0;right:0;"]);

var DebugOverlay = /*#__PURE__*/function (_Component) {
  _inherits(DebugOverlay, _Component);

  function DebugOverlay(props) {
    var _this;

    _classCallCheck(this, DebugOverlay);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DebugOverlay).call(this, props));
    _this.state = {
      showDebug: false,
      lastEventId: null,
      verboseLoggingEnabled: isEnabled()
    };
    _this.toggleVerboseLogging = _this.toggleVerboseLogging.bind(_assertThisInitialized(_this));
    _this.sendDebugData = _this.sendDebugData.bind(_assertThisInitialized(_this));
    _this.closeDebug = _this.closeDebug.bind(_assertThisInitialized(_this));
    _this.handleKeyUp = _this.handleKeyUp.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(DebugOverlay, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      document.addEventListener('keyup', this.handleKeyUp);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('keyup', this.handleKeyUp);
    }
  }, {
    key: "handleKeyUp",
    value: function handleKeyUp(event) {
      var altKey = event.altKey,
          ctrlKey = event.ctrlKey,
          shiftKey = event.shiftKey,
          keyCode = event.keyCode;

      if (altKey && ctrlKey && shiftKey && keyCode === LETTER_D) {
        this.setState({
          showDebug: true
        });

        if (this.props.onEnterDebug) {
          this.props.onEnterDebug();
        }
      }
    }
  }, {
    key: "closeDebug",
    value: function closeDebug() {
      this.setState({
        showDebug: false
      });
    }
  }, {
    key: "toggleVerboseLogging",
    value: function toggleVerboseLogging() {
      this.setState(function (state) {
        return {
          verboseLoggingEnabled: !state.verboseLoggingEnabled
        };
      });

      _toggleVerboseLogging();
    }
  }, {
    key: "sendDebugData",
    value: function sendDebugData() {
      Raven.captureMessage("Debug Data " + Date.now(), {
        level: 'info'
      });
      this.setState({
        lastEventId: Raven.lastEventId()
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.state.showDebug) {
        return null;
      }

      return /*#__PURE__*/_jsx(Backdrop, {
        children: /*#__PURE__*/_jsx(Overlay, {
          children: /*#__PURE__*/_jsxs(OverlayContent, {
            children: [/*#__PURE__*/_jsx("h3", {
              children: "Debug Menu"
            }), this.props.renderNetworkStatistics ? this.props.renderNetworkStatistics() : null, /*#__PURE__*/_jsx(DebugButton, {
              onClick: this.toggleVerboseLogging,
              children: this.state.verboseLoggingEnabled ? /*#__PURE__*/_jsx(FormattedMessage, {
                message: "conversations-error-reporting.debugOverlay.disableLogs"
              }) : /*#__PURE__*/_jsx(FormattedMessage, {
                message: "conversations-error-reporting.debugOverlay.enableLogs"
              })
            }), /*#__PURE__*/_jsx(DebugButton, {
              onClick: this.sendDebugData,
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "conversations-error-reporting.debugOverlay.sendData"
              })
            }), /*#__PURE__*/_jsx("br", {}), this.state.lastEventId ? /*#__PURE__*/_jsx("span", {
              style: {
                color: 'green'
              },
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "conversations-error-reporting.debugOverlay.lastEventMessage",
                options: {
                  lastEventId: this.state.lastEventId
                }
              })
            }) : null, /*#__PURE__*/_jsx(CloseButton, {
              onClick: this.closeDebug,
              children: "x"
            })]
          })
        })
      });
    }
  }]);

  return DebugOverlay;
}(Component);

DebugOverlay.displayName = 'DebugOverlay';
export default DebugOverlay;