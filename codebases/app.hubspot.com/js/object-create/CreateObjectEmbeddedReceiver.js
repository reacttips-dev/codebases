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
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import EmptyStateMessage from '../crm_ui/emptyState/EmptyStateMessage';
import { createObject, transformPostedParamsToObjectCreatorParams, validObjectCreatorParams } from '../crm_ui/creator/ObjectCreator';
import { ERROR_UNPLUG } from '../crm_ui/constants/ERROR_UNPLUG';
import ObjectCreatorConfig from '../crm_ui/creator/ObjectCreatorConfig';
import UIEmbeddedComponent from 'ui-addon-iframeable/embed/UIEmbeddedComponent';
import { inIframe, TYPE } from 'crm_schema/creator/ObjectEmbedMessage';
import { MSG_TYPE_MODAL_DIALOG_CLOSE } from 'ui-addon-iframeable/messaging/IFrameMessageTypes';
import EmbeddedContextPropType from 'ui-addon-iframeable/embed/EmbeddedContextPropType';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
var CREATE_PANEL_MESSAGE_TYPE = TYPE.create;

var CreateObjectEmbeddedReceiver = /*#__PURE__*/function (_Component) {
  _inherits(CreateObjectEmbeddedReceiver, _Component);

  function CreateObjectEmbeddedReceiver(props) {
    var _this;

    _classCallCheck(this, CreateObjectEmbeddedReceiver);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CreateObjectEmbeddedReceiver).call(this, props));

    _this.handleReceiveMessage = function (_ref) {
      var payload = _ref.payload;

      if (payload.type === MSG_TYPE_MODAL_DIALOG_CLOSE) {
        _this.handleReject();
      }

      if (payload.type !== CREATE_PANEL_MESSAGE_TYPE) {
        return;
      }

      if (!validObjectCreatorParams(payload)) {
        _this.handleInvalidParams(payload);

        return;
      }

      var objectCreatorParams = transformPostedParamsToObjectCreatorParams(payload);
      var sourceApp = payload.sourceApp;

      _this.setState({
        objectCreatorParams: objectCreatorParams,
        sourceApp: sourceApp
      });
    };

    _this.handleInvalidParams = function (params) {
      _this.postMessage({
        error: "Invalid params: " + JSON.stringify(params)
      });
    };

    _this.handleObjectCreated = function (_ref2, object) {
      var addNew = _ref2.addNew,
          isFirstContact = _ref2.isFirstContact,
          isMarketable = _ref2.isMarketable;

      _this.postMessage({
        createAnother: addNew,
        isFirstContact: isFirstContact,
        isMarketable: isMarketable,
        object: object.toJS()
      });
    };

    _this.handleConfirmError = function (error) {
      _this.postMessage({
        error: error,
        // passed through this way because otherwise it gets lost being sent as a message through the iframe
        errorJSON: error ? error.responseJSON : undefined,
        errorStatus: error ? error.status : undefined
      });
    };

    _this.handleObjectCreatedError = function (error) {
      _this.postMessage({
        error: error,
        // passed through this way because otherwise it gets lost being sent as a message through the iframe
        errorJSON: error ? error.responseJSON : undefined,
        errorStatus: error ? error.status : undefined
      });

      _this.postMessage({
        close: true
      });
    };

    _this.handleReject = function () {
      _this.postMessage({
        close: true
      });

      _this.forceContentsRerender();
    };

    _this.handleConfirm = function (options) {
      var _this$state = _this.state,
          objectCreatorParams = _this$state.objectCreatorParams,
          sourceApp = _this$state.sourceApp;
      var objectType = objectCreatorParams.objectType,
          associationObjectId = objectCreatorParams.associationObjectId,
          associationObjectType = objectCreatorParams.associationObjectType;
      createObject(Object.assign({}, options, {
        objectType: objectType,
        associationObjectId: associationObjectId,
        associationObjectType: associationObjectType,
        sourceApp: sourceApp
      })).then(function (object) {
        return _this.handleObjectCreated(options, object);
      }).catch(_this.handleObjectCreatedError);

      _this.forceContentsRerender();
    };

    _this.handleReceiveMessage = _this.handleReceiveMessage.bind(_assertThisInitialized(_this));
    _this.state = {
      key: 0,
      isInIframe: inIframe(),
      objectCreatorParams: null
    };
    return _this;
  }

  _createClass(CreateObjectEmbeddedReceiver, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      if (!this.state.isInIframe) {
        return;
      }

      this.props.onReady({
        receiveMessage: this.handleReceiveMessage
      });
      FloatingAlertStore.subscribe(CREATE_PANEL_MESSAGE_TYPE, function (alerts) {
        _this2.props.embeddedContext.sendMessage(CREATE_PANEL_MESSAGE_TYPE, {
          alerts: alerts.map(function (alert) {
            var message = alert.message,
                type = alert.type;
            return {
              message: message,
              type: type
            };
          })
        });
      });
    }
  }, {
    key: "forceContentsRerender",
    value: function forceContentsRerender() {
      // This is a work around for some of the iframe component not cleaning up after themselves
      // and expecting to be remounted every time.
      this.setState({
        key: this.state.key + 1
      });
    }
  }, {
    key: "postMessage",
    value: function postMessage(data) {
      this.props.embeddedContext.sendMessage(CREATE_PANEL_MESSAGE_TYPE, data);
    }
  }, {
    key: "renderLoading",
    value: function renderLoading() {
      return /*#__PURE__*/_jsx(UILoadingSpinner, {
        grow: true,
        minHeight: 200
      });
    }
  }, {
    key: "renderBadConfig",
    value: function renderBadConfig() {
      return /*#__PURE__*/_jsx(EmptyStateMessage, {
        imageUrl: ERROR_UNPLUG,
        objectType: "page",
        titleText: "GenericGrid.error.unplug",
        subText: "GenericGrid.error.subheader"
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state2 = this.state,
          objectCreatorParams = _this$state2.objectCreatorParams,
          isInIframe = _this$state2.isInIframe;

      if (!isInIframe) {
        return this.renderBadConfig();
      }

      if (!objectCreatorParams) {
        return this.renderLoading();
      }

      var ObjectCreatorComponent = ObjectCreatorConfig[objectCreatorParams.objectType].component;
      return /*#__PURE__*/_jsx(ObjectCreatorComponent, Object.assign({}, objectCreatorParams, {
        embedded: true,
        onConfirm: this.handleConfirm,
        onReject: this.handleReject
      }), this.state.key);
    }
  }]);

  return CreateObjectEmbeddedReceiver;
}(Component);

CreateObjectEmbeddedReceiver.propTypes = {
  embeddedContext: EmbeddedContextPropType,
  onReady: PropTypes.func.isRequired
};
export default UIEmbeddedComponent(CreateObjectEmbeddedReceiver);