'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";

var _WidgetWrapperLocatio;

import PropTypes from 'prop-types';
import { Component } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import { LEFT_ALIGNED, RIGHT_ALIGNED, WidgetLocationProp } from '../visitor-widget/constants/WidgetLocations';
import { calculateChatWidgetHeight } from '../widget-dimensions/calculateChatWidgetHeight';
import { OLAF } from 'HubStyleTokens/colors';
import { BASE_WIDGET_WIDTH, WIDGET_SHADOW_WIDTH } from '../widget-dimensions/constants/dimensions';
var sizes = {
  small: 'small',
  'extra-small': 'extra-small',
  default: 'default'
};
export var VISITOR_WIDGET_BORDER_RADIUS = 8;
export var WidgetStyleWrapper = styled.div.withConfig({
  displayName: "VisitorWidgetStyleWrapper__WidgetStyleWrapper",
  componentId: "sc-1bonnz7-0"
})(["display:flex;flex-direction:column;align-items:flex-end;height:", ";width:", ";margin-top:", ";transform:", ";transform-origin:bottom right;"], function (_ref) {
  var inline = _ref.inline,
      mobile = _ref.mobile;
  return inline || mobile ? '100%' : undefined;
}, function (_ref2) {
  var mobile = _ref2.mobile;
  return mobile ? '100%' : undefined;
}, function (_ref3) {
  var inline = _ref3.inline;
  return inline ? '0' : undefined;
}, function (_ref4) {
  var size = _ref4.size;

  if (size === sizes.small) {
    return 'scale(0.75)';
  } else if (size === sizes['extra-small']) {
    return 'scale(0.5)';
  } else {
    return undefined;
  }
});
var WidgetWrapperLocation = (_WidgetWrapperLocatio = {}, _defineProperty(_WidgetWrapperLocatio, LEFT_ALIGNED, css(["margin-left:0;margin-right:", "px;"], WIDGET_SHADOW_WIDTH)), _defineProperty(_WidgetWrapperLocatio, RIGHT_ALIGNED, css(["margin-left:", "px;margin-right:0;"], WIDGET_SHADOW_WIDTH)), _WidgetWrapperLocatio);
export var WidgetContentStyleWrapper = styled.div.withConfig({
  displayName: "VisitorWidgetStyleWrapper__WidgetContentStyleWrapper",
  componentId: "sc-1bonnz7-1"
})(["height:", ";background:", ";border-radius:", "px;box-shadow:0 5px 20px rgba(0,0,0,0.1);position:relative;width:", "px;transition:bottom 0.25s ease-in-out;&.inline{box-shadow:none;height:100%;margin:0;width:100%;border-radius:0;}", " &&.onInputFocus{bottom:0;top:auto;height:60%;}"], function (_ref5) {
  var mobile = _ref5.mobile,
      browserWindowHeight = _ref5.browserWindowHeight,
      showCloseButton = _ref5.showCloseButton;
  return !mobile ? calculateChatWidgetHeight(browserWindowHeight, {
    showCloseButton: showCloseButton
  }) + "px" : '100%';
}, OLAF, VISITOR_WIDGET_BORDER_RADIUS, BASE_WIDGET_WIDTH, function (_ref6) {
  var widgetLocation = _ref6.widgetLocation;
  return WidgetWrapperLocation[widgetLocation] || WidgetWrapperLocation[RIGHT_ALIGNED];
});

var VisitorWidgetStyleWrapper = /*#__PURE__*/function (_Component) {
  _inherits(VisitorWidgetStyleWrapper, _Component);

  function VisitorWidgetStyleWrapper() {
    _classCallCheck(this, VisitorWidgetStyleWrapper);

    return _possibleConstructorReturn(this, _getPrototypeOf(VisitorWidgetStyleWrapper).apply(this, arguments));
  }

  _createClass(VisitorWidgetStyleWrapper, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          browserWindowHeight = _this$props.browserWindowHeight,
          className = _this$props.className,
          inline = _this$props.inline,
          shouldResizeContainer = _this$props.shouldResizeContainer,
          showCloseButton = _this$props.showCloseButton,
          size = _this$props.size,
          style = _this$props.style,
          mobile = _this$props.mobile,
          widgetLocation = _this$props.widgetLocation;
      return /*#__PURE__*/_jsx(WidgetStyleWrapper, {
        style: style,
        inline: inline,
        size: size,
        mobile: mobile,
        children: /*#__PURE__*/_jsx(WidgetContentStyleWrapper, {
          className: classNames('chat-widget', className, mobile && "mobile", inline && "inline", shouldResizeContainer && "onInputFocus"),
          "data-test-id": 'chat-widget-wrapper',
          browserWindowHeight: browserWindowHeight,
          widgetLocation: widgetLocation,
          mobile: mobile,
          showCloseButton: showCloseButton,
          children: this.props.children
        })
      });
    }
  }]);

  return VisitorWidgetStyleWrapper;
}(Component);

VisitorWidgetStyleWrapper.propTypes = {
  browserWindowHeight: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  inline: PropTypes.bool.isRequired,
  mobile: PropTypes.bool,
  shouldResizeContainer: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  size: PropTypes.oneOf(Object.keys(sizes)).isRequired,
  style: PropTypes.object,
  widgetLocation: WidgetLocationProp
};
VisitorWidgetStyleWrapper.defaultProps = {
  inline: false,
  isOpen: false,
  showCloseButton: true,
  size: sizes.default,
  widgetLocation: RIGHT_ALIGNED
};
VisitorWidgetStyleWrapper.displayName = 'VisitorWidgetStyleWrapper';
export default VisitorWidgetStyleWrapper;