'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component, forwardRef } from 'react';
import UIIconCircle from 'UIComponents/icon/UIIconCircle';
import styled from 'styled-components';
import { GREAT_WHITE, GYPSUM, CANDY_APPLE, OZ, FLINT, CANDY_APPLE_LIGHT, CANDY_APPLE_MEDIUM } from 'HubStyleTokens/colors';
import { DISTANCE_MEASUREMENT_MEDIUM } from 'HubStyleTokens/sizes';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import UICloseButton from 'UIComponents/button/UICloseButton';
import { createTicket } from '../../zorse/zorseControls';
var CustomAlert = styled.div.withConfig({
  displayName: "CallBanner__CustomAlert",
  componentId: "jbsch5-0"
})(["position:relative;border-width:0 0 1px 0 !important;border-color:", " !important;border-style:solid;background-color:", " !important;"], GREAT_WHITE, function (props) {
  return props && props.backgroundColor;
});
var ErrorAlert = styled.div.withConfig({
  displayName: "CallBanner__ErrorAlert",
  componentId: "jbsch5-1"
})(["max-width:", ";margin-bottom:", ";border-width:0 0 1px 0 !important;border-color:", " !important;border-style:solid;background-color:", " !important;"], function (props) {
  return props && props.isincommunicator !== 'true' ? '435px' : 'inherit';
}, function (props) {
  return props && props.isincommunicator !== 'true' ? '8px' : 'inherit';
}, CANDY_APPLE_MEDIUM, CANDY_APPLE_LIGHT);
var StyledCloseButton = styled(UICloseButton).withConfig({
  displayName: "CallBanner__StyledCloseButton",
  componentId: "jbsch5-2"
})(["display:flex;flex-shrink:1;align-self:center;"]);
var propTypes = {
  bannerType: PropTypes.string,
  iconName: PropTypes.string,
  isError: PropTypes.bool,
  isInCommunicator: PropTypes.bool,
  isPaidHub: PropTypes.bool,
  message: PropTypes.node,
  options: PropTypes.object,
  showMinutesUsage: PropTypes.bool,
  source: PropTypes.string,
  title: PropTypes.node.isRequired,
  onCloseClick: PropTypes.func,
  backgroundColor: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
    current: PropTypes.instanceOf(Element)
  })])
};
var defaultProps = {
  isInCommunicator: true,
  isPaidHub: false,
  isUsingTwilioConnect: false,
  showMinutesUsage: false,
  backgroundColor: GYPSUM,
  options: {}
};

var CallBanner = /*#__PURE__*/function (_Component) {
  _inherits(CallBanner, _Component);

  function CallBanner(props) {
    var _this;

    _classCallCheck(this, CallBanner);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CallBanner).call(this, props)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.handleLogBannerEvent = function (type) {
      var _this$props = _this.props,
          source = _this$props.source,
          bannerType = _this$props.bannerType;
      CommunicatorLogger.log(type, {
        activity: 'call',
        channel: 'outbound call',
        source: source,
        bannerType: bannerType
      });
    };

    _this.handleContactSupport = function () {
      _this.handleLogBannerEvent('communicator_bannerInteraction');

      createTicket();
    };

    _this.partial = memoize(partial);
    return _this;
  }

  _createClass(CallBanner, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handleLogBannerEvent('communicator_bannerView');
    }
  }, {
    key: "getMessageContent",
    value: function getMessageContent(message) {
      if (!message) {
        return null;
      }

      return /*#__PURE__*/_jsx("span", {
        style: {
          fontWeight: '400'
        },
        children: message
      });
    }
  }, {
    key: "renderAlertTitle",
    value: function renderAlertTitle(title) {
      return /*#__PURE__*/_jsx("span", {
        style: {
          fontWeight: 600
        },
        "data-selenium-test": "call-done-error-title",
        children: title
      });
    }
  }, {
    key: "renderMessage",
    value: function renderMessage() {
      var _this$props2 = this.props,
          message = _this$props2.message,
          options = _this$props2.options;
      var messageContent = this.getMessageContent(message, options);

      if (!messageContent) {
        return null;
      }

      return /*#__PURE__*/_jsx("span", {
        "data-selenium-test": "call-done-error-message",
        children: messageContent
      });
    }
  }, {
    key: "renderMessageAndTitle",
    value: function renderMessageAndTitle() {
      var _this$props3 = this.props,
          title = _this$props3.title,
          options = _this$props3.options;

      if (!this.props.showMinutesUsage) {
        return /*#__PURE__*/_jsxs("div", {
          style: {
            flexGrow: 1,
            paddingRight: DISTANCE_MEASUREMENT_MEDIUM
          },
          children: [this.renderAlertTitle(title, options), " ", this.renderMessage()]
        });
      }

      return /*#__PURE__*/_jsxs("div", {
        className: "width-100 p-left-2",
        children: [/*#__PURE__*/_jsx("div", {
          className: "display-flex justify-between",
          children: this.renderAlertTitle(title, options)
        }), this.renderMessage()]
      });
    }
  }, {
    key: "renderIcon",
    value: function renderIcon() {
      if (!this.props.iconName) {
        return null;
      }

      var backgroundColor = OZ;

      if (this.props.iconName === 'remove') {
        backgroundColor = CANDY_APPLE;
      }

      return /*#__PURE__*/_jsx("div", {
        children: /*#__PURE__*/_jsx(UIIconCircle, {
          backgroundColor: backgroundColor,
          borderWidth: 0,
          className: "m-y-0 m-left-0 m-right-2",
          color: GREAT_WHITE,
          name: this.props.iconName,
          size: 8,
          verticalAlign: "top",
          innerStyles: {
            transform: 'scale(1.7)',
            transformOrigin: 'center'
          }
        })
      });
    }
  }, {
    key: "renderCloseButton",
    value: function renderCloseButton() {
      if (!this.props.onCloseClick) {
        return null;
      }

      return /*#__PURE__*/_jsx(StyledCloseButton, {
        color: FLINT,
        onClick: this.props.onCloseClick,
        size: 'medium'
      });
    }
  }, {
    key: "render",
    value: function render() {
      var BannerComponent = this.props.isError ? ErrorAlert : CustomAlert;
      var extraProps = {};

      if (!this.props.isError) {
        extraProps.backgroundColor = this.props.backgroundColor;
      }

      return /*#__PURE__*/_jsxs(BannerComponent, Object.assign({
        className: "p-all-3 display-flex",
        type: "danger",
        isincommunicator: "" + this.props.isInCommunicator,
        ref: this.props.innerRef
      }, extraProps, {
        children: [this.renderIcon(), this.renderMessageAndTitle(), this.renderCloseButton()]
      }));
    }
  }]);

  return CallBanner;
}(Component);

CallBanner.propTypes = propTypes;
CallBanner.defaultProps = defaultProps;
export default /*#__PURE__*/forwardRef(function (props, ref) {
  return /*#__PURE__*/_jsx(CallBanner, Object.assign({}, props, {
    innerRef: ref
  }));
});