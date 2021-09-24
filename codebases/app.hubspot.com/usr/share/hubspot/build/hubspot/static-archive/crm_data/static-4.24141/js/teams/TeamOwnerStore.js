'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { TEAM_OWNER } from 'crm_data/actions/ActionNamespaces';
import { defineLazyValueStore } from 'crm_data/store/LazyValueStore';
import { fetch } from './TeamOwnerAPI';
export default defineLazyValueStore({
  fetch: fetch,
  namespace: TEAM_OWNER
}).defineName('TeamOwnerStore').register(dispatcher);