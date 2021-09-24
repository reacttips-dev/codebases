'use es6';

import { number } from '../../utils/FormatNumber';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import I18n from 'I18n';
import { List, Record, Set as ImmutableSet } from 'immutable';
import { isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
import emptyFunction from 'react-utils/emptyFunction';
import getIn from 'transmute/getIn';
import pipe from 'transmute/pipe';
import isEmpty from 'transmute/isEmpty';
import { assign, del, edit } from '../permissions/bulkActionPermissions';
var defaultLabelOptions = {
  singular: false
};
export var getObjectTypeLabel = function getObjectTypeLabel(record, options) {
  var _defaultLabelOptions$ = Object.assign({}, defaultLabelOptions, {}, options),
      singular = _defaultLabelOptions$.singular;

  var objectType = record.get('objectType');
  var baseKey = singular ? 'genericTypes.singular' : 'genericTypes';
  var typeKey = objectType && !isObjectTypeId(objectType) ? objectType : 'items';
  return I18n.text(baseKey + "." + typeKey);
};
export var addObjectTypeLabel = function addObjectTypeLabel(record) {
  return record.set('objectTypeLabel', getObjectTypeLabel(record));
};
export var isSelectionGreaterThanView = function isSelectionGreaterThanView(record) {
  var allSelected = record.get('allSelected');
  var totalRecords = record.get('totalRecords');
  var selectionCount = record.get('selectionCount');
  var pageSize = record.get('pageSize'); // if nothing is selected or there are no records

  if (totalRecords === 0 && selectionCount === 0) {
    return false;
  } // if there are less records than the page size
  // we don't show the user the "select all" banner
  // we don't show the confirms in the bulk dialogs


  if (totalRecords <= pageSize) {
    return false;
  } // if the user clicked the select all button


  if (allSelected === true) {
    return true;
  }

  return selectionCount === totalRecords;
};
export var addIsAllSelected = function addIsAllSelected(record) {
  return record.set('isSelectionGreaterThanView', isSelectionGreaterThanView(record));
};
export var getFormattedSelectionCount = function getFormattedSelectionCount(record) {
  var selectionCount = record.get('selectionCount');
  return number(selectionCount);
};
export var addFormattedSelectionCount = function addFormattedSelectionCount(record) {
  return record.set('formattedSelectionCount', getFormattedSelectionCount(record));
};
export var addPermissions = function addPermissions(record) {
  var objectType = record.get('objectType');
  var objectTypeLabel = record.get('objectTypeLabel');
  var canBulkEditAll = record.get('canBulkEditAll');
  var canEdit = edit({
    canBulkEditAll: canBulkEditAll,
    objectType: objectType,
    objectTypeLabel: objectTypeLabel
  });
  var canAssign = assign({
    canBulkEditAll: canBulkEditAll,
    objectType: objectType,
    objectTypeLabel: objectTypeLabel
  });
  var canDelete = del({
    canBulkEditAll: canBulkEditAll,
    objectTypeLabel: objectTypeLabel
  });
  return record.set('canEdit', canEdit).set('canAssign', canAssign).set('canDelete', canDelete);
};
export var isEntirePageSelected = function isEntirePageSelected(record) {
  var selectionCount = record.get('selectionCount');
  var pageSize = record.get('pageSize');
  return selectionCount >= pageSize;
};
export var addIsEntirePageSelected = function addIsEntirePageSelected(record) {
  return record.set('isEntirePageSelected', isEntirePageSelected(record));
};
export var isFilterApplied = function isFilterApplied(record) {
  var filters = getIn(['query', 'filterGroups', 0, 'filters'])(record);
  return !isEmpty(filters);
};
export var addIsFilterApplied = function addIsFilterApplied(record) {
  return record.set('isFilterApplied', isFilterApplied(record));
};
export var addCalculatedValues = function addCalculatedValues(record) {
  return pipe(addObjectTypeLabel, addFormattedSelectionCount, addIsAllSelected, addPermissions, addIsEntirePageSelected, addIsFilterApplied)(record);
};
export var BulkActionPropsRecord = Record({
  allSelected: undefined,
  canAssign: undefined,
  canBulkEditAll: undefined,
  canDelete: undefined,
  canEdit: undefined,
  checked: ImmutableSet(),
  clearSelection: emptyFunction,
  doiEnabled: undefined,
  formattedSelectionCount: undefined,
  gdprEnabled: undefined,
  isSelectionGreaterThanView: undefined,
  isEntirePageSelected: undefined,
  isFilterApplied: undefined,
  listId: undefined,
  numEditable: undefined,
  objectType: undefined,
  objectTypeLabel: undefined,
  pageSize: undefined,
  query: '',
  selection: List(),
  selectionCount: 0,
  totalRecords: 0,
  view: ViewRecord(),
  viewId: 'all'
}, 'BulkActionPropsRecord');
export default BulkActionPropsRecord;