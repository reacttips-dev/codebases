/*
  Don't call this file directly. Instead, use the available abstractions:
   - `SubjectPermissions`
*/
'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import ScopesContainer from '../../containers/ScopesContainer';
import CurrentOwnerContainer from '../../containers/CurrentOwnerContainer';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import { getProperty as getEngagementProperty } from 'customer-data-objects/model/ImmutableEngagementModel';
import { Set as ImmutableSet } from 'immutable';
import { TASK } from 'customer-data-objects/constants/ObjectTypes';
export default function (_ref) {
  var totalSelected = _ref.totalSelected,
      store = _ref.store,
      teams = _ref.teams,
      checked = _ref.checked,
      objectType = _ref.objectType;
  var ownerIds = ["" + CurrentOwnerContainer.get()];

  if (ScopesContainer.get()['crm-edit-unassigned']) {
    ownerIds = [].concat(ownerIds, ['', undefined]);
  }

  if (ScopesContainer.get()['crm-edit-team-owned']) {
    teams.forEach(function (team) {
      var teamOwnerIds = team.get('owners').map(function (owner) {
        return "" + owner.get('ownerId');
      });
      ownerIds = [].concat(_toConsumableArray(ownerIds), _toConsumableArray(teamOwnerIds));
    });
  }

  if (objectType === TASK) {
    return store.get(checked.toList()).filter(function (object) {
      var needle = getEngagementProperty(object, 'engagement.ownerId');
      return object != null && ownerIds.indexOf("" + needle) > -1;
    });
  }

  var ownedRecords = store.get(checked.toList()).filter(function (object) {
    if (!object) {
      return false;
    }

    var hubspotOwnerId = getProperty(object, 'hubspot_owner_id');
    var allOwnerIds = getProperty(object, 'hs_all_owner_ids') || '';
    return ownerIds.includes(hubspotOwnerId) || ImmutableSet(allOwnerIds.split(';')).intersect(ownerIds).size;
  });
  return totalSelected === (ownedRecords && ownedRecords.size);
}