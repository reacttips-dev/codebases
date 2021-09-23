'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { getIsTwilioBasedCallProvider } from 'calling-lifecycle-internal/call-provider/operators/getIsTwilioBasedCallProvider';
import ClientStatusPropType from 'calling-internal-common/widget-status/prop-types/ClientStatusPropType';
import styled from 'styled-components';
import AsyncRTE from '../../rte/components/AsyncRTE';
import CalleeSelectionContainer from '../../callee-selection/containers/CalleeSelectionContainer';
import AsyncGDPRContainer from '../../gdpr/containers/AsyncGDPRContainer';
import { getShouldShowPreCallState } from 'calling-internal-common/widget-status/operators/getCallState';
import ThirdPartyCalleeAvatarContainer from '../containers/ThirdPartyCalleeAvatarContainer';
import UIIllustration from 'UIComponents/image/UIIllustration';
import FormattedMessage from 'I18n/components/FormattedMessage';
var WidgetBodyWrapper = styled.div.withConfig({
  displayName: "WidgetBody__WidgetBodyWrapper",
  componentId: "sc-1b4e3py-0"
})(["height:100%;overflow:hidden;"]);

var WidgetBody = /*#__PURE__*/function (_PureComponent) {
  _inherits(WidgetBody, _PureComponent);

  function WidgetBody() {
    _classCallCheck(this, WidgetBody);

    return _possibleConstructorReturn(this, _getPrototypeOf(WidgetBody).apply(this, arguments));
  }

  _createClass(WidgetBody, [{
    key: "renderGDPRMessage",
    value: function renderGDPRMessage() {
      return /*#__PURE__*/_jsx(AsyncGDPRContainer, {});
    }
  }, {
    key: "renderRTE",
    value: function renderRTE() {
      var _this$props = this.props,
          clientStatus = _this$props.clientStatus,
          setNotes = _this$props.setNotes,
          appIdentifier = _this$props.appIdentifier;
      return /*#__PURE__*/_jsx(AsyncRTE, {
        onChange: setNotes,
        clientStatus: clientStatus,
        appIdentifier: appIdentifier
      });
    }
  }, {
    key: "renderTwilioCallingBody",
    value: function renderTwilioCallingBody() {
      var _this$props2 = this.props,
          clientStatus = _this$props2.clientStatus,
          shouldShowGDPRMessage = _this$props2.shouldShowGDPRMessage,
          subjectId = _this$props2.subjectId,
          objectTypeId = _this$props2.objectTypeId;
      var isPreCall = getShouldShowPreCallState(clientStatus);
      return /*#__PURE__*/_jsxs(_Fragment, {
        children: [isPreCall && subjectId && objectTypeId && /*#__PURE__*/_jsx(CalleeSelectionContainer, {}), shouldShowGDPRMessage ? this.renderGDPRMessage() : this.renderRTE()]
      });
    }
  }, {
    key: "renderExternalProviderBody",
    value: function renderExternalProviderBody() {
      var _this$props3 = this.props,
          shouldShowGDPRMessage = _this$props3.shouldShowGDPRMessage,
          providerSupportsObjectType = _this$props3.providerSupportsObjectType,
          subjectId = _this$props3.subjectId,
          objectTypeId = _this$props3.objectTypeId;

      if (!providerSupportsObjectType) {
        return /*#__PURE__*/_jsx(_Fragment, {
          children: /*#__PURE__*/_jsxs("div", {
            className: "text-center p-x-7 p-top-12 p-bottom-14 align-center flex-column",
            children: [/*#__PURE__*/_jsx(UIIllustration, {
              name: "errors/map",
              width: "25%",
              className: "m-bottom-6"
            }), /*#__PURE__*/_jsx("h3", {
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "calling-communicator-ui.thirdPartyCustomObjectAlert.header"
              })
            }), /*#__PURE__*/_jsx("p", {
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "calling-communicator-ui.thirdPartyCustomObjectAlert.info"
              })
            })]
          })
        });
      }

      return /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx(ThirdPartyCalleeAvatarContainer, {}), subjectId && objectTypeId && /*#__PURE__*/_jsx(CalleeSelectionContainer, {}), shouldShowGDPRMessage ? this.renderGDPRMessage() : null]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var selectedCallProvider = this.props.selectedCallProvider;
      var isTwilioBasedCallProvider = getIsTwilioBasedCallProvider(selectedCallProvider);
      return /*#__PURE__*/_jsx(WidgetBodyWrapper, {
        className: "flex-column p-x-3",
        children: isTwilioBasedCallProvider ? this.renderTwilioCallingBody() : this.renderExternalProviderBody()
      });
    }
  }]);

  return WidgetBody;
}(PureComponent);

WidgetBody.propTypes = {
  setNotes: PropTypes.func.isRequired,
  clientStatus: ClientStatusPropType.isRequired,
  selectedCallProvider: RecordPropType('CallingProvider').isRequired,
  shouldShowGDPRMessage: PropTypes.bool,
  providerSupportsObjectType: PropTypes.bool,
  objectTypeId: PropTypes.string,
  subjectId: PropTypes.string,
  appIdentifier: PropTypes.string.isRequired
};
export { WidgetBody as default };