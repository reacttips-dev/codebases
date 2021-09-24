'use es6';

import ScopesContainer from '../../setup-object-embed/containers/ScopesContainer';
import { COMPANY, CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import { canBETCreate } from 'customer-data-objects/permissions/BETPermissions';
import { hasSomeEditScopes } from 'crm_data/permissions/canEdit';
/*
    Please cc @HubSpot/mobile-crm in PRs that change this file.
*/

export default (function (objectType) {
  var scopes = ScopesContainer.get();
  var hasPermissionScope = hasSomeEditScopes(scopes, objectType);

  if (objectType === CONTACT || objectType === COMPANY) {
    return hasPermissionScope && canBETCreate(scopes, objectType);
  }

  return hasPermissionScope;
});