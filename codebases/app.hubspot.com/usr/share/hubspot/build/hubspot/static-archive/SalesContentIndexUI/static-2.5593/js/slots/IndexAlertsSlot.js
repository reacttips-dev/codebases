'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';

var IndexAlertsSlot = function IndexAlertsSlot(_ref) {
  var children = _ref.children;

  if (children) {
    return /*#__PURE__*/_jsx("div", {
      children: children
    });
  }

  return /*#__PURE__*/_jsx("div", {});
};

IndexAlertsSlot.propTypes = {
  children: PropTypes.any
};
export default IndexAlertsSlot;