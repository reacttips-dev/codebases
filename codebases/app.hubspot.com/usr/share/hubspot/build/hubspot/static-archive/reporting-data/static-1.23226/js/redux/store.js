'use es6';

import { createStore } from 'redux';
import isDevelopment from '../lib/development';
import * as global from '../lib/global';
import rootReducer from './rootReducer';
var store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
  name: 'reporting-data'
}));

if (isDevelopment) {
  global.set('store', store);
}

export default store;