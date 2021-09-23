'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import UITooltip from '../tooltip/UITooltip';
import UIIcon from './UIIcon';
import { EERIE, OLAF } from 'HubStyleTokens/colors';
import passthroughProps from '../utils/propTypes/passthroughProps';
import { notRequired } from '../utils/propTypes/decorators';
var USE_DARK = 'on-dark';
var USE_DEFAULT = 'default';
export default function UIHelpIcon(props) {
  var use = props.use,
      tooltipPlacement = props.tooltipPlacement,
      tooltipProps = props.tooltipProps,
      title = props.title,
      className = props.className,
      style = props.style,
      children = props.children,
      rest = _objectWithoutProperties(props, ["use", "tooltipPlacement", "tooltipProps", "title", "className", "style", "children"]);

  var iconColor = use === USE_DARK ? OLAF : EERIE;
  var classes = classNames('private-help-icon', className, children && 'private-help-icon--inline');
  return /*#__PURE__*/_jsxs("span", {
    className: classes,
    style: style,
    children: [children, /*#__PURE__*/_jsx(UITooltip, Object.assign({}, tooltipProps, {
      placement: tooltipPlacement,
      title: title,
      children: /*#__PURE__*/_jsx(UIIcon, Object.assign({
        className: "private-help-icon__icon",
        name: "info",
        color: iconColor
      }, rest))
    }))]
  });
}
UIHelpIcon.defaultProps = {
  use: USE_DEFAULT
};
UIHelpIcon.propTypes = {
  size: UIIcon.propTypes.size,
  color: UIIcon.propTypes.color,
  use: PropTypes.oneOf([USE_DARK, USE_DEFAULT]),
  tooltipPlacement: notRequired(UITooltip.propTypes.placement),
  tooltipProps: passthroughProps(UITooltip),
  title: PropTypes.node.isRequired,
  children: PropTypes.node
};
UIHelpIcon.displayName = 'UIHelpIcon';