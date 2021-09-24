'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import partial from 'transmute/partial';
import { Component } from 'react';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import { toMessage, validEvent } from 'crm_schema/creator/ObjectEmbedMessage';
import ObjectCreatorConfig from './ObjectCreatorConfig';
import EmptyStateMessage from '../emptyState/EmptyStateMessage';
import { createObject, transformPostedParamsToObjectCreatorParams, validObjectCreatorParams } from './ObjectCreator';
import { ERROR_UNPLUG } from '../constants/ERROR_UNPLUG';

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

var ObjectCreatorContainer = /*#__PURE__*/function (_Component) {
  _inherits(ObjectCreatorContainer, _Component);

  function ObjectCreatorContainer() {
    var _this;

    _classCallCheck(this, ObjectCreatorContainer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ObjectCreatorContainer).call(this));

    _this.handleReceiveMessage = function (event) {
      if (!validEvent(event, 'create')) {
        return;
      }

      var container = {
        origin: event.origin,
        source: event.source
      };

      if (!validObjectCreatorParams(event.data)) {
        _this.handleInvalidParams(container, event.data);

        return;
      }

      var objectCreatorParams = transformPostedParamsToObjectCreatorParams(event.data);
      var sourceApp = event.data.sourceApp;

      _this.setState({
        container: container,
        objectCreatorParams: objectCreatorParams,
        sourceApp: sourceApp
      });
    };

    _this.handleInvalidParams = function (container, params) {
      _this.postMessage({
        error: "Invalid params: " + JSON.stringify(params)
      }, container);
    };

    _this.handleObjectCreated = function (createAnother, object) {
      _this.postMessage({
        createAnother: createAnother,
        object: object.toJS()
      });
    };

    _this.handleObjectCreatedError = function (error) {
      _this.postMessage({
        error: error
      });
    };

    _this.handleConfirm = function (options) {
      var handleSuccess = partial(_this.handleObjectCreated, options.addNew);
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
      })).then(handleSuccess).catch(_this.handleObjectCreatedError);
    };

    _this.handleReject = function () {
      _this.postMessage({
        close: true
      });
    };

    _this.state = {
      isInIframe: inIframe(),
      objectCreatorParams: null,
      container: {
        origin: null,
        source: null
      }
    };
    return _this;
  }

  _createClass(ObjectCreatorContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.state.isInIframe) {
        return;
      }

      window.addEventListener('message', this.handleReceiveMessage, false);
      this.postMessage(toMessage({
        ready: true
      }, 'create'), {
        source: window.parent,
        origin: '*'
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (!this.state.isInIframe) {
        return;
      }

      window.removeEventListener('message', this.handleReceiveMessage);
    }
  }, {
    key: "postMessage",
    value: function postMessage(data) {
      var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state.container;
      container.source.postMessage(toMessage(data, 'create'), container.origin);
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
      }));
    }
  }]);

  return ObjectCreatorContainer;
}(Component);

export default ObjectCreatorContainer;