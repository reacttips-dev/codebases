'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import EmptyState from 'customer-data-table/Components/EmptyState';
import FormattedDuration from 'I18n/components/FormattedDuration';
import I18n from 'I18n';
import PropTypes from 'prop-types';

var DurationCell = function DurationCell(_ref) {
  var value = _ref.value;
  var result = parseInt(value, 10); // This check handles null, undefined, and non-numeric strings

  if (isNaN(result)) {
    return /*#__PURE__*/_jsx(EmptyState, {});
  }

  return /*#__PURE__*/_jsx(FormattedDuration, {
    from: I18n.moment().valueOf() - result
  });
};

DurationCell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
export default DurationCell;