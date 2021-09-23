'use es6';

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'SequencesUI/reducers';
import { errorMiddleware } from 'SequencesUI/js/middleware/errorMiddleware';
export default (function () {
  var createStoreWithMiddleware = compose(applyMiddleware(thunk, errorMiddleware), window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : function (f) {
    return f;
  })(createStore);
  return createStoreWithMiddleware(rootReducer, {});
});