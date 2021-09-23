'use es6';

import { createStore, applyMiddleware, compose } from 'redux';
import enviro from 'enviro';
import thunk from 'redux-thunk';
import usageTrackerMiddleware from 'FileManagerCore/utils/redux/usageTrackerMiddleware';
import floatingAlertMiddleware from './floatingAlertMiddleware';
import rootReducer from '../../reducers';
import { getUsageTrackerWithNamespaceMaybeUpdated } from '../utils';
import selectionMiddleware from './selectionMiddleware';
var debugModeEnabled = enviro.debug('FILE_MANAGER_LIB');
var composeEnhancers = compose;

if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && debugModeEnabled) {
  // enviro.debug('FILE_MANAGER_LIB') === true when localStorage.FILE_MANAGER_LIB_DEBUG === true
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    name: 'FileManagerLib'
  });
}

export default function configureStore(initialState, _ref) {
  var usageTracker = _ref.usageTracker;
  usageTracker = getUsageTrackerWithNamespaceMaybeUpdated(usageTracker);
  var createStoreWithMiddleware = composeEnhancers(applyMiddleware(thunk, usageTrackerMiddleware(usageTracker), floatingAlertMiddleware(), selectionMiddleware))(createStore);
  return createStoreWithMiddleware(rootReducer, initialState);
}