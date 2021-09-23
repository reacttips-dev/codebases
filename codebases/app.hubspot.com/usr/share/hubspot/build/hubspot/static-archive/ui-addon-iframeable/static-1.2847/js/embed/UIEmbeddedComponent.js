'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import { createEmbeddedContext as _createEmbeddedContext, createReadyMessage, createSyncAckMessage, isEmbeddedPropsChangedMessage, isSyncMessage, validMessage as _validMessage } from 'ui-addon-iframeable/messaging/IFrameControlMessage';
import { getEmbeddedPropsFromQueryParams, getTopLevelEmbeddedContextDefaults, isTopLevelWindowSupported } from 'ui-addon-iframeable/utils/Embedded';
import { logEmbedError, logEmbedMessageReceived, logEmbedMessageSent } from 'ui-addon-iframeable/utils/Logger';
import { ERROR_EMBED_CONTEXT_INVALID_RECEIVE_MESSAGE } from 'ui-addon-iframeable/messaging/Errors';
import emptyFunction from 'react-utils/emptyFunction';
import { isMessageToMe, validFormat } from 'ui-addon-iframeable/messaging/IFrameMessage'; // To allow your EmbeddedComponent to render outside of an iframe:
// set `enableTopLevelEmbed` to render in ALL environments including prod (ensure this will not have adverse consequences!)
// set `enableTopLevelEmbedForTestOnly` to render ONLY in the QA environment

export default (function (EmbeddedComponent) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$enableTopLevelEm = _ref.enableTopLevelEmbed,
      enableTopLevelEmbed = _ref$enableTopLevelEm === void 0 ? false : _ref$enableTopLevelEm,
      _ref$enableTopLevelEm2 = _ref.enableTopLevelEmbedForTestOnly,
      enableTopLevelEmbedForTestOnly = _ref$enableTopLevelEm2 === void 0 ? false : _ref$enableTopLevelEm2;

  var UIEmbeddedComponent = /*#__PURE__*/function (_PureComponent) {
    _inherits(UIEmbeddedComponent, _PureComponent);

    function UIEmbeddedComponent() {
      var _this;

      _classCallCheck(this, UIEmbeddedComponent);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(UIEmbeddedComponent).call(this));
      _this.handleOnReady = _this.handleOnReady.bind(_assertThisInitialized(_this));
      _this.handleReceiveMessage = _this.handleReceiveMessage.bind(_assertThisInitialized(_this));
      _this.sendMessage = _this.sendMessage.bind(_assertThisInitialized(_this));
      _this.callbacks = {};
      _this.parent = {
        origin: null
      };
      _this.child = {
        embeddedContext: null,
        receiveMessage: emptyFunction
      };
      _this.state = {
        embeddedProps: {},
        synced: false
      };
      return _this;
    }

    _createClass(UIEmbeddedComponent, [{
      key: "UNSAFE_componentWillMount",
      value: function UNSAFE_componentWillMount() {
        window.addEventListener('message', this.handleReceiveMessage, false);
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        if (isTopLevelWindowSupported({
          enableTopLevelEmbed: enableTopLevelEmbed,
          enableTopLevelEmbedForTestOnly: enableTopLevelEmbedForTestOnly
        })) {
          this.initWhenTopLevel();
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        window.removeEventListener('message', this.handleReceiveMessage);
      }
    }, {
      key: "createEmbeddedContext",
      value: function createEmbeddedContext(_ref2) {
        var embedId = _ref2.embedId,
            group = _ref2.group,
            name = _ref2.name,
            appData = _ref2.appData;
        var sendMessageFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.sendMessage;
        return _createEmbeddedContext({
          embedId: embedId,
          group: group,
          name: name,
          app: appData,
          sendMessageFn: sendMessageFn
        });
      }
    }, {
      key: "initEmbeddedContext",
      value: function initEmbeddedContext(message) {
        this.child.embeddedContext = this.createEmbeddedContext(message.payload);
      }
    }, {
      key: "initWhenTopLevel",
      value: function initWhenTopLevel() {
        this.child.embeddedContext = this.createEmbeddedContext(getTopLevelEmbeddedContextDefaults(), emptyFunction);
        this.setState({
          synced: true,
          embeddedProps: getEmbeddedPropsFromQueryParams()
        });
      }
    }, {
      key: "validMessage",
      value: function validMessage(event) {
        if (!this.parent.origin) {
          if (validFormat(event.data)) {
            this.parent.origin = event.origin;
          }
        }

        return _validMessage(event, this.parent.origin);
      }
    }, {
      key: "isToEmbeddedComponent",
      value: function isToEmbeddedComponent(message) {
        return isMessageToMe(message, this.child.embeddedContext.id, this.child.embeddedContext.group);
      }
    }, {
      key: "hasCallback",
      value: function hasCallback(message) {
        return !!this.callbacks[message.id];
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
        if (callback) {
          this.callbacks[message.id] = callback;
        } // When enableTopLevel is true and the iframe is navigated to directly, the page crashes in IE11.
        // This is because in this case, this.parent.origin is null. When postMessage receives a null argument for the origin url
        // it attempts to use the base URL parser. In absence of the * operator, base URl parser fails to parse the null target origin and throws a DOM Exception sytnax error
        // Likely because URL is not yet fully supportd in IE11: https://developer.mozilla.org/en-US/docs/Web/API/URL


        var url = this.parent.origin || '*';
        window.parent.postMessage(message, url);
        logEmbedMessageSent(this.child.embeddedContext.name, message);
      }
    }, {
      key: "logMessageReceived",
      value: function logMessageReceived(message) {
        if (!this.child.embeddedContext) {
          return;
        }

        logEmbedMessageReceived(this.child.embeddedContext.name, message);
      }
    }, {
      key: "handleOnReady",
      value: function handleOnReady(childContext) {
        if (typeof childContext.receiveMessage !== 'function') {
          logEmbedError(this.child.embeddedContext.name, ERROR_EMBED_CONTEXT_INVALID_RECEIVE_MESSAGE, childContext);
          return;
        }

        this.child.receiveMessage = childContext.receiveMessage;
        var readyMessage = createReadyMessage(this.child.embeddedContext.id, childContext.data);
        this.sendMessage(readyMessage);
      }
    }, {
      key: "handleSyncMessage",
      value: function handleSyncMessage(message) {
        if (this.state.synced) {
          return;
        }

        this.sendMessage(createSyncAckMessage(message));
        this.setState({
          synced: true,
          embeddedProps: message.payload.embeddedProps
        });
      }
    }, {
      key: "handleEmbeddedPropsChangedMessage",
      value: function handleEmbeddedPropsChangedMessage(message) {
        var _message$payload = message.payload,
            __type = _message$payload.type,
            embeddedProps = _objectWithoutProperties(_message$payload, ["type"]);

        this.setState({
          embeddedProps: embeddedProps
        });
      }
    }, {
      key: "handleReceiveMessage",
      value: function handleReceiveMessage(event) {
        if (!this.validMessage(event)) {
          return;
        }

        var message = event.data;

        if (isSyncMessage(message) && !this.state.synced) {
          this.initEmbeddedContext(message);
        }

        this.logMessageReceived(message);

        if (isSyncMessage(message)) {
          this.handleSyncMessage(message);
        } else if (isEmbeddedPropsChangedMessage(message)) {
          this.handleEmbeddedPropsChangedMessage(message);
        } else if (this.hasCallback(message)) {
          this.dispatchCallback(message);
        } else if (this.isToEmbeddedComponent(message)) {
          this.child.receiveMessage(message);
        }
      }
    }, {
      key: "render",
      value: function render() {
        if (!this.state.synced) {
          return null;
        }

        return /*#__PURE__*/_jsx(EmbeddedComponent, Object.assign({}, this.props, {}, this.state.embeddedProps, {
          onReady: this.handleOnReady,
          embeddedContext: this.child.embeddedContext
        }));
      }
    }]);

    return UIEmbeddedComponent;
  }(PureComponent);

  UIEmbeddedComponent.EmbeddedComponent = EmbeddedComponent;
  return UIEmbeddedComponent;
});