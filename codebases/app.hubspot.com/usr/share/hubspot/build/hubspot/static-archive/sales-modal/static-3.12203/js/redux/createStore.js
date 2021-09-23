'use es6';

import enviro from 'enviro';
import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import identity from 'transmute/identity';
import rootReducer from './rootReducer';
import trackingMiddleware from './trackingMiddleware';
import trackingHandlers from './trackingHandlers';
import { errorMiddleware } from 'sales-modal/js/redux/middleware/errorMiddleware';
export default (function () {
  var devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && !enviro.deployed() ? window.__REDUX_DEVTOOLS_EXTENSION__({
    instanceId: "sales-modal-" + new Date().getTime(),
    name: 'Sales Modal'
  }) : identity;
  var appliedMiddleware = applyMiddleware(thunk, errorMiddleware, trackingMiddleware(trackingHandlers));
  return compose(appliedMiddleware, devTools)(createStore)(rootReducer);
});