'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component, createRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import emptyFunction from 'react-utils/emptyFunction';
import UUID from '../utils/UUID';
import RefType from '../utils/RefType';
import { getOrigin, getIFrameSrc } from '../utils/IFrameSrc';
import { createAppData, createEmbeddedPropsChangeMessage, createHostContext, createSyncMessage, isReadyMessage, isToIFrameHost, validMessage } from 'ui-addon-iframeable/messaging/IFrameControlMessage';
import { logHostError, logHostMessageReceived, logHostMessageSent } from 'ui-addon-iframeable/utils/Logger';
import { isMessageToMe } from 'ui-addon-iframeable/messaging/IFrameMessage';
import { ERROR_EMBED_NOT_READY, ERROR_UNABLE_TO_SYNC } from 'ui-addon-iframeable/messaging/Errors';

var UIIFrame = /*#__PURE__*/function (_Component) {
  _inherits(UIIFrame, _Component);

  function UIIFrame(props) {
    var _this;

    _classCallCheck(this, UIIFrame);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIIFrame).call(this, props));
    _this.handleReadyTimeout = _this.handleReadyTimeout.bind(_assertThisInitialized(_this));
    _this.handleReceiveMessage = _this.handleReceiveMessage.bind(_assertThisInitialized(_this));
    _this.handleSyncAckMessage = _this.handleSyncAckMessage.bind(_assertThisInitialized(_this));
    _this.retrySendSync = _this.retrySendSync.bind(_assertThisInitialized(_this));
    _this.sendMessage = _this.sendMessage.bind(_assertThisInitialized(_this));
    _this.callbacks = {};
    _this.syncRetryInterval = 100;
    _this.maxNumSyncRetries = props.initTimeout / _this.syncRetryInterval;
    _this.numSyncRetries = 0;
    var iFrameSrc = getIFrameSrc(props.name, props.src);
    _this.iFrame = {
      origin: getOrigin(iFrameSrc),
      src: iFrameSrc,
      ref: props.innerRef || /*#__PURE__*/createRef(),
      synced: false,
      ready: false,
      uuid: UUID()
    };
    return _this;
  }

  _createClass(UIIFrame, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      window.addEventListener('message', this.handleReceiveMessage, false);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.sendSync();
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      if (this.props.embeddedPassthruProps !== nextProps.embeddedPassthruProps) {
        this.handleEmbeddedPassthruPropsChange(nextProps.embeddedPassthruProps);
      }

      return this.props.className !== nextProps.className || this.props.height !== nextProps.height || this.props.iframePassthruProps !== nextProps.iframePassthruProps || this.props.scrolling !== nextProps.scrolling || this.props.src !== nextProps.src || this.props.width !== nextProps.width;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('message', this.handleReceiveMessage);
    }
  }, {
    key: "hasCallback",
    value: function hasCallback(message) {
      return !!this.callbacks[message.id];
    }
  }, {
    key: "isFromEmbed",
    value: function isFromEmbed(message) {
      return message.from === this.iFrame.uuid;
    }
  }, {
    key: "isToEmbed",
    value: function isToEmbed(message) {
      return isMessageToMe(message, this.iFrame.uuid, this.props.group);
    }
  }, {
    key: "dispatchCallback",
    value: function dispatchCallback(message) {
      this.callbacks[message.id](message.payload);
      delete this.callbacks[message.id];
    }
  }, {
    key: "sendMessage",
    value: function sendMessage(message, callback) {
      if (!this.iFrame.ref.current || !this.iFrame.ref.current.contentWindow) {
        return;
      }

      if (callback) {
        this.callbacks[message.id] = callback;
      }

      this.iFrame.ref.current.contentWindow.postMessage(message, this.iFrame.origin);
      logHostMessageSent(this.props.name, message);
    }
  }, {
    key: "handleEmbeddedPassthruPropsChange",
    value: function handleEmbeddedPassthruPropsChange(embeddedProps) {
      var embeddedPropsChangeMessage = createEmbeddedPropsChangeMessage(this.iFrame.uuid, embeddedProps);
      this.sendMessage(embeddedPropsChangeMessage);
    }
  }, {
    key: "handleReceiveMessage",
    value: function handleReceiveMessage(event) {
      if (!validMessage(event, this.iFrame.origin)) {
        return;
      }

      var message = event.data;
      logHostMessageReceived(this.props.name, message);

      if (this.hasCallback(message)) {
        this.dispatchCallback(message);
      } else if (this.isFromEmbed(message)) {
        if (isReadyMessage(message)) {
          this.handleIFrameReady(message);
        } else if (isToIFrameHost(message)) {
          this.props.onMessage(message);
        }
      } else if (this.isToEmbed(message)) {
        this.sendMessage(message);
      }
    }
  }, {
    key: "handleIFrameReady",
    value: function handleIFrameReady(message) {
      this.iFrame.ready = true;
      this.props.onReady(createHostContext(this.iFrame.uuid, this.sendMessage), message.payload);
    }
  }, {
    key: "handleInitTimeout",
    value: function handleInitTimeout() {
      var _this$props = this.props,
          name = _this$props.name,
          onInitError = _this$props.onInitError;
      logHostError(name, ERROR_UNABLE_TO_SYNC);
      onInitError(ERROR_UNABLE_TO_SYNC);
    }
  }, {
    key: "handleReadyTimeout",
    value: function handleReadyTimeout() {
      if (this.iFrame.ready || !this.iFrame.ref.current) {
        return;
      }

      var _this$props2 = this.props,
          name = _this$props2.name,
          onReadyError = _this$props2.onReadyError;
      logHostError(name, ERROR_EMBED_NOT_READY);
      onReadyError(ERROR_EMBED_NOT_READY);
    }
  }, {
    key: "handleSyncAckMessage",
    value: function handleSyncAckMessage() {
      this.iFrame.synced = true;
      setTimeout(this.handleReadyTimeout, this.props.readyTimeout);
    }
  }, {
    key: "retrySendSync",
    value: function retrySendSync() {
      if (this.numSyncRetries === this.maxNumSyncRetries) {
        this.handleInitTimeout();
        return;
      }

      if (!this.iFrame.synced && this.iFrame.ref.current) {
        this.sendSync();
      }
    }
  }, {
    key: "sendSync",
    value: function sendSync() {
      var _this$props3 = this.props,
          appInfo = _this$props3.appInfo,
          appName = _this$props3.appName,
          embeddedPassthruProps = _this$props3.embeddedPassthruProps,
          group = _this$props3.group,
          name = _this$props3.name;
      var appData = createAppData(appInfo, appName);
      var syncMessage = createSyncMessage({
        embedId: this.iFrame.uuid,
        group: group,
        name: name,
        appData: appData,
        embeddedProps: embeddedPassthruProps
      });
      this.sendMessage(syncMessage, this.handleSyncAckMessage);
      this.numSyncRetries++;
      setTimeout(this.retrySendSync, this.syncRetryInterval);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          className = _this$props4.className,
          height = _this$props4.height,
          iframePassthruProps = _this$props4.iframePassthruProps,
          scrolling = _this$props4.scrolling,
          width = _this$props4.width;
      return /*#__PURE__*/_jsx("iframe", Object.assign({
        frameBorder: 0
      }, iframePassthruProps, {
        className: className,
        height: String(height),
        ref: this.iFrame.ref,
        scrolling: scrolling ? 'yes' : 'no',
        src: this.iFrame.src,
        width: String(width)
      }));
    }
  }]);

  return UIIFrame;
}(Component);

UIIFrame.propTypes = {
  appInfo: PropTypes.object.isRequired,
  appName: PropTypes.string.isRequired,
  className: PropTypes.string,
  embeddedPassthruProps: PropTypes.object,
  group: PropTypes.string.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  iframePassthruProps: PropTypes.object,
  initTimeout: PropTypes.number.isRequired,
  innerRef: RefType,
  name: PropTypes.string.isRequired,
  onInitError: PropTypes.func.isRequired,
  onMessage: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired,
  onReadyError: PropTypes.func.isRequired,
  readyTimeout: PropTypes.number.isRequired,
  scrolling: PropTypes.bool.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};
UIIFrame.defaultProps = {
  appInfo: {},
  appName: '',
  className: 'flex-grow-1',
  embeddedPassthruProps: {},
  group: 'iframeable',
  height: 200,
  iframePassthruProps: {},
  initTimeout: 8000,
  name: 'embed',
  onInitError: emptyFunction,
  onMessage: emptyFunction,
  onReadyError: emptyFunction,
  readyTimeout: 3000,
  scrolling: true,
  width: 200
};
export default UIIFrame;
export var UIIFrameWithRef = /*#__PURE__*/forwardRef(function (props, ref) {
  return /*#__PURE__*/_jsx(UIIFrame, Object.assign({}, props, {
    innerRef: ref
  }));
});