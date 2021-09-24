'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
export default function UIDialogHeader(_ref) {
  var children = _ref.children,
      className = _ref.className,
      use = _ref.use,
      rest = _objectWithoutProperties(_ref, ["children", "className", "use"]);

  return /*#__PURE__*/_jsx("header", Object.assign({}, rest, {
    className: classNames("private-modal__header uiDialogHeader", className, use === 'toolbar' && 'private-modal__header--with-toolbar'),
    children: /*#__PURE__*/_jsx("div", {
      className: "private-modal__header__inner",
      children: children
    })
  }));
}
UIDialogHeader.propTypes = {
  children: PropTypes.node,
  use: PropTypes.oneOf(['default', 'toolbar'])
};
UIDialogHeader.displayName = 'UIDialogHeader';