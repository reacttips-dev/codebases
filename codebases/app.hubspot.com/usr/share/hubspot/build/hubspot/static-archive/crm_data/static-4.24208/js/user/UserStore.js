'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { defineAuthStore } from '../store/AuthStore';
export default defineAuthStore({
  getter: function getter(state, field) {
    return field ? state[field] : state;
  },
  initialState: {},
  name: 'UserStore',
  onAuthLoad: function onAuthLoad(auth) {
    return auth.user;
  }
}).register(dispatcher);