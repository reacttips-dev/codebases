'use es6';

import GlobalScopesContainer from 'crm-legacy-global-containers/GlobalScopesContainer';
import { isScoped } from 'crm-legacy-global-containers/ScopeOperators';
export function hasSalesProSeat() {
  return isScoped(GlobalScopesContainer.getContainer().get(), 'sequences-bulk-enroll');
}
export function hasSequencesEnrollmentsAccess() {
  return isScoped(GlobalScopesContainer.getContainer().get(), 'sequences-enrollments-write-access');
}
export function hasSequencesBulkEnroll() {
  return isScoped(GlobalScopesContainer.getContainer().get(), 'sequences-bulk-enroll-write');
}
export function hasSequencesAccess() {
  return isScoped(GlobalScopesContainer.getContainer().get(), 'sequences-read-access');
}