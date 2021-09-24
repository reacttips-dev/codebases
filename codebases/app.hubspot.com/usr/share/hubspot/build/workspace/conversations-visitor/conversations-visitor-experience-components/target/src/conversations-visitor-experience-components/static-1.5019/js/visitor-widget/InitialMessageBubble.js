'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

var _WrapperLocation, _BubbleTailWrapperLoc;

import { List } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import styled, { css } from 'styled-components';
import I18n from 'I18n';
import { EERIE } from 'HubStyleTokens/colors';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import { reportError } from 'conversations-error-reporting/error-reporting/reportError';
import { AVATAR_SIZES } from 'visitor-ui-component-library/avatar/constants/AvatarSizes';
import ChatHeadingConfigPropType from 'conversations-prop-types/prop-types/ChatHeadingConfigPropType';
import SVGClose from 'visitor-ui-component-library-icons/icons/SVGClose';
import { LEFT_ALIGNED, RIGHT_ALIGNED, WidgetLocationProp } from './constants/WidgetLocations';
import InitialMessageAvatars from './components/InitialMessageAvatars';
var WrapperLocation = (_WrapperLocation = {}, _defineProperty(_WrapperLocation, LEFT_ALIGNED, css(["padding-right:20px;.initial-message-close-button{right:inherit !important;left:8px;}"])), _defineProperty(_WrapperLocation, RIGHT_ALIGNED, css(["padding-left:20px;"])), _WrapperLocation);
export var StyleWrapper = styled.div.withConfig({
  displayName: "InitialMessageBubble__StyleWrapper",
  componentId: "sc-72p1ek-0"
})(["width:260px;&.mobile{width:inherit;}", ";"], function (_ref) {
  var widgetLocation = _ref.widgetLocation;
  return WrapperLocation[widgetLocation] || WrapperLocation[RIGHT_ALIGNED];
});
var BubbleTailWrapperLocation = (_BubbleTailWrapperLoc = {}, _defineProperty(_BubbleTailWrapperLoc, LEFT_ALIGNED, css(["left:40px;right:inherit;transform:scaleX(-1);"])), _defineProperty(_BubbleTailWrapperLoc, RIGHT_ALIGNED, css(["left:inherit;right:40px;"])), _BubbleTailWrapperLoc);
export var BubbleTailWrapper = styled.div.withConfig({
  displayName: "InitialMessageBubble__BubbleTailWrapper",
  componentId: "sc-72p1ek-1"
})(["position:absolute;bottom:-22px;", ";"], function (_ref2) {
  var widgetLocation = _ref2.widgetLocation;
  return BubbleTailWrapperLocation[widgetLocation] || BubbleTailWrapperLocation[RIGHT_ALIGNED];
});
export var CloseButton = styled.button.withConfig({
  displayName: "InitialMessageBubble__CloseButton",
  componentId: "sc-72p1ek-2"
})(["background:none;border:none;height:48px;width:48px;position:absolute;top:0;right:0;color:", ";display:flex;align-items:flex-start;justify-content:flex-end;padding-right:10px;padding-top:14px;z-index:2;"], EERIE);
export default createReactClass({
  displayName: 'InitialMessageBubble',
  propTypes: {
    avatarHeightAboveBubble: PropTypes.number,
    chatHeadingConfig: ChatHeadingConfigPropType.isRequired,
    chatHeadingResponders: PropTypes.instanceOf(List).isRequired,
    initialMessage: PropTypes.string.isRequired,
    mobile: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdateSize: PropTypes.func.isRequired,
    setInitialMessageRef: PropTypes.func,
    widgetLocation: WidgetLocationProp
  },
  getDefaultProps: function getDefaultProps() {
    return {
      mobile: false,
      onUpdateSize: function onUpdateSize() {},
      setInitialMessageRef: function setInitialMessageRef() {}
    };
  },
  componentDidMount: function componentDidMount() {
    this.props.onUpdateSize();
  },
  componentDidUpdate: function componentDidUpdate(nextProps) {
    if (nextProps.initialMessage !== this.props.initialMessage) {
      this.props.onUpdateSize();
    }
  },
  onClose: function onClose() {
    try {
      this.props.onClose();
    } catch (err) {
      reportError({
        error: 'InitialMessageBubble Mysterious Error',
        fingerprint: ['ComponentError'],
        tags: {
          componentDidCatch: true
        }
      });
    }
  },
  renderAvatar: function renderAvatar() {
    var _this$props = this.props,
        avatarHeightAboveBubble = _this$props.avatarHeightAboveBubble,
        chatHeadingConfig = _this$props.chatHeadingConfig,
        chatHeadingResponders = _this$props.chatHeadingResponders,
        mobile = _this$props.mobile,
        onClick = _this$props.onClick;
    var avatarHeightPx = mobile ? AVATAR_SIZES.sm : AVATAR_SIZES.md;
    var top = -(avatarHeightAboveBubble || avatarHeightPx / 2);
    return /*#__PURE__*/_jsx("div", {
      "data-test-id": "initial-message-avatar-wrapper",
      className: "initial-message-avatar justify-center",
      onClick: onClick,
      style: {
        top: top
      },
      children: /*#__PURE__*/_jsx(InitialMessageAvatars, {
        chatHeadingConfig: chatHeadingConfig,
        chatHeadingResponders: chatHeadingResponders,
        mobile: mobile
      })
    });
  },
  renderCloseButton: function renderCloseButton() {
    return /*#__PURE__*/_jsx(CloseButton, {
      "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.dismiss'),
      "aria-disabled": "false",
      "data-test-id": "initial-message-close-button",
      responsive: false,
      onClick: this.onClose,
      children: /*#__PURE__*/_jsx(VizExIcon, {
        icon: /*#__PURE__*/_jsx(SVGClose, {})
      })
    });
  },
  render: function render() {
    var _this$props2 = this.props,
        initialMessage = _this$props2.initialMessage,
        onClick = _this$props2.onClick,
        mobile = _this$props2.mobile,
        setInitialMessageRef = _this$props2.setInitialMessageRef,
        widgetLocation = _this$props2.widgetLocation;
    return /*#__PURE__*/_jsx(StyleWrapper, {
      className: 'p-top-8' + (mobile ? " mobile" : ""),
      tabIndex: "0",
      "aria-live": "assertive",
      "aria-label": initialMessage,
      role: "alert",
      ref: setInitialMessageRef,
      widgetLocation: widgetLocation,
      children: /*#__PURE__*/_jsxs("div", {
        className: "initial-message-bubble",
        children: [this.renderCloseButton(), this.renderAvatar(), /*#__PURE__*/_jsx("p", {
          "data-test-id": "initial-message-text",
          className: "initial-message-text m-top-1 m-bottom-0",
          onClick: onClick,
          children: initialMessage
        })]
      })
    });
  }
});