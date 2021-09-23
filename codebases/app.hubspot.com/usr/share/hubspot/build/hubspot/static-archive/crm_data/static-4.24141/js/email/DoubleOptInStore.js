'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { DOUBLE_OPT_IN } from '../actions/ActionNamespaces';
import { defineLazyValueStore } from '../store/LazyValueStore';
import { fetch } from './DoubleOptInAPI';
export default defineLazyValueStore({
  fetch: fetch,
  namespace: DOUBLE_OPT_IN
}).defineName('DoubleOptInStore').register(dispatcher);