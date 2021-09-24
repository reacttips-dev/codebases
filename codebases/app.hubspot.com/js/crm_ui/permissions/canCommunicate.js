// deprecated - use `RecordPermissionsContext` or `WithRecordPermissions`

/*
  Avoid calling this file directly. Instead, use the available abstractions:
   - `SubjectPermissions`
*/
'use es6';

import ScopesContainer from '../../setup-object-embed/containers/ScopesContainer';
import CurrentOwnerContainer from '../../setup-object-embed/containers/CurrentOwnerContainer';
import CurrentTeamsContainer from '../../setup-object-embed/containers/CurrentTeamsContainer';
import canCommunicate from 'crm_data/permissions/canCommunicate';
export default function (_ref) {
  var ownerIds = _ref.ownerIds,
      teamIds = _ref.teamIds,
      hubspotOwnerId = _ref.hubspotOwnerId;
  return canCommunicate(ownerIds, teamIds, ScopesContainer.get(), CurrentOwnerContainer.get(), CurrentTeamsContainer.get(), hubspotOwnerId);
}