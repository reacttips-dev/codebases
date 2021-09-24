'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _defaultPermissions;

import canView from './canView';
import { Iterable, Set as ImmutableSet } from 'immutable';
import get from 'transmute/get';
import { EDIT_ALL, EDIT_TEAM_OWNED, EDIT_UNASSIGNED, EDIT_OWNED_ONLY } from 'customer-data-objects/constants/PermissionTypes';
/*
  Please cc @HubSpot/mobile-crm in PRs that change this file.
*/
// Contact & Companies - the only objects used for calling

export var defaultPermissions = (_defaultPermissions = {}, _defineProperty(_defaultPermissions, EDIT_ALL, 'crm-edit-all'), _defineProperty(_defaultPermissions, EDIT_TEAM_OWNED, 'crm-edit-team-owned'), _defineProperty(_defaultPermissions, EDIT_UNASSIGNED, 'crm-edit-unassigned'), _defineProperty(_defaultPermissions, EDIT_OWNED_ONLY, 'contacts-write'), _defineProperty(_defaultPermissions, "EDIT_OWNED_ONLY_NEW", 'contacts-edit-owner-owned'), _defaultPermissions);
export var hasSomeEditScopes = function hasSomeEditScopes(scopes) {
  return scopes[defaultPermissions[EDIT_ALL]] || scopes[defaultPermissions[EDIT_TEAM_OWNED]] || scopes[defaultPermissions[EDIT_UNASSIGNED]] || // https://git.hubteam.com/HubSpot/CRM-Issues/issues/2837
  scopes[defaultPermissions['EDIT_OWNED_ONLY_NEW']];
};
export function _ownerIdsToStrings(ownerIds) {
  return ownerIds.map(function (ownerId) {
    return String(ownerId);
  });
}
export default function (_ref) {
  var _ref$ownerIds = _ref.ownerIds,
      ownerIds = _ref$ownerIds === void 0 ? ImmutableSet() : _ref$ownerIds,
      _ref$teamIds = _ref.teamIds,
      teamIds = _ref$teamIds === void 0 ? ImmutableSet() : _ref$teamIds,
      _ref$hubspotOwnerId = _ref.hubspotOwnerId,
      hubspotOwnerId = _ref$hubspotOwnerId === void 0 ? '' : _ref$hubspotOwnerId,
      _ref$currentScopes = _ref.currentScopes,
      currentScopes = _ref$currentScopes === void 0 ? [] : _ref$currentScopes,
      _ref$currentTeams = _ref.currentTeams,
      currentTeams = _ref$currentTeams === void 0 ? [] : _ref$currentTeams,
      _ref$currentOwner = _ref.currentOwner,
      currentOwner = _ref$currentOwner === void 0 ? '' : _ref$currentOwner;

  // todo - remove backward compatibility of non-iterable ownerIds
  // https://git.hubteam.com/HubSpot/LiveMessagesUI/blob/78101ec4f7fca25a68b766b0519ef5c96c210836/MessagesApp/static/js/crm-integration/selectors/getCanViewCurrentContact.js#L10
  if (!Iterable.isIterable(ownerIds) && hubspotOwnerId === '') {
    hubspotOwnerId = ownerIds;
  }

  var allOwnerIds = _ownerIdsToStrings(Iterable.isIterable(ownerIds) && ownerIds || ImmutableSet.of(ownerIds));

  var isOwner = allOwnerIds.includes("" + currentOwner);

  if (isOwner) {
    return true;
  }

  if (teamIds.size && currentScopes.includes(defaultPermissions[EDIT_TEAM_OWNED])) {
    var isPartOfTeam = teamIds.intersect(currentTeams.map(function (team) {
      return team && "" + get('id', team);
    })).size;

    if (isPartOfTeam) {
      return true;
    }
  }

  if (!canView({
    ownerIds: ownerIds,
    teamIds: teamIds,
    currentScopes: currentScopes,
    currentOwner: currentOwner,
    currentTeams: currentTeams,
    hubspotOwnerId: hubspotOwnerId
  })) {
    return false;
  }

  if (currentScopes.includes(defaultPermissions[EDIT_ALL])) {
    return true;
  }

  if (currentScopes.includes(defaultPermissions[EDIT_UNASSIGNED]) && !hubspotOwnerId) {
    return true;
  }

  return isOwner;
}