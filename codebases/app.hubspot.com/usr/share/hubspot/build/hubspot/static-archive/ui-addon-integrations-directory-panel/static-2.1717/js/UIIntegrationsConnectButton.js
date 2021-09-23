'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component, Fragment } from 'react';
import { getHostUrl } from './embedUtils';
import PostMessageTypes from './PostMessageTypes';
import UIIFrame from 'ui-addon-iframeable/host/UIIFrame';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import UIImage from 'UIComponents/image/UIImage';
import { SingleConnectSourceApps } from './SourceAppIds';

var UIIntegrationsConnectButton = /*#__PURE__*/function (_Component) {
  _inherits(UIIntegrationsConnectButton, _Component);

  function UIIntegrationsConnectButton(props) {
    var _this;

    _classCallCheck(this, UIIntegrationsConnectButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIIntegrationsConnectButton).call(this, props));
    _this.handleError = _this.handleError.bind(_assertThisInitialized(_this));
    _this.handleOnMessage = _this.handleOnMessage.bind(_assertThisInitialized(_this));
    _this.handleOnReady = _this.handleOnReady.bind(_assertThisInitialized(_this));
    _this.connectURL = _this.getConnectURL();
    _this.state = {
      isReady: false,
      height: 0,
      width: 0
    };
    return _this;
  }

  _createClass(UIIntegrationsConnectButton, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.appId !== this.props.appId) {
        this.connectURL = this.getConnectURL(nextProps);
        this.forceUpdate();
      }
    }
  }, {
    key: "handleError",
    value: function handleError() {}
  }, {
    key: "handleOnReady",
    value: function handleOnReady() {
      var onReady = this.props.onReady;
      this.setState({
        isReady: true
      });

      if (onReady) {
        onReady();
      }
    }
  }, {
    key: "handleOnMessage",
    value: function handleOnMessage(message) {
      var _this$props = this.props,
          onConnectionComplete = _this$props.onConnectionComplete,
          onIntegrationNotFound = _this$props.onIntegrationNotFound,
          onConnectionFailed = _this$props.onConnectionFailed,
          onClick = _this$props.onClick;
      var _message$payload = message.payload,
          payload = _message$payload === void 0 ? {} : _message$payload;

      switch (payload.type) {
        case PostMessageTypes.SIZE_UPDATED:
          this.setState({
            height: payload.height,
            width: payload.width
          });
          return;

        case PostMessageTypes.CONNECTION_COMPLETE:
          if (onConnectionComplete) {
            onConnectionComplete(payload);
          }

          return;

        case PostMessageTypes.BUTTON_CLICK:
          if (onClick) {
            onClick(payload);
          }

          return;

        case PostMessageTypes.CONNECTION_FAILED:
          onConnectionFailed(payload);
          return;

        case PostMessageTypes.INTEGRATION_NOT_FOUND:
          onIntegrationNotFound(payload);
          return;

        default:
          return;
      }
    }
  }, {
    key: "getBaseURL",
    value: function getBaseURL() {
      var portalId = this.props.portalId;
      var hostURL = getHostUrl();
      return hostURL + "/integrations-beta/" + portalId + "/marketplace/embed/connect-button";
    }
  }, {
    key: "getConnectURL",
    value: function getConnectURL() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var sourceAppId = props.sourceAppId,
          appId = props.appId,
          appName = props.appName;
      var baseURL = this.getBaseURL();
      var query = "?sourceAppId=" + sourceAppId + "&appId=" + appId + "&appName=" + appName;
      return "" + baseURL + query;
    }
  }, {
    key: "renderImage",
    value: function renderImage() {
      var _this$props$image = this.props.image,
          imageSource = _this$props$image.imageSource,
          imageHeight = _this$props$image.imageHeight;
      return /*#__PURE__*/_jsx(UIImage, {
        alt: "",
        src: imageSource,
        style: {
          height: imageHeight,
          margin: '0 auto'
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          use = _this$props2.use,
          size = _this$props2.size,
          text = _this$props2.text,
          image = _this$props2.image,
          style = _this$props2.style;
      return /*#__PURE__*/_jsxs(Fragment, {
        children: [!this.state.isReady && /*#__PURE__*/_jsx(UILoadingButton, {
          use: use,
          size: size,
          loading: !image,
          style: style,
          children: image ? this.renderImage() : text
        }), /*#__PURE__*/_jsx(UIIFrame, {
          id: "ui-addon-integrations-connect-button-embed",
          onInitError: this.handleError,
          onMessage: this.handleOnMessage,
          onReady: this.handleOnReady,
          onReadyError: this.handleError,
          height: this.state.height,
          width: this.state.width,
          scrolling: true,
          embeddedPassthruProps: Object.assign({
            use: use,
            size: size,
            style: style,
            text: text,
            disabled: this.props.disabled,
            imageSource: image && image.imageSource,
            imageHeight: image && image.imageHeight,
            isReconnecting: this.props.isReconnecting
          }, this.props.meta),
          src: this.connectURL
        })]
      });
    }
  }]);

  return UIIntegrationsConnectButton;
}(Component);

UIIntegrationsConnectButton.propTypes = {
  portalId: PropTypes.number.isRequired,
  appId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  // eslint-disable-next-line
  sourceAppId: PropTypes.oneOf(SingleConnectSourceApps).isRequired,
  onReady: PropTypes.func,
  onClick: PropTypes.func,
  onConnectionComplete: PropTypes.func,
  onConnectionFailed: PropTypes.func,
  onIntegrationNotFound: PropTypes.func,
  use: PropTypes.string,
  size: PropTypes.string,
  style: PropTypes.object,
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  image: PropTypes.shape({
    imageHeight: PropTypes.string,
    imageSource: PropTypes.string
  }),
  isReconnecting: PropTypes.bool,
  meta: PropTypes.object
};
UIIntegrationsConnectButton.defaultProps = {
  onReady: function onReady() {
    return {};
  },
  onConnectionComplete: function onConnectionComplete() {
    return {};
  },
  onConnectionFailed: function onConnectionFailed() {
    return {};
  },
  onIntegrationNotFound: function onIntegrationNotFound() {
    return {};
  }
};
export default UIIntegrationsConnectButton;