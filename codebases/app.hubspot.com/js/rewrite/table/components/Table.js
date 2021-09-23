'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import LegacyDataTable from './LegacyDataTable';

var Table = function Table(_ref) {
  var data = _ref.data,
      loading = _ref.loading,
      error = _ref.error;
  return /*#__PURE__*/_jsx(LegacyDataTable, {
    data: data,
    loading: loading,
    error: error
  });
};

Table.propTypes = {
  data: PropTypes.shape({
    total: PropTypes.number.isRequired,
    results: PropTypes.array.isRequired
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.shape({
    status: PropTypes.number.isRequired,
    responseJSON: PropTypes.object.isRequired
  })
};
export default Table;