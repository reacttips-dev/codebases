'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _createExtension;

import { Indexable, QuickFilterProperties } from '../constants/BehaviorTypes';
import { createExtension } from '../utils/createExtension';
var quickFilterPropertyNames = ['hubspot_owner_id', 'createdate', 'hs_lastactivitydate', 'hs_ticket_priority'];

var shouldShowInDropdown = function shouldShowInDropdown(_ref) {
  var hasAllScopes = _ref.hasAllScopes;
  return hasAllScopes('tickets-access');
};

export var Ticket = createExtension((_createExtension = {}, _defineProperty(_createExtension, Indexable, shouldShowInDropdown), _defineProperty(_createExtension, QuickFilterProperties, function () {
  return quickFilterPropertyNames;
}), _createExtension));