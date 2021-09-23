'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import classNames from 'classnames';
import emptyFunction from 'react-utils/emptyFunction';
export default createReactClass({
  displayName: "ToggleButton",
  propTypes: {
    active: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    icon: UIIcon.propTypes.name,
    iconStyle: PropTypes.object,
    label: PropTypes.string,
    onClick: PropTypes.func,
    tooltip: PropTypes.node.isRequired,
    tooltipPlacement: PropTypes.string.isRequired
  },
  mixins: [PureRenderMixin],
  getDefaultProps: function getDefaultProps() {
    return {
      active: false,
      disabled: false,
      label: '',
      icon: null,
      iconStyle: {},
      onClick: emptyFunction,
      tooltip: '',
      tooltipPlacement: 'top'
    };
  },
  renderLabel: function renderLabel() {
    var _this$props = this.props,
        icon = _this$props.icon,
        iconStyle = _this$props.iconStyle,
        label = _this$props.label;

    if (icon !== null) {
      return /*#__PURE__*/_jsx(UIIcon, {
        name: icon,
        style: iconStyle
      });
    }

    return label;
  },
  render: function render() {
    var _this$props2 = this.props,
        active = _this$props2.active,
        children = _this$props2.children,
        className = _this$props2.className,
        disabled = _this$props2.disabled,
        onClick = _this$props2.onClick,
        tooltip = _this$props2.tooltip,
        tooltipPlacement = _this$props2.tooltipPlacement;
    var classes = classNames(className, active && "active");
    return /*#__PURE__*/_jsx(UITooltip, {
      disabled: !tooltip,
      placement: tooltipPlacement,
      title: tooltip,
      children: /*#__PURE__*/_jsxs(UIButton, {
        className: classes,
        disabled: disabled,
        onClick: onClick,
        use: "unstyled",
        children: [children, this.renderLabel()]
      })
    });
  }
});