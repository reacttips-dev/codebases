'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _createExtension;

import { ActionsDropdown, Indexable, PrimaryActionButton, QuickFilterProperties, SecondaryActionButton } from '../constants/BehaviorTypes';
import { createExtension } from '../utils/createExtension';
var quickFilterPropertyNames = [];

var shouldShowInDropdown = function shouldShowInDropdown(_ref) {
  var hasAllGates = _ref.hasAllGates,
      hasAllScopes = _ref.hasAllScopes;
  return hasAllGates('crm-invoice-index') && hasAllScopes('accounting-extension-read');
};

var EmptyButton = function EmptyButton() {
  return null;
};

var actionsDropdownItems = [];
export var Invoice = createExtension((_createExtension = {}, _defineProperty(_createExtension, Indexable, shouldShowInDropdown), _defineProperty(_createExtension, QuickFilterProperties, function () {
  return quickFilterPropertyNames;
}), _defineProperty(_createExtension, PrimaryActionButton, function () {
  return EmptyButton;
}), _defineProperty(_createExtension, SecondaryActionButton, function () {
  return EmptyButton;
}), _defineProperty(_createExtension, ActionsDropdown, function () {
  return actionsDropdownItems;
}), _createExtension));