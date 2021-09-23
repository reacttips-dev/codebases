'use es6';

import ColumnRecord from './ColumnRecord';
import SelectCell from '../cells/SelectCell';
import SelectViewCell from '../cells/SelectViewCell';
import always from 'transmute/always';
var checkboxColumn = ColumnRecord({
  Cell: SelectCell,
  Header: SelectViewCell,
  accessor: always('table_select_accessor'),
  draggable: false,
  filterable: false,
  id: '_selector',
  order: -1,
  resizable: false,
  sortable: false,
  style: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0
  },
  width: 45
});
export default checkboxColumn;