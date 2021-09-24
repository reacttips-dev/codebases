'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _dealPermissions, _ticketPermissions, _defaultPermissions;

import { Iterable, Set as ImmutableSet } from 'immutable';
import { DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { VIEW_ALL, VIEW_TEAM_OWNED, VIEW_UNASSIGNED } from 'customer-data-objects/constants/PermissionTypes';
/*
    Please cc @HubSpot/mobile-crm in PRs that change this file.
*/

var dealPermissions = (_dealPermissions = {}, _defineProperty(_dealPermissions, VIEW_ALL, 'crm-views-all-deals'), _defineProperty(_dealPermissions, VIEW_TEAM_OWNED, 'crm-views-team-owned-deals'), _defineProperty(_dealPermissions, VIEW_UNASSIGNED, 'crm-views-unassigned-deals'), _dealPermissions);
var ticketPermissions = (_ticketPermissions = {}, _defineProperty(_ticketPermissions, VIEW_ALL, 'crm-views-all-tickets'), _defineProperty(_ticketPermissions, VIEW_TEAM_OWNED, 'crm-views-team-owned-tickets'), _defineProperty(_ticketPermissions, VIEW_UNASSIGNED, 'crm-views-unassigned-tickets'), _ticketPermissions);
var defaultPermissions = (_defaultPermissions = {}, _defineProperty(_defaultPermissions, VIEW_ALL, 'crm-views-all'), _defineProperty(_defaultPermissions, VIEW_TEAM_OWNED, 'crm-views-team-owned'), _defineProperty(_defaultPermissions, VIEW_UNASSIGNED, 'crm-views-unassigned'), _defaultPermissions);
export var objectTypeToPermissions = function objectTypeToPermissions(objectType) {
  switch (objectType) {
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
export default function () {
  var ownerIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableSet();
  var teamIds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableSet();
  var scopes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var currentOwner = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var currentTeams = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  var hubspotOwnerId = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
  var objectType = arguments.length > 6 ? arguments[6] : undefined;

  // todo - remove backward compatibility of non-iterable ownerIds
  // https://git.hubteam.com/HubSpot/LiveMessagesUI/blob/78101ec4f7fca25a68b766b0519ef5c96c210836/MessagesApp/static/js/crm-integration/selectors/getCanViewCurrentContact.js#L10
  if (!Iterable.isIterable(ownerIds) && hubspotOwnerId === '') {
    hubspotOwnerId = ownerIds;
  }

  var allOwnerIds = Iterable.isIterable(ownerIds) && ownerIds || ImmutableSet.of(ownerIds);
  var isOwner = allOwnerIds.includes("" + currentOwner);

  if (isOwner) {
    return true;
  }

  if (scopes[objectTypeToPermissionsScope(objectType, VIEW_ALL)]) {
    return true;
  }

  if (scopes[objectTypeToPermissionsScope(objectType, VIEW_UNASSIGNED)] && !hubspotOwnerId) {
    return true;
  }

  if (teamIds.size && scopes[objectTypeToPermissionsScope(objectType, VIEW_TEAM_OWNED)]) {
    var isPartOfTeam = teamIds.intersect(currentTeams.map(function (id) {
      return "" + id;
    })).size;

    if (isPartOfTeam) {
      return true;
    }
  }

  return false;
}