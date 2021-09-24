'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
import { DEAL } from 'customer-data-objects/constants/ObjectTypes';
import * as Deals from './priorityFilters/deals';
import * as PriorityFiltersProtocol from './priorityFilters/protocol';

var clients = _defineProperty({}, DEAL, Deals);

var isUngated = function isUngated() {
  return IsUngatedStore.get('CRM:BoardPrioritization:Deals');
};

var getImplementationFor = function getImplementationFor(objectType) {
  return isUngated() && clients[objectType] ? clients[objectType] : PriorityFiltersProtocol;
};

export var getDefaults = function getDefaults(objectType) {
  return getImplementationFor(objectType).getDefaults(objectType);
};
export var getFavorites = function getFavorites(objectType) {
  return getImplementationFor(objectType).getFavorites(objectType);
};
export var isPriorityFilter = function isPriorityFilter(objectType, view) {
  return getImplementationFor(objectType).isPriorityFilter(objectType, view);
};