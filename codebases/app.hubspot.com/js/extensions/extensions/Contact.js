'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _createExtension;

import EditPropertiesButton from '../../header/actions/EditPropertiesButton';
import RecycleBinButton from '../../header/actions/RecycleBinButton';
import ManageDuplicatesButton from '../../header/actions/ManageDuplicatesButton';
import DataQualityButton from '../../header/actions/DataQualityButton';
import { ActionsDropdown, Indexable, QuickFilterProperties } from '../constants/BehaviorTypes';
import { createExtension } from '../utils/createExtension';
var quickFilterPropertyNames = ['hubspot_owner_id', 'createdate', 'notes_last_updated', 'hs_lead_status'];
var actionsDropdownEntries = [EditPropertiesButton, ManageDuplicatesButton, DataQualityButton, RecycleBinButton];
export var Contact = createExtension((_createExtension = {}, _defineProperty(_createExtension, Indexable, function () {
  return true;
}), _defineProperty(_createExtension, QuickFilterProperties, function () {
  return quickFilterPropertyNames;
}), _defineProperty(_createExtension, ActionsDropdown, function () {
  return actionsDropdownEntries;
}), _createExtension));