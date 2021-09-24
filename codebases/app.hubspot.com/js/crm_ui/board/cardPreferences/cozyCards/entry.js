'use es6';

import { actions } from './actions';
import { reducer } from './reducer';
import { deref, storesList, get } from './get';
import { prefix } from './constants';
import { save } from './save';
export var duck = {
  prefix: prefix,
  actions: actions,
  reducer: reducer,
  deref: deref,
  storesList: storesList,
  get: get,
  save: save
};