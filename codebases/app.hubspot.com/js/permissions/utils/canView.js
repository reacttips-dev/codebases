'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _defaultPermissions;

import { Iterable, Set as ImmutableSet } from 'immutable';
import { VIEW_ALL, VIEW_TEAM_OWNED, VIEW_UNASSIGNED } from 'customer-data-objects/constants/PermissionTypes';
import get from 'transmute/get';
/*
    Please cc @HubSpot/mobile-crm in PRs that change this file.
*/

export var defaultPermissions = (_defaultPermissions = {}, _defineProperty(_defaultPermissions, VIEW_ALL, 'crm-views-all'), _defineProperty(_defaultPermissions, VIEW_TEAM_OWNED, 'crm-views-team-owned'), _defineProperty(_defaultPermissions, VIEW_UNASSIGNED, 'crm-views-unassigned'), _defaultPermissions);
export default function (_ref) {
  var _ref$ownerIds = _ref.ownerIds,
      ownerIds = _ref$ownerIds === void 0 ? ImmutableSet() : _ref$ownerIds,
      _ref$teamIds = _ref.teamIds,
      teamIds = _ref$teamIds === void 0 ? ImmutableSet() : _ref$teamIds,
      _ref$currentScopes = _ref.currentScopes,
      currentScopes = _ref$currentScopes === void 0 ? [] : _ref$currentScopes,
      _ref$currentOwner = _ref.currentOwner,
      currentOwner = _ref$currentOwner === void 0 ? '' : _ref$currentOwner,
      _ref$currentTeams = _ref.currentTeams,
      currentTeams = _ref$currentTeams === void 0 ? [] : _ref$currentTeams,
      _ref$hubspotOwnerId = _ref.hubspotOwnerId,
      hubspotOwnerId = _ref$hubspotOwnerId === void 0 ? '' : _ref$hubspotOwnerId;

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

  if (currentScopes.includes(defaultPermissions[VIEW_ALL])) {
    return true;
  }

  if (currentScopes.includes(defaultPermissions[VIEW_UNASSIGNED]) && !hubspotOwnerId) {
    return true;
  }

  if (teamIds.size && currentScopes.includes(defaultPermissions[VIEW_TEAM_OWNED])) {
    var isPartOfTeam = teamIds.intersect(currentTeams.map(function (team) {
      return team && "" + get('id', team);
    })).size;

    if (isPartOfTeam) {
      return true;
    }
  }

  return false;
}