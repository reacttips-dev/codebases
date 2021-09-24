'use es6';

import dispatcher from 'dispatcher/dispatcher';
import PortalIdParser from 'PortalIdParser';
import { defineLazyValueStore } from '../store/LazyValueStore';
import { SETTINGS } from '../actions/ActionNamespaces';
import { REVERT_SETTING, SET_SETTING, DELETE_SETTING } from '../actions/ActionTypes';
import { fetch as _fetch } from './SettingsAPI';
export default defineLazyValueStore({
  fetch: function fetch() {
    return _fetch(PortalIdParser.get());
  },
  namespace: SETTINGS
}).defineName('SettingsStore').defineResponseTo([REVERT_SETTING, SET_SETTING], function (state, _ref) {
  var key = _ref.key,
      value = _ref.value;
  return state.setIn(['value', key], value);
}).defineResponseTo([DELETE_SETTING], function (state, _ref2) {
  var key = _ref2.key;
  return state.deleteIn(['value', key]);
}).register(dispatcher);