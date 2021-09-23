'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { MULTI_CURRENCY_SETTINGS } from '../actions/ActionNamespaces';
import { defineLazyValueStore } from '../store/LazyValueStore';
import { fetchHomeCurrency } from './MultiCurrencyApi';
export default defineLazyValueStore({
  fetch: fetchHomeCurrency,
  namespace: MULTI_CURRENCY_SETTINGS
}).defineName('MultiCurrencySettingsStore').register(dispatcher);