'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';
import UITextToolbarButton from 'UIComponents/editor/UITextToolbarButton';
import UITextToolbarIcon from 'UIComponents/editor/UITextToolbarIcon';
import UITooltip from 'UIComponents/tooltip/UITooltip';
export default createReactClass({
  displayName: "SmallToggleButton",
  mixins: [PureRenderMixin],
  render: function render() {
    var _this$props = this.props,
        active = _this$props.active,
        children = _this$props.children,
        className = _this$props.className,
        _this$props$disabled = _this$props.disabled,
        disabled = _this$props$disabled === void 0 ? false : _this$props$disabled,
        icon = _this$props.icon,
        onClick = _this$props.onClick,
        tooltip = _this$props.tooltip,
        _this$props$tooltipPl = _this$props.tooltipPlacement,
        tooltipPlacement = _this$props$tooltipPl === void 0 ? 'top' : _this$props$tooltipPl,
        rest = _objectWithoutProperties(_this$props, ["active", "children", "className", "disabled", "icon", "onClick", "tooltip", "tooltipPlacement"]);

    var finalClassName = classNames(className, 'draft-toolbar-button');
    var shouldForceTooltipClosed = disabled || active;
    return /*#__PURE__*/_jsx(UITooltip, {
      open: shouldForceTooltipClosed ? false : undefined,
      title: tooltip,
      placement: tooltipPlacement,
      children: /*#__PURE__*/_jsxs(UITextToolbarButton, Object.assign({
        className: finalClassName,
        disabled: disabled,
        onSelectedChange: onClick,
        selected: active
      }, rest, {
        children: [children, /*#__PURE__*/_jsx(UITextToolbarIcon, {
          disabled: disabled,
          name: icon
        })]
      }))
    });
  }
});