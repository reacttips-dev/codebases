'use es6';

import { defineAuthStore } from 'crm_data/store/AuthStore';
import dispatcher from 'dispatcher/dispatcher';
var IsUngatedStore = defineAuthStore({
  getter: function getter(state, gate) {
    return gate && state.includes(gate);
  },
  initialState: [],
  name: 'IsUngatedStore',
  onAuthLoad: function onAuthLoad(auth) {
    return auth.gates;
  }
}).register(dispatcher);
export default IsUngatedStore;