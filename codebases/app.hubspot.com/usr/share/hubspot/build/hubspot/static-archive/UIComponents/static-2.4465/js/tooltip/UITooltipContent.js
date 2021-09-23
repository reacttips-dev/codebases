'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
export default function UITooltipContent(_ref) {
  var className = _ref.className,
      children = _ref.children;
  return /*#__PURE__*/_jsx("div", {
    className: classNames('private-tooltip__inner', className),
    role: "tooltip",
    children: children
  });
}
UITooltipContent.propTypes = {
  children: PropTypes.node
};
UITooltipContent.displayName = 'UITooltipContent';