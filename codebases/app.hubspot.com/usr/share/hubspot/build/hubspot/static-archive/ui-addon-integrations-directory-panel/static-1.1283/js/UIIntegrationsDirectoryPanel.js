'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import styled from 'styled-components';
import { getHostUrl, sendMessageToChild } from './embedUtils';
import PostMessageTypes from './PostMessageTypes';
import { PanelSourceApps } from './SourceAppIds';
var StyledSidepanel = styled.div.withConfig({
  displayName: "UIIntegrationsDirectoryPanel__StyledSidepanel",
  componentId: "f7j2kd-0"
})(["iframe{display:", ";border:0;position:fixed;width:100%;height:100%;z-index:9999;right:0;top:0;}"], function (_ref) {
  var isOpen = _ref.isOpen;
  return isOpen ? 'initial' : 'none';
});

var UIIntegrationsDirectoryPanel = /*#__PURE__*/function (_Component) {
  _inherits(UIIntegrationsDirectoryPanel, _Component);

  function UIIntegrationsDirectoryPanel(props) {
    var _this;

    _classCallCheck(this, UIIntegrationsDirectoryPanel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIIntegrationsDirectoryPanel).call(this, props));
    _this.state = {
      closePanelComplete: true
    };
    _this.handleMessage = _this.handleMessage.bind(_assertThisInitialized(_this));
    _this.sidepanelURL = _this.getSidepanelURL();

    _this.setSidepanelRef = function (element) {
      _this.sidepanelRef = element;
    };

    return _this;
  }

  _createClass(UIIntegrationsDirectoryPanel, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      window.addEventListener('message', this.handleMessage);
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.isOpen !== this.props.isOpen) {
        sendMessageToChild(this.sidepanelRef, {
          type: PostMessageTypes.SET_IS_OPEN,
          value: nextProps.isOpen
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('message', this.handleMessage);
    }
  }, {
    key: "handleMessage",
    value: function handleMessage(message) {
      var _this$props = this.props,
          onPanelClose = _this$props.onPanelClose,
          onConnectionComplete = _this$props.onConnectionComplete,
          onAuthSucceeded = _this$props.onAuthSucceeded;
      var _message$data = message.data,
          data = _message$data === void 0 ? {} : _message$data;

      switch (data.type) {
        case PostMessageTypes.CLOSE_PANEL:
          {
            this.setState({
              closePanelComplete: false
            });
            onPanelClose();
            break;
          }

        case PostMessageTypes.CLOSE_PANEL_COMPLETE:
          {
            this.setState({
              closePanelComplete: true
            });
            break;
          }

        case PostMessageTypes.PANEL_LOADED:
          {
            sendMessageToChild(this.sidepanelRef, {
              type: PostMessageTypes.SET_IS_OPEN,
              value: this.props.isOpen
            });
            break;
          }

        case PostMessageTypes.CONNECTION_COMPLETE:
          {
            if (onConnectionComplete) {
              onConnectionComplete(data.data);
            }

            break;
          }

        case PostMessageTypes.AUTH_SUCCEEDED:
          {
            if (onAuthSucceeded) {
              onAuthSucceeded(data.data);
            }

            break;
          }

        default:
          return;
      }
    }
  }, {
    key: "getBaseURL",
    value: function getBaseURL() {
      var portalId = this.props.portalId;
      var hostURL = getHostUrl();
      return "//" + hostURL + "/integrations-beta/" + portalId + "/marketplace/embed";
    }
  }, {
    key: "getSidepanelURL",
    value: function getSidepanelURL() {
      var sourceAppId = this.props.sourceAppId;
      var baseURL = this.getBaseURL();
      var query = "?sourceAppId=" + sourceAppId;
      return "" + baseURL + query;
    }
  }, {
    key: "render",
    value: function render() {
      var isOpen = this.props.isOpen;
      var closePanelComplete = this.state.closePanelComplete;
      return /*#__PURE__*/_jsx(StyledSidepanel, {
        isOpen: isOpen || !isOpen && !closePanelComplete,
        children: /*#__PURE__*/_jsx("iframe", {
          ref: this.setSidepanelRef,
          id: "ui-addon-integrations-directory-panel-iframe",
          src: this.sidepanelURL
        })
      });
    }
  }]);

  return UIIntegrationsDirectoryPanel;
}(Component);

UIIntegrationsDirectoryPanel.propTypes = {
  portalId: PropTypes.number.isRequired,
  sourceAppId: PropTypes.oneOf(PanelSourceApps).isRequired,
  onPanelClose: PropTypes.func,
  onConnectionComplete: PropTypes.func,
  onAuthSucceeded: PropTypes.func,
  isOpen: PropTypes.bool
};
UIIntegrationsDirectoryPanel.defaultProps = {
  isOpen: false
};
export default UIIntegrationsDirectoryPanel;