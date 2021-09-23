'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { LISTS_HAS_STATIC } from '../actions/ActionNamespaces';
import { defineLazyValueStore } from '../store/LazyValueStore';
import { staticListCheck } from './ListsAPI';
export default defineLazyValueStore({
  fetch: staticListCheck,
  namespace: LISTS_HAS_STATIC
}).defineName('HasStaticListsStore').register(dispatcher);