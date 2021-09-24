'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import I18n from 'I18n';
import styled from 'styled-components';
import { AVATAR_SIZES } from 'visitor-ui-component-library/avatar/constants/AvatarSizes';
import ChatHeadingConfigPropType from 'conversations-prop-types/prop-types/ChatHeadingConfigPropType';
import ChatHeadingAvatars from './ChatHeadingAvatars';
import { getWidgetTitleText } from '../operators/getWidgetTitleText';
import { SMALL } from 'visitor-ui-component-library/constants/sizes';
var BORDER_WIDTH = 2;
var Wrapper = styled.div.withConfig({
  displayName: "WidgetHeaderAvatarWrapper__Wrapper",
  componentId: "kds1zi-0"
})(["display:inline-flex;align-items:center;flex:1 1 auto;height:", "px;min-width:0;"], AVATAR_SIZES[SMALL] + BORDER_WIDTH * 2);
var HeaderTextWrapper = styled.div.withConfig({
  displayName: "WidgetHeaderAvatarWrapper__HeaderTextWrapper",
  componentId: "kds1zi-1"
})(["display:flex;flex-direction:column;height:100%;width:100%;justify-content:center;min-width:0;"]);
var HeaderName = styled.h5.withConfig({
  displayName: "WidgetHeaderAvatarWrapper__HeaderName",
  componentId: "kds1zi-2"
})(["line-height:20px;margin-bottom:0;font-size:", ";"], function (props) {
  return props.titleText && props.titleText.length > 20 ? '14px' : null;
});
var AvailabilityMessage = styled.div.withConfig({
  displayName: "WidgetHeaderAvatarWrapper__AvailabilityMessage",
  componentId: "kds1zi-3"
})(["font-size:11px;line-height:initial;"]);
var TruncateString = styled.div.withConfig({
  displayName: "WidgetHeaderAvatarWrapper__TruncateString",
  componentId: "kds1zi-4"
})(["white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"]);

var WidgetHeaderAvatarWrapper = /*#__PURE__*/function (_PureComponent) {
  _inherits(WidgetHeaderAvatarWrapper, _PureComponent);

  function WidgetHeaderAvatarWrapper() {
    _classCallCheck(this, WidgetHeaderAvatarWrapper);

    return _possibleConstructorReturn(this, _getPrototypeOf(WidgetHeaderAvatarWrapper).apply(this, arguments));
  }

  _createClass(WidgetHeaderAvatarWrapper, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          availabilityMessage = _this$props.availabilityMessage,
          chatHeadingConfig = _this$props.chatHeadingConfig,
          chatHeadingResponders = _this$props.chatHeadingResponders,
          locale = _this$props.locale,
          mobile = _this$props.mobile,
          showAvailabilityMessage = _this$props.showAvailabilityMessage,
          showStatusIndicator = _this$props.showStatusIndicator,
          borderColor = _this$props.borderColor;
      var titleText = getWidgetTitleText(chatHeadingConfig, chatHeadingResponders, locale) || I18n.text('conversations-visitor-experience-components.default.agent');
      return /*#__PURE__*/_jsxs(Wrapper, {
        children: [/*#__PURE__*/_jsx("div", {
          "data-test-id": "chat-heading-avatar",
          children: /*#__PURE__*/_jsx(ChatHeadingAvatars, {
            chatHeadingConfig: chatHeadingConfig,
            chatHeadingResponders: chatHeadingResponders,
            mobile: mobile,
            showStatusIndicator: showStatusIndicator,
            borderColor: borderColor
          })
        }), /*#__PURE__*/_jsxs(HeaderTextWrapper, {
          className: "p-x-3",
          children: [/*#__PURE__*/_jsx(HeaderName, {
            titleText: titleText,
            "aria-level": "1",
            children: /*#__PURE__*/_jsx(TruncateString, {
              children: /*#__PURE__*/_jsx("span", {
                "data-test-id": "widget-header-name",
                className: "widget-header-name p-y-0",
                children: titleText
              })
            })
          }), showAvailabilityMessage && /*#__PURE__*/_jsx(AvailabilityMessage, {
            "data-test-type": "timestamp",
            children: availabilityMessage
          })]
        })]
      });
    }
  }]);

  return WidgetHeaderAvatarWrapper;
}(PureComponent);

WidgetHeaderAvatarWrapper.propTypes = {
  availabilityMessage: PropTypes.string,
  borderColor: PropTypes.string.isRequired,
  chatHeadingConfig: ChatHeadingConfigPropType.isRequired,
  chatHeadingResponders: PropTypes.instanceOf(List).isRequired,
  locale: PropTypes.string,
  mobile: PropTypes.bool.isRequired,
  showAvailabilityMessage: PropTypes.bool.isRequired,
  showStatusIndicator: PropTypes.bool.isRequired
};
WidgetHeaderAvatarWrapper.defaultProps = {
  mobile: false,
  showStatusIndicator: false
};
WidgetHeaderAvatarWrapper.displayName = 'WidgetHeaderAvatarWrapper';
export default WidgetHeaderAvatarWrapper;