'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _BULK_ACTIONS, _MORE_DROPDOWN;

import BulkActions from '../../crm_ui/grid/cells/header/bulkActions/BulkActions';
import { COMPANY, CONTACT, DEAL, TASK, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { isObjectTypeId, INVOICE_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
var BULK_ACTIONS = (_BULK_ACTIONS = {}, _defineProperty(_BULK_ACTIONS, COMPANY, [BulkActions.assign, BulkActions.betAssign, BulkActions.betRecycle, BulkActions.edit, BulkActions.bulkDelete, BulkActions.createTasks, BulkActions.addToObjectList]), _defineProperty(_BULK_ACTIONS, CONTACT, [BulkActions.assign, BulkActions.betAssign, BulkActions.betRecycle, BulkActions.edit, BulkActions.bulkDelete, BulkActions.createTasks, BulkActions.enrollInSequence]), _defineProperty(_BULK_ACTIONS, DEAL, [BulkActions.assign, BulkActions.edit, BulkActions.bulkDelete, BulkActions.createTasks]), _defineProperty(_BULK_ACTIONS, TASK, [BulkActions.edit, BulkActions.bulkDelete]), _defineProperty(_BULK_ACTIONS, TICKET, [BulkActions.assign, BulkActions.edit, BulkActions.bulkDelete, BulkActions.createTasks]), _BULK_ACTIONS);

var BULK_ACTIONS_BY_TYPE_ID = _defineProperty({}, INVOICE_TYPE_ID, [BulkActions.bulkDelete]);

export var getBulkActionsByType = function getBulkActionsByType(objectType) {
  if (isObjectTypeId(objectType)) {
    return BULK_ACTIONS_BY_TYPE_ID[objectType] || [BulkActions.edit, BulkActions.bulkDelete];
  }

  return BULK_ACTIONS[objectType];
};
var MORE_DROPDOWN = (_MORE_DROPDOWN = {}, _defineProperty(_MORE_DROPDOWN, CONTACT, [BulkActions.addToList, BulkActions.enrollInWorkflow, BulkActions.addGDPRLawfulBasisToProcess, BulkActions.addGDPRSubscription, BulkActions.updateDoubleOptIn, BulkActions.sendSurveyMonkeySurvey, BulkActions.setMarketable, BulkActions.setNonMarketable]), _defineProperty(_MORE_DROPDOWN, DEAL, [BulkActions.moveToClosedLost]), _MORE_DROPDOWN);
export var getMoreDropdownActionsByType = function getMoreDropdownActionsByType(objectType) {
  if (isObjectTypeId(objectType)) {
    return null;
  }

  return MORE_DROPDOWN[objectType];
};