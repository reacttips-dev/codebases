'use es6';

var SELECTION_ADD = 'SELECTION_ADD';
var SELECTION_CLEAR = 'SELECTION_CLEAR';
var SELECTION_REMOVE = 'SELECTION_REMOVE';
export var selectionActions = {
  SELECTION_ADD: SELECTION_ADD,
  SELECTION_CLEAR: SELECTION_CLEAR,
  SELECTION_REMOVE: SELECTION_REMOVE
};
export var addSelection = function addSelection(ids) {
  return {
    ids: ids,
    type: selectionActions.SELECTION_ADD
  };
};
export var clearSelection = function clearSelection() {
  return {
    type: selectionActions.SELECTION_CLEAR
  };
};
export var removeSelection = function removeSelection(ids) {
  return {
    ids: ids,
    type: selectionActions.SELECTION_REMOVE
  };
};