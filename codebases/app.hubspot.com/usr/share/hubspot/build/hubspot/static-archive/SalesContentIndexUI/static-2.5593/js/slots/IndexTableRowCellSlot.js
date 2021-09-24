'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';

var IndexTableRowCellSlot = function IndexTableRowCellSlot(_ref) {
  var children = _ref.children,
      className = _ref.className;

  if (children) {
    return /*#__PURE__*/_jsx("td", {
      className: className,
      children: children
    });
  }

  return /*#__PURE__*/_jsx("td", {});
};

IndexTableRowCellSlot.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string
};
IndexTableRowCellSlot.defaultProps = {
  className: ''
};
export default IndexTableRowCellSlot;