'use es6';

import { combineReducers } from 'redux';
import resolvingReducer from './resolve/reducer';
import { reducer as requestReducer } from '../request/http/store';
import { reducer as userInfoReducer } from '../request/user-info/store';
export default combineReducers({
  resolve: resolvingReducer,
  request: requestReducer,
  userInfo: userInfoReducer
});