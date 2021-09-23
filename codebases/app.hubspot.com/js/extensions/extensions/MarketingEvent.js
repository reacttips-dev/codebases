'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _createExtension;

import { ActionsDropdown, Indexable, PrimaryActionButton, QuickFilterProperties, SecondaryActionButton } from '../constants/BehaviorTypes';
import { createExtension } from '../utils/createExtension';
var quickFilterPropertyNames = [];

var shouldShowInDropdown = function shouldShowInDropdown(_ref) {
  var hasAllGates = _ref.hasAllGates;
  return hasAllGates('Cobject-Index-MarketingEvent');
};

var EmptyButton = function EmptyButton() {
  return null;
};

var getPrimaryButton = function getPrimaryButton(_ref2) {
  var hasAllGates = _ref2.hasAllGates,
      defaultValue = _ref2.defaultValue;

  if (hasAllGates('MarketingEventsv2')) {
    return defaultValue;
  }

  return EmptyButton;
};

var actionsDropdownItems = [];
export var MarketingEvent = createExtension((_createExtension = {}, _defineProperty(_createExtension, Indexable, shouldShowInDropdown), _defineProperty(_createExtension, QuickFilterProperties, function () {
  return quickFilterPropertyNames;
}), _defineProperty(_createExtension, PrimaryActionButton, getPrimaryButton), _defineProperty(_createExtension, SecondaryActionButton, function () {
  return EmptyButton;
}), _defineProperty(_createExtension, ActionsDropdown, function () {
  return actionsDropdownItems;
}), _createExtension));