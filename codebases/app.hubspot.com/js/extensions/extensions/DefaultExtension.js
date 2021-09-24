'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";

var _DefaultExtension;

import { ActionsDropdown, Indexable, PrimaryActionButton, QuickFilterProperties, SecondaryActionButton } from '../constants/BehaviorTypes';
import EditPropertiesButton from '../../header/actions/EditPropertiesButton';
import RecycleBinButton from '../../header/actions/RecycleBinButton';
import { getIsRestorable } from '../../crmObjects/methods/getIsRestorable';
import CreateObjectButton from '../../header/actions/CreateObjectButton';
import ImportButton from '../../header/actions/ImportButton';
import { getPropertiesInTypeDef } from '../../crmObjects/methods/getPropertiesInTypeDef';
import { getIsPortalSpecific } from '../../crmObjects/methods/getIsPortalSpecific';
export var DefaultExtension = (_DefaultExtension = {}, _defineProperty(_DefaultExtension, ActionsDropdown, function (_ref) {
  var typeDef = _ref.typeDef;
  return [EditPropertiesButton].concat(_toConsumableArray(getIsRestorable(typeDef) ? [RecycleBinButton] : []));
}), _defineProperty(_DefaultExtension, Indexable, function (_ref2) {
  var typeDef = _ref2.typeDef,
      hasAllScopes = _ref2.hasAllScopes;
  return getIsPortalSpecific(typeDef) && hasAllScopes('custom-object-read');
}), _defineProperty(_DefaultExtension, PrimaryActionButton, function () {
  return CreateObjectButton;
}), _defineProperty(_DefaultExtension, SecondaryActionButton, function () {
  return ImportButton;
}), _defineProperty(_DefaultExtension, QuickFilterProperties, function (_ref3) {
  var typeDef = _ref3.typeDef;
  return getPropertiesInTypeDef(typeDef).toArray().slice(0, 4);
}), _DefaultExtension);