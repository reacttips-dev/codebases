'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { defineAuthStore } from '../store/AuthStore';
var PortalStore = defineAuthStore({
  initialState: [],
  name: 'PortalStore',
  onAuthLoad: function onAuthLoad(auth) {
    return auth.portal;
  }
}).register(dispatcher);
export default PortalStore;