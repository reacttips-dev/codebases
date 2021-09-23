'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { OrderedSet } from 'immutable';

var IndexTableColumns = function IndexTableColumns(_ref) {
  var tableColumns = _ref.tableColumns,
      isModal = _ref.isModal;
  return /*#__PURE__*/_jsxs("colgroup", {
    children: [isModal ? null : /*#__PURE__*/_jsx("col", {
      style: {
        width: 70
      }
    }), tableColumns.map(function (_ref2) {
      var id = _ref2.id,
          width = _ref2.width;
      return /*#__PURE__*/_jsx("col", {
        style: {
          width: width
        }
      }, "sales-content-index-table-column-" + id);
    }).toList()]
  });
};

IndexTableColumns.propTypes = {
  tableColumns: PropTypes.instanceOf(OrderedSet).isRequired,
  isModal: PropTypes.bool.isRequired
};
export default IndexTableColumns;