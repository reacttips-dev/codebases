'use es6';

import { addWidthToColumns, mergeColumns, prependColumn, removeColumns, reorderColumns, updateColumns } from 'customer-data-table/tableFunctions';
export var TABLE_ACTIONS = {
  ADD_WIDTHS: 'widths',
  INITIALIZE: 'initialize',
  MERGE: 'merge',
  PREPEND: 'prepend',
  REMOVE: 'remove',
  REORDER: 'reorder',
  REPLACE: 'replace',
  UPDATE: 'update'
};
export function initializeColumns(state, value) {
  if (!value) {
    return state;
  }

  var columns = value.columns,
      labelColumn = value.labelColumn,
      widths = value.widths,
      minColumnWidth = value.minColumnWidth;
  return addWidthToColumns(prependColumn(updateColumns(state, columns), labelColumn), widths, minColumnWidth);
}
export var tableReducer = function tableReducer(state, action) {
  switch (action.type) {
    case TABLE_ACTIONS.INITIALIZE:
      return initializeColumns(state, action.value);

    case TABLE_ACTIONS.MERGE:
      return mergeColumns(state, action.value);

    case TABLE_ACTIONS.ADD_WIDTHS:
      return addWidthToColumns(state, action.value);

    case TABLE_ACTIONS.PREPEND:
      return prependColumn(state, action.value);

    case TABLE_ACTIONS.REMOVE:
      return removeColumns(state, action.value);

    case TABLE_ACTIONS.REPLACE:
      return action.value;

    case TABLE_ACTIONS.REORDER:
      return reorderColumns(state, action.value);

    case TABLE_ACTIONS.UPDATE:
      return updateColumns(state, action.value);

    default:
      return state;
  }
};