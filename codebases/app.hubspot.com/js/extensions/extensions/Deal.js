'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _createExtension;

import { Indexable, QuickFilterProperties } from '../constants/BehaviorTypes';
import { createExtension } from '../utils/createExtension';
var quickFilterPropertyNames = ['hubspot_owner_id', 'createdate', 'notes_last_updated', 'amount'];

var shouldShowInDropdown = function shouldShowInDropdown(_ref) {
  var hasAllScopes = _ref.hasAllScopes;
  return hasAllScopes('sales-deals-access');
};

export var Deal = createExtension((_createExtension = {}, _defineProperty(_createExtension, Indexable, shouldShowInDropdown), _defineProperty(_createExtension, QuickFilterProperties, function () {
  return quickFilterPropertyNames;
}), _createExtension));