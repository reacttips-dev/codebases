'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import UIAlert from './UIAlert';

var UIFloatingAlert = function UIFloatingAlert(props) {
  var children = props.children,
      className = props.className,
      closeable = props.closeable,
      rest = _objectWithoutProperties(props, ["children", "className", "closeable"]);

  return /*#__PURE__*/_jsx(UIAlert, Object.assign({}, rest, {
    className: classNames('private-floating-alert', className),
    closeable: closeable,
    children: children
  }));
};

UIFloatingAlert.propTypes = Object.assign({}, UIAlert.propTypes);
UIFloatingAlert.defaultProps = Object.assign({}, UIAlert.defaultProps, {
  closeable: true
});
UIFloatingAlert.displayName = 'UIFloatingAlert';
export default UIFloatingAlert;