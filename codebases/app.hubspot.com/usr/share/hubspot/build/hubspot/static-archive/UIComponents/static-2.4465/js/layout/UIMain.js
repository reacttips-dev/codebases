'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
/**
 * Main body of the app. There should only be one per application.
 *
 * @category Layout
 */

export default function UIMain(_ref) {
  var className = _ref.className,
      children = _ref.children,
      flush = _ref.flush,
      use = _ref.use,
      other = _objectWithoutProperties(_ref, ["className", "children", "flush", "use"]);

  var classes = classNames('private-main', className, flush && 'private-main--flush', use === 'dark' && 'private-main--dark');
  return /*#__PURE__*/_jsx("main", Object.assign({}, other, {
    className: classes,
    children: children
  }));
}
UIMain.propTypes = {
  children: PropTypes.node.isRequired,
  flush: PropTypes.bool,
  use: PropTypes.oneOf(['standard', 'dark'])
};
UIMain.displayName = 'UIMain';