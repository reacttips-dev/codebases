'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { DEFAULT_COLUMN_MIN_RESIZE_WIDTH, DEFAULT_COLUMN_MIN_WIDTH, DEFAULT_COLUMN_WIDTH } from 'customer-data-table/constants/ColumnConstants';
import { Record } from 'immutable';
import StringCell from '../cells/StringCell';
import always from 'transmute/always';
var ColumnRecord = Record({
  Cell: function Cell(_ref) {
    var value = _ref.value,
        className = _ref.className;
    return /*#__PURE__*/_jsx(StringCell, {
      className: className,
      value: value
    });
  },
  associationDefinition: undefined,
  Header: undefined,
  accessor: always('--'),
  draggable: true,
  filterable: false,
  id: 'unknown',
  minResizeWidth: DEFAULT_COLUMN_MIN_RESIZE_WIDTH,
  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  order: null,
  resizable: true,
  sortable: true,
  style: null,
  width: DEFAULT_COLUMN_WIDTH
}, 'ColumnRecord');
export default ColumnRecord;