'use es6';

import I18n from 'I18n';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import { isSucceeded } from 'conversations-async-data/async-data/operators/statusComparators';
import { Iterable, Map as ImmutableMap } from 'immutable';
import invariant from 'react-utils/invariant';
import canEdit from '../utils/canEdit';
import { createSelector } from 'reselect';
import { getScopesFromState, getTeamsFromState } from '../../Auth/selectors/authSelectors';
import { getOwnerIdFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { Set as ImmutableSet } from 'immutable';
import { getPropertiesByCalleeFromState } from '../../callee-properties/selectors/getCalleeProperties';

function permissionsCanEdit(_ref) {
  var permissionRelatedProperties = _ref.permissionRelatedProperties,
      currentScopes = _ref.currentScopes,
      currentOwner = _ref.currentOwner,
      currentTeams = _ref.currentTeams;
  invariant(Iterable.isIterable(permissionRelatedProperties.ownerIds), "canEdit: expected ownerIds to be a Set but got %s");
  invariant(Iterable.isIterable(permissionRelatedProperties.teamIds), "canEdit: expected teamIds to be a Set but got %s");
  return canEdit({
    ownerIds: permissionRelatedProperties.ownerIds,
    teamIds: permissionRelatedProperties.teamIds,
    hubspotOwnerId: permissionRelatedProperties.hubspotOwnerId,
    currentScopes: currentScopes,
    currentTeams: currentTeams,
    currentOwner: currentOwner
  });
}

var getPermissionRelatedProperties = function getPermissionRelatedProperties(calleePropertiesData) {
  var hubspotOwnerId = getProperty(calleePropertiesData, 'hubspot_owner_id');
  var allOwnerIds = getProperty(calleePropertiesData, 'hs_all_owner_ids');
  var teamId = getProperty(calleePropertiesData, 'hubspot_team_id');
  var allTeamIds = getProperty(calleePropertiesData, 'hs_all_team_ids');
  var allAccessibleTeamIds = getProperty(calleePropertiesData, 'hs_all_accessible_team_ids');
  var teamIds = ImmutableSet();
  var ownerIds = ImmutableSet();

  if (hubspotOwnerId) {
    ownerIds = ownerIds.add(hubspotOwnerId);
  }

  if (allOwnerIds) {
    ownerIds = ownerIds.union(allOwnerIds.split(';'));
  }

  if (teamId) {
    teamIds = teamIds.add(teamId);
  }

  if (allTeamIds) {
    teamIds = teamIds.union(allTeamIds.split(';'));
  }

  if (allAccessibleTeamIds) {
    teamIds = teamIds.union(allAccessibleTeamIds.split(';'));
  }

  return {
    hubspotOwnerId: hubspotOwnerId,
    ownerIds: ownerIds,
    teamIds: teamIds
  };
}; // newly created records don't have all the properties necessary
// to determine permissions
// use case: Create a contact -> immediately get redirected to record


var getIsNewlyCreated = function getIsNewlyCreated(calleePropertiesData) {
  var createDate = getProperty(calleePropertiesData, 'createdate');
  var teamIds = getProperty(calleePropertiesData, 'hubspot_team_id');

  if (!createDate) {
    return true;
  } else if (createDate && !teamIds) {
    var now = I18n.moment();
    var created = I18n.moment(parseInt(createDate, 10));
    var createdRecently = now.diff(created, 'seconds') < 15;

    if (createdRecently) {
      return true;
    }
  }

  return false;
};

export var editPermissionsResultsFromState = createSelector([getPropertiesByCalleeFromState, getScopesFromState, getOwnerIdFromState, getTeamsFromState], function (calleePropertyEntries, currentScopes, currentOwner, currentTeams) {
  return calleePropertyEntries.reduce(function (acc, calleeProperties, index) {
    var calleePropertiesData = getData(calleeProperties);
    var succeeded = isSucceeded(calleeProperties);
    var permissions;

    if (!succeeded) {
      permissions = ImmutableMap({
        isLoading: true,
        canEdit: false
      });
    } else if (!calleePropertiesData) {
      permissions = ImmutableMap({
        isLoading: false,
        canEdit: false
      });
    } else if (getIsNewlyCreated(calleePropertiesData)) {
      permissions = ImmutableMap({
        isLoading: false,
        canEdit: true
      });
    } else {
      permissions = ImmutableMap({
        isLoading: false,
        canEdit: permissionsCanEdit({
          permissionRelatedProperties: getPermissionRelatedProperties(calleePropertiesData),
          currentScopes: currentScopes,
          currentOwner: currentOwner,
          currentTeams: currentTeams
        })
      });
    }

    acc = acc.set(index, permissions);
    return acc;
  }, ImmutableMap());
});