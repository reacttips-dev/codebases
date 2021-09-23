'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';

function UIButtonGroup(_ref) {
  var children = _ref.children,
      className = _ref.className,
      use = _ref.use,
      orientation = _ref.orientation,
      rest = _objectWithoutProperties(_ref, ["children", "className", "use", "orientation"]);

  var classes = classNames("UIButtonGroup private-button__group", className, use !== "default" && 'private-floating-button-group__buttons private-floating-button-group__buttons--standalone', {
    'horizontal': 'private-button__group--horizontal',
    'vertical': 'private-button__group--vertical'
  }[orientation]);
  return /*#__PURE__*/_jsx("div", Object.assign({}, rest, {
    className: classes,
    children: children
  }));
}

UIButtonGroup.propTypes = {
  children: PropTypes.node,
  use: PropTypes.oneOf(['default', 'floating']).isRequired,
  orientation: PropTypes.oneOf(['horizontal', 'vertical'])
};
UIButtonGroup.defaultProps = {
  use: 'default',
  orientation: 'horizontal'
};
UIButtonGroup.displayName = 'UIButtonGroup';
export default UIButtonGroup;