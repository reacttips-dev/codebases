'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import H5 from '../elements/headings/H5';
import { ALERT_TYPES, ALERT_USES } from '../alert/AlertTypes';
import UICloseButton from '../button/UICloseButton';
export default function UIAlert(props) {
  var children = props.children,
      className = props.className,
      closeable = props.closeable,
      onClose = props.onClose,
      titleText = props.titleText,
      type = props.type,
      use = props.use,
      rest = _objectWithoutProperties(props, ["children", "className", "closeable", "onClose", "titleText", "type", "use"]);

  var computedClassName = classNames("alert private-alert", ALERT_TYPES[type], className, closeable && 'private-alert--dismissable alert-dismissable', use === 'inline' && 'private-alert--inline');
  return /*#__PURE__*/_jsxs("div", Object.assign({}, rest, {
    "aria-atomic": true,
    "aria-live": "polite",
    className: computedClassName,
    role: "alert",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "private-alert__inner",
      children: [titleText && /*#__PURE__*/_jsx(H5, {
        className: "private-alert__title",
        children: titleText
      }), /*#__PURE__*/_jsx("div", {
        className: "private-alert__body has--vertical-spacing",
        children: children
      })]
    }), closeable && /*#__PURE__*/_jsx(UICloseButton, {
      "aria-hidden": true,
      className: "close private-alert__close",
      onClick: onClose,
      size: "md"
    })]
  }));
}
UIAlert.displayName = 'UIAlert';
UIAlert.propTypes = {
  children: PropTypes.node,
  closeable: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  titleText: PropTypes.node,
  type: PropTypes.oneOf(Object.keys(ALERT_TYPES)).isRequired,
  use: PropTypes.oneOf(Object.keys(ALERT_USES)).isRequired
};
UIAlert.defaultProps = {
  closeable: false,
  type: 'info',
  use: 'default'
};