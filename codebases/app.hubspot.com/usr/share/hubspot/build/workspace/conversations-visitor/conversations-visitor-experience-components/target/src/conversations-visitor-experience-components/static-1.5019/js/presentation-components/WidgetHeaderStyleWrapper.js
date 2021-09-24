'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import styled from 'styled-components';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { HEADER_HEIGHT } from '../widget-dimensions/constants/dimensions';
import { getBrandStyle } from '../visitor-widget/util/color';
export var FullHeightDiv = styled.div.withConfig({
  displayName: "WidgetHeaderStyleWrapper__FullHeightDiv",
  componentId: "naedoy-0"
})(["align-items:center;color:", ";display:flex;height:100%;padding:16px 16px;"], function (_ref) {
  var textColor = _ref.textColor;
  return textColor;
});
export var BackgroundPanelContent = styled.div.withConfig({
  displayName: "WidgetHeaderStyleWrapper__BackgroundPanelContent",
  componentId: "naedoy-1"
})(["height:", "px;border-radius:", ";"], HEADER_HEIGHT, function (_ref2) {
  var mobile = _ref2.mobile,
      inline = _ref2.inline;
  return mobile || inline ? '0' : '8px 8px 0 0';
});

var WidgetHeaderStyleWrapper = /*#__PURE__*/function (_Component) {
  _inherits(WidgetHeaderStyleWrapper, _Component);

  function WidgetHeaderStyleWrapper() {
    _classCallCheck(this, WidgetHeaderStyleWrapper);

    return _possibleConstructorReturn(this, _getPrototypeOf(WidgetHeaderStyleWrapper).apply(this, arguments));
  }

  _createClass(WidgetHeaderStyleWrapper, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          inline = _this$props.inline,
          mobile = _this$props.mobile,
          _this$props$coloring = _this$props.coloring,
          accentColor = _this$props$coloring.accentColor,
          textColor = _this$props$coloring.textColor;
      return /*#__PURE__*/_jsx(BackgroundPanelContent, {
        className: 'widget-background-panel',
        style: getBrandStyle(accentColor),
        mobile: mobile,
        inline: inline,
        children: /*#__PURE__*/_jsx(FullHeightDiv, {
          textColor: textColor,
          children: this.props.children
        })
      });
    }
  }]);

  return WidgetHeaderStyleWrapper;
}(Component);

WidgetHeaderStyleWrapper.displayName = 'WidgetHeaderStyleWrapper';
WidgetHeaderStyleWrapper.propTypes = {
  children: PropTypes.node,
  coloring: RecordPropType('ColoringRecord').isRequired,
  inline: PropTypes.bool.isRequired,
  mobile: PropTypes.bool
};
export default WidgetHeaderStyleWrapper;