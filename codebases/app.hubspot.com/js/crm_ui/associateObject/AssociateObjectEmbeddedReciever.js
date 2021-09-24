'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { getId } from 'customer-data-objects/model/ImmutableModel';
import EmptyStateMessage from '../emptyState/EmptyStateMessage';
import { Component } from 'react';
import { inIframe, TYPE } from 'crm_schema/creator/ObjectEmbedMessage';
import AssociateObjectSidebarContainer from './AssociateObjectSidebarContainer';
import UIEmbeddedComponent from 'ui-addon-iframeable/embed/UIEmbeddedComponent';
import EmbeddedContextPropType from 'ui-addon-iframeable/embed/EmbeddedContextPropType';
import { MSG_TYPE_MODAL_DIALOG_CLOSE } from 'ui-addon-iframeable/messaging/IFrameMessageTypes';
import PropTypes from 'prop-types';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import { ERROR_UNPLUG } from '../constants/ERROR_UNPLUG';
var ASSOCIATE_PANEL_MESSAGE_TYPE = TYPE.associate;

var AssociateObjectEmbeddedReciever = /*#__PURE__*/function (_Component) {
  _inherits(AssociateObjectEmbeddedReciever, _Component);

  function AssociateObjectEmbeddedReciever(props) {
    var _this;

    _classCallCheck(this, AssociateObjectEmbeddedReciever);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AssociateObjectEmbeddedReciever).call(this, props));

    _this.handleReceiveMessage = function (_ref) {
      var payload = _ref.payload;

      if (payload.type === MSG_TYPE_MODAL_DIALOG_CLOSE) {
        _this.handleReject();
      }
    };

    _this.handleObjectCreated = function (object, addAnother) {
      var _this$props = _this.props,
          objectType = _this$props.objectType,
          associationObjectType = _this$props.associationObjectType,
          subjectId = _this$props.subjectId;
      var createdObjectId = getId(object);

      _this.postMessage({
        createdObjectId: createdObjectId,
        idsToAssociate: [createdObjectId],
        fromObjectType: objectType,
        toObjectType: associationObjectType,
        subjectId: subjectId,
        addAnother: addAnother
      });
    };

    _this.handleAssociationsUpdated = function (idsToDisassociate, idsToAssociate) {
      var _this$props2 = _this.props,
          objectType = _this$props2.objectType,
          associationObjectType = _this$props2.associationObjectType,
          subjectId = _this$props2.subjectId;

      _this.postMessage({
        idsToDisassociate: idsToDisassociate,
        idsToAssociate: idsToAssociate,
        fromObjectType: objectType,
        toObjectType: associationObjectType,
        subjectId: subjectId
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

    _this.handleReject = function () {
      _this.postMessage({
        close: true
      });
    };

    _this.isInIframe = inIframe();
    _this.handleReceiveMessage = _this.handleReceiveMessage.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(AssociateObjectEmbeddedReciever, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.isInIframe) {
        return;
      }

      this.props.onReady({
        receiveMessage: this.handleReceiveMessage
      });
    }
  }, {
    key: "postMessage",
    value: function postMessage(data) {
      this.props.embeddedContext.sendMessage(ASSOCIATE_PANEL_MESSAGE_TYPE, data);
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
      var sourceApp = this.props.embeddedContext.app.name;
      var _this$props3 = this.props,
          objectType = _this$props3.objectType,
          associationObjectType = _this$props3.associationObjectType,
          subjectId = _this$props3.subjectId;

      if (!this.isInIframe) {
        return this.renderBadConfig();
      }

      if (!sourceApp || !objectType || !associationObjectType || !subjectId) {
        return null;
      }

      return /*#__PURE__*/_jsx("div", {
        "data-embedded-associate-panel-type": associationObjectType,
        children: /*#__PURE__*/_jsx(AssociateObjectSidebarContainer, {
          additionalRequiredProperties: this.props.additionalRequiredProperties,
          additionalProperties: this.props.additionalProperties,
          ignoreDefaultCreatorProperties: this.props.ignoreDefaultCreatorProperties,
          onObjectCreated: this.handleObjectCreated,
          onConfirmError: this.handleConfirmError,
          onAssociationsUpdated: this.handleAssociationsUpdated,
          associationObjectType: associationObjectType,
          objectType: objectType,
          onReject: this.handleReject,
          sourceApp: sourceApp,
          subjectId: subjectId,
          bodyText: this.props.bodyText,
          isEmbedded: true
        })
      });
    }
  }]);

  return AssociateObjectEmbeddedReciever;
}(Component);

AssociateObjectEmbeddedReciever.propTypes = {
  embeddedContext: EmbeddedContextPropType,
  onReady: PropTypes.func.isRequired,
  additionalRequiredProperties: PropTypes.arrayOf(PropTypes.string),
  additionalProperties: PropTypes.arrayOf(PropTypes.string),
  ignoreDefaultCreatorProperties: PropTypes.bool,
  subjectId: PropTypes.string,
  bodyText: PropTypes.string,
  objectType: ObjectTypesType,
  associationObjectType: ObjectTypesType
};
export default UIEmbeddedComponent(AssociateObjectEmbeddedReciever);