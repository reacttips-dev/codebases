'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { TEAMS } from 'crm_data/actions/ActionNamespaces';
import { defineLazyValueStore } from 'crm_data/store/LazyValueStore';
import { fetch } from './TeamsAPI';
export default defineLazyValueStore({
  fetch: fetch,
  namespace: TEAMS
}).defineName('TeamsStore').register(dispatcher);