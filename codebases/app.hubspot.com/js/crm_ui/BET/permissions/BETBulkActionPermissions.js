'use es6';

import { isBETPortal } from 'crm_data/BET/permissions/DealPermissions';
import ScopesContainer from '../../../containers/ScopesContainer';
import { DEAL } from 'customer-data-objects/constants/ObjectTypes';
import { isScoped, getAsSet } from '../../../containers/ScopeOperators';
export function betCanViewStandardBulkAssignAction() {
  return !isScoped(ScopesContainer.get(), 'bet-disable-bulk-assignment');
}

function hasDomainControlsAccess(scopes, actionScope) {
  return scopes.has('bet-domain-controls-access') && scopes.has(actionScope);
}

export function betCanViewBETBulkAssignAction(scopes) {
  return isBETPortal(scopes) && hasDomainControlsAccess(scopes, 'bet-assign-all-domains') && !betCanViewStandardBulkAssignAction();
}
export function betCanViewBETBulkRecycleAction(scopes) {
  return isBETPortal(scopes) && hasDomainControlsAccess(scopes, 'bet-domain-owner-recycle-access') && !betCanViewStandardBulkAssignAction();
}
export function betIsBulkEditAllRestricted(allSelected, objectType) {
  if (!isBETPortal(getAsSet(ScopesContainer.get()))) {
    return false;
  }

  return allSelected && objectType === DEAL && !ScopesContainer.get()['bet-crm-bypass-validation'];
}