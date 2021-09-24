'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _dealPermissions, _ticketPermissions, _defaultPermissions;

import canView from './canView';
import { Iterable, Set as ImmutableSet } from 'immutable';
import { DEAL, QUOTE, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { EDIT_ALL, EDIT_TEAM_OWNED, EDIT_UNASSIGNED, EDIT_OWNED_ONLY } from 'customer-data-objects/constants/PermissionTypes';
/*
  Please cc @HubSpot/mobile-crm in PRs that change this file.
*/

var dealPermissions = (_dealPermissions = {}, _defineProperty(_dealPermissions, EDIT_ALL, 'crm-edit-all-deals'), _defineProperty(_dealPermissions, EDIT_TEAM_OWNED, 'crm-edit-team-owned-deals'), _defineProperty(_dealPermissions, EDIT_UNASSIGNED, 'crm-edit-unassigned-deals'), _defineProperty(_dealPermissions, EDIT_OWNED_ONLY, 'crm-edit-owned-deals'), _dealPermissions);
var ticketPermissions = (_ticketPermissions = {}, _defineProperty(_ticketPermissions, EDIT_ALL, 'crm-edit-all-tickets'), _defineProperty(_ticketPermissions, EDIT_TEAM_OWNED, 'crm-edit-team-owned-tickets'), _defineProperty(_ticketPermissions, EDIT_UNASSIGNED, 'crm-edit-unassigned-tickets'), _defineProperty(_ticketPermissions, EDIT_OWNED_ONLY, 'crm-edit-owned-tickets'), _ticketPermissions); // Contact & Companies

var defaultPermissions = (_defaultPermissions = {}, _defineProperty(_defaultPermissions, EDIT_ALL, 'crm-edit-all'), _defineProperty(_defaultPermissions, EDIT_TEAM_OWNED, 'crm-edit-team-owned'), _defineProperty(_defaultPermissions, EDIT_UNASSIGNED, 'crm-edit-unassigned'), _defineProperty(_defaultPermissions, EDIT_OWNED_ONLY, 'contacts-edit-owner-owned'), _defaultPermissions);
export var objectTypeToPermissions = function objectTypeToPermissions(objectType) {
  switch (objectType) {
    // Quote permissions work exactly the same as deals for now, because quotes must have an associated deal and derive their edit / view permission from the deal they're associated to
    case QUOTE:
    case DEAL:
      return dealPermissions;

    case TICKET:
      return ticketPermissions;

    default:
      return defaultPermissions;
  }
};
export var objectTypeToPermissionsScope = function objectTypeToPermissionsScope(objectType, scope) {
  return objectTypeToPermissions(objectType)[scope];
};
export var hasSomeEditScopes = function hasSomeEditScopes(scopes, objectType) {
  return scopes[objectTypeToPermissionsScope(objectType, EDIT_ALL)] || scopes[objectTypeToPermissionsScope(objectType, EDIT_TEAM_OWNED)] || scopes[objectTypeToPermissionsScope(objectType, EDIT_UNASSIGNED)] || // https://git.hubteam.com/HubSpot/CRM-Issues/issues/2837
  scopes[objectTypeToPermissionsScope(objectType, EDIT_OWNED_ONLY)];
};
export function _ownerIdsToStrings(ownerIds) {
  return ownerIds.map(function (ownerId) {
    return String(ownerId);
  });
}
export default function canEdit() {
  var ownerIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableSet();
  var teamIds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableSet();
  var scopes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var currentOwner = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var currentTeams = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  var hubspotOwnerId = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
  var objectType = arguments.length > 6 ? arguments[6] : undefined;

  if (!scopes[objectTypeToPermissionsScope(objectType, EDIT_OWNED_ONLY)]) {
    return false;
  } // todo - remove backward compatibility of non-iterable ownerIds
  // https://git.hubteam.com/HubSpot/LiveMessagesUI/blob/78101ec4f7fca25a68b766b0519ef5c96c210836/MessagesApp/static/js/crm-integration/selectors/getCanViewCurrentContact.js#L10


  if (!Iterable.isIterable(ownerIds) && hubspotOwnerId === '') {
    hubspotOwnerId = ownerIds;
  }

  var allOwnerIds = _ownerIdsToStrings(Iterable.isIterable(ownerIds) && ownerIds || ImmutableSet.of(ownerIds));

  var isOwner = allOwnerIds.includes("" + currentOwner);

  if (isOwner) {
    return true;
  }

  if (teamIds.size && scopes[objectTypeToPermissionsScope(objectType, EDIT_TEAM_OWNED)]) {
    var isPartOfTeam = teamIds.intersect(currentTeams.map(function (id) {
      return "" + id;
    })).size;

    if (isPartOfTeam) {
      return true;
    }
  }

  if (!canView(ownerIds, teamIds, scopes, currentOwner, currentTeams, hubspotOwnerId, objectType)) {
    return false;
  }

  if (scopes[objectTypeToPermissionsScope(objectType, EDIT_ALL)]) {
    return true;
  }

  if (scopes[objectTypeToPermissionsScope(objectType, EDIT_UNASSIGNED)] && !hubspotOwnerId) {
    return true;
  }

  return isOwner;
}