'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
export default function UIBreakString(_ref) {
  var children = _ref.children,
      className = _ref.className,
      hyphenate = _ref.hyphenate,
      rest = _objectWithoutProperties(_ref, ["children", "className", "hyphenate"]);

  return /*#__PURE__*/_jsx("span", Object.assign({}, rest, {
    className: classNames('private-break-string', className, hyphenate ? 'private-break-string--hyphenate' : 'private-break-string--no-hyphenate'),
    children: children
  }));
}
UIBreakString.propTypes = {
  children: PropTypes.node.isRequired,
  hyphenate: PropTypes.bool
};
UIBreakString.defaultProps = {
  hyphenate: true
};
UIBreakString.displayName = 'UIBreakString';