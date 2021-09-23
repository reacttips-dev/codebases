'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import EmptyState from '../Components/EmptyState';
import PropTypes from 'prop-types';
import { memo } from 'react';
import classNames from 'classnames';

var StringCell = function StringCell(_ref) {
  var value = _ref.value,
      className = _ref.className;
  if (!value) return /*#__PURE__*/_jsx(EmptyState, {});
  var classes = classNames('text-left truncate-text', className);
  return /*#__PURE__*/_jsx("span", {
    className: classes,
    title: value,
    children: value
  });
};

StringCell.propTypes = {
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.node, PropTypes.number, PropTypes.string])
};
export default /*#__PURE__*/memo(StringCell);