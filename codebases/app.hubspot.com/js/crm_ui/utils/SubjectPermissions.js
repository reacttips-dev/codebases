// deprecated - use `RecordPermissionsContext` or `WithRecordPermissions`
'use es6';

import permissionsCanView from '../permissions/canView';
import permissionsCanEdit from '../permissions/canEdit';
import permissionsCanBulkEdit from '../permissions/canBulkEdit';
import permissionsCanCommunicate from '../permissions/canCommunicate';
import { getProperty, getObjectType } from 'customer-data-objects/model/ImmutableModel';
import { Set as ImmutableSet } from 'immutable';
import I18n from 'I18n';

var getSubjectProperties = function getSubjectProperties(subject) {
  var hubspotOwnerId = getProperty(subject, 'hubspot_owner_id');
  var allOwnerIds = getProperty(subject, 'hs_all_owner_ids');
  var teamId = getProperty(subject, 'hubspot_team_id');
  var allTeamIds = getProperty(subject, 'hs_all_team_ids');
  var objectType = getObjectType(subject);
  var allAccessibleTeamIds = getProperty(subject, 'hs_all_accessible_team_ids');
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
    teamIds: teamIds,
    objectType: objectType
  };
};

export var canBulkEdit = function canBulkEdit(totalSelected, store, teams, checked, objectType) {
  return permissionsCanBulkEdit({
    totalSelected: totalSelected,
    store: store,
    teams: teams,
    checked: checked,
    objectType: objectType
  });
}; // newly created records don't have all the properties necessary
// to determine permissions
// use case: Create a contact -> immediately get redirected to record

export var recordIsNewlyCreated = function recordIsNewlyCreated(subject) {
  var createDate = getProperty(subject, 'createdate');
  var teamIds = getProperty(subject, 'hubspot_team_id');

  if (!subject || !createDate) {
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
/**
 * @deprecated this will be removed once CRM:RecordNewPermissions is ungated to all
 */

export var canEdit = function canEdit(subject) {
  if (!subject) {
    return false;
  }

  if (recordIsNewlyCreated(subject)) {
    return true;
  }

  return subject && permissionsCanEdit(getSubjectProperties(subject));
};
export var canView = function canView(subject) {
  return subject && (recordIsNewlyCreated(subject) || permissionsCanView(getSubjectProperties(subject)));
};
export function canCommunicate(subject) {
  return subject && (recordIsNewlyCreated(subject) || permissionsCanCommunicate(getSubjectProperties(subject)));
}