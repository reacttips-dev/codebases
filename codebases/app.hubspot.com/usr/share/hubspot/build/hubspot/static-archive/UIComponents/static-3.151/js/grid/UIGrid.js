'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';

function UIGrid(_ref) {
  var children = _ref.children,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, ["children", "className"]);

  return /*#__PURE__*/_jsx("div", Object.assign({}, props, {
    className: classNames('row', className),
    children: children
  }));
}

UIGrid.propTypes = {
  children: PropTypes.node.isRequired
};
UIGrid.displayName = 'UIGrid';
export default UIGrid;