'use es6';

import enviro from 'enviro';
import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'SalesTemplateEditor/reducers/rootReducer';
import { errorMiddleware } from 'SalesTemplateEditor/middleware/errorMiddleware';
export default (function () {
  var devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && !enviro.deployed() ? window.__REDUX_DEVTOOLS_EXTENSION__({
    instanceId: "sales-template-editor-" + new Date().getTime(),
    name: 'Sales Template Editor'
  }) : function (f) {
    return f;
  };
  var appliedMiddleware = applyMiddleware(thunk, errorMiddleware);
  var createStoreWithMiddleware = compose(appliedMiddleware, devTools)(createStore);
  return createStoreWithMiddleware(rootReducer, {});
});