'use es6';

import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import sentry from 'SalesContentIndexUI/data/utils/sentry';
import SelectionReducer from './reducers/SelectionReducer';
import { SEARCH_FETCH_SUCCEEDED } from '../constants/ActionTypes';
import getEarlyRequestData from './getEarlyRequestData';
export default (function (initialReducers) {
  for (var _len = arguments.length, middleware = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    middleware[_key - 1] = arguments[_key];
  }

  var createStoreWithMiddleware = compose(applyMiddleware.apply(void 0, [sentry, thunk].concat(middleware)))(createStore);
  var reducer = combineReducers(Object.assign({
    selectionData: SelectionReducer
  }, initialReducers));
  var store = createStoreWithMiddleware(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__({
    instanceId: "sales-content-index-ui-" + new Date().getTime(),
    name: 'Sales Content Index UI'
  }) : function (f) {
    return f;
  });
  var earlyRequestData = getEarlyRequestData();

  if (earlyRequestData) {
    store.dispatch({
      type: SEARCH_FETCH_SUCCEEDED,
      payload: earlyRequestData
    });
  }

  return store;
});