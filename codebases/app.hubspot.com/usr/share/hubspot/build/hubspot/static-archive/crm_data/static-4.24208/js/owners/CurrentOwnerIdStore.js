'use es6';

import { CURRENT_OWNER_ID } from '../actions/ActionNamespaces';
import dispatcher from 'dispatcher/dispatcher';
import { defineLazyValueStore } from '../store/LazyValueStore';
import { fetchCurrentOwnerIdFromCache } from './OwnersActions';
export default defineLazyValueStore({
  namespace: CURRENT_OWNER_ID,
  fetch: fetchCurrentOwnerIdFromCache
}).defineName('CurrentOwnerIdStore').register(dispatcher);