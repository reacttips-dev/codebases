// deprecated - use `RecordPermissionsContext` or `WithRecordPermissions`

/*
  Don't call this file directly. Instead, use the available abstractions:
   - `SubjectPermissions`
*/
'use es6';

import ScopesContainer from '../../setup-object-embed/containers/ScopesContainer';
import CurrentOwnerContainer from '../../setup-object-embed/containers/CurrentOwnerContainer';
import CurrentTeamsContainer from '../../setup-object-embed/containers/CurrentTeamsContainer';
import canView from 'crm_data/permissions/canView';
import invariant from 'react-utils/invariant';
import { Iterable } from 'immutable';
export default function (_ref) {
  var ownerIds = _ref.ownerIds,
      teamIds = _ref.teamIds,
      hubspotOwnerId = _ref.hubspotOwnerId,
      objectType = _ref.objectType;
  invariant(Iterable.isIterable(ownerIds), "crm_ui-canEdit: expected ownerIds to be a Set but got %s");
  invariant(Iterable.isIterable(teamIds), "crm_ui-canEdit: expected teamIds to be a Set but got %s");
  return canView(ownerIds, teamIds, ScopesContainer.get(), CurrentOwnerContainer.get(), CurrentTeamsContainer.get(), hubspotOwnerId, objectType);
}