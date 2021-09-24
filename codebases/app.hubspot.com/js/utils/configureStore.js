'use es6';

import { createStore, applyMiddleware, compose } from 'redux';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
var composeEnhancers = typeof window === 'object' && typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
  serialize: {
    immutable: Immutable
  },
  name: 'calling-communicator-ui'
}) : compose;
var createStoreWithMiddleware = composeEnhancers(applyMiddleware(thunk))(createStore);
export default function configureStore() {
  var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return createStoreWithMiddleware(rootReducer, initialState);
}