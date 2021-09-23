'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import EmptyState from 'customer-data-table/Components/EmptyState';
import FormattedNumber from 'I18n/components/FormattedNumber';
import PropTypes from 'prop-types';
import { memo } from 'react';
import isUndefined from 'transmute/isUndefined';

var NumberCell = function NumberCell(_ref) {
  var value = _ref.value;

  if (isUndefined(value) || value === '' || value === null) {
    return /*#__PURE__*/_jsx(EmptyState, {});
  }

  var result = value ? parseFloat(value) : 0;
  return /*#__PURE__*/_jsx("span", {
    className: "text-right width-100",
    children: /*#__PURE__*/_jsx(FormattedNumber, {
      value: result
    })
  });
};

NumberCell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
export default /*#__PURE__*/memo(NumberCell);