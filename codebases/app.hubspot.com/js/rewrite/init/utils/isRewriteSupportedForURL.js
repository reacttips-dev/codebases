'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _REWRITE_SUPPORTED_HU;

import withGateOverride from 'crm_data/gates/withGateOverride';
import { DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { isMigratedObjectTypeId } from './isMigratedObjectTypeId';
import { parseObjectTypeIdFromPath } from './parseObjectTypeIdFromPath';
export var REWRITE_SUPPORTED_HUBSPOT_OBJECT_TYPES = (_REWRITE_SUPPORTED_HU = {}, _defineProperty(_REWRITE_SUPPORTED_HU, DEAL_TYPE_ID, {
  sessionStorageOverrideKey: 'DO_NOT_USE_OR_DEVON_WILL_BE_FIRED_OVERRIDE_DEALS_REWRITE',
  gate: 'CRM:Datasets:DealsRewrite'
}), _defineProperty(_REWRITE_SUPPORTED_HU, TICKET_TYPE_ID, {
  sessionStorageOverrideKey: 'DO_NOT_USE_OR_DEVON_WILL_BE_FIRED_OVERRIDE_TICKETS_REWRITE',
  gate: 'CRM:Datasets:TicketsRewrite'
}), _REWRITE_SUPPORTED_HU);

var defaultGetFromSessionStorage = function defaultGetFromSessionStorage(key) {
  try {
    return sessionStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

export var isRewriteSupported = function isRewriteSupported(_ref) {
  var objectTypeId = _ref.objectTypeId,
      gates = _ref.gates,
      _ref$getFromSessionSt = _ref.getFromSessionStorage,
      getFromSessionStorage = _ref$getFromSessionSt === void 0 ? defaultGetFromSessionStorage : _ref$getFromSessionSt;
  var objectConfig = REWRITE_SUPPORTED_HUBSPOT_OBJECT_TYPES[objectTypeId]; // If an object type has been migrated or we don't have a config for it, assume it uses the rewrite.

  if (isMigratedObjectTypeId(objectTypeId) || !objectConfig) {
    return true;
  }

  var gate = objectConfig.gate,
      sessionStorageOverrideKey = objectConfig.sessionStorageOverrideKey; // HACK: This is only for ATs, where we sometimes cannot rely on the ?gated/?ungated URL params.
  // Please prefer those over this functionality!

  var sessionStorageOverrideType = sessionStorageOverrideKey && getFromSessionStorage(sessionStorageOverrideKey);

  if (sessionStorageOverrideType) {
    return sessionStorageOverrideType === 'ENABLED';
  }

  return withGateOverride(gate, gates.includes(gate));
}; // If you touch these expressions, please go update the corresponding expr in the
// parseObjectTypeFromPathname utility! This will ensure that we quick-fetch the right
// data for the rewrite. That utility lives here:
// https://git.hubteam.com/HubSpot/CRM/blob/master/crm-index-ui/static/js/quick-fetch/parseObjectTypeFromPathname.js

export var isRewriteSupportedForURL = function isRewriteSupportedForURL(_ref2) {
  var path = _ref2.path,
      gates = _ref2.gates,
      getFromSessionStorage = _ref2.getFromSessionStorage;
  var objectTypeId = parseObjectTypeIdFromPath(path);
  return isRewriteSupported({
    objectTypeId: objectTypeId,
    gates: gates,
    getFromSessionStorage: getFromSessionStorage
  });
};