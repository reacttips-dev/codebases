'use es6';

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import invariant from 'react-utils/invariant';
import { VISITS_UPDATED, VISITS_REFRESH_QUEUED } from 'crm_data/actions/ActionTypes';
import { dispatchImmediate } from 'crm_data/dispatch/Dispatch';
export function refresh(ids) {
  return dispatchImmediate(VISITS_REFRESH_QUEUED, ImmutableSet(ids));
}
export function updateCompanies(companies) {
  invariant(ImmutableMap.isMap(companies), 'VisitsActions: expected companies to be a Map but got "%s"');
  return dispatchImmediate(VISITS_UPDATED, companies);
}