/* eslint no-restricted-imports: 0 */
'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import externalUserInfo from 'hub-http/userInfo';
import store from '../../redux/store';
import connectActions from '../../redux/connectActions';
import { actions } from './store'; // This is only true for the first call to piggyback off early request user info

var useHubHttpCache = true;
var DEFAULT_OPTIONS = {
  // throw when trying to make an actual http request
  // (for debugging regression testing)
  cacheOnly: false
};
var currentOptions = DEFAULT_OPTIONS;

var setOptions = function setOptions(newOptions) {
  return currentOptions = Object.assign({}, currentOptions, {}, newOptions);
};

var getOptions = function getOptions() {
  return currentOptions;
};

var resetOptions = function resetOptions() {
  return currentOptions = DEFAULT_OPTIONS;
};
/* Here so that we can stub the real userInfo response in tests */


var __TESTABLE__ = {
  userInfo: externalUserInfo
};

var _connectActions = connectActions(store, [actions.setUserInfo, actions.clearUserInfo]),
    _connectActions2 = _slicedToArray(_connectActions, 2),
    setUserInfo = _connectActions2[0],
    clearUserInfo = _connectActions2[1];

var userInfo = function userInfo() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _currentOptions$optio = Object.assign({}, currentOptions, {}, options),
      cacheOnly = _currentOptions$optio.cacheOnly;

  var userInfoPromise = store.getState().userInfo.promise;

  if (userInfoPromise) {
    return userInfoPromise;
  }

  if (cacheOnly) {
    throw new Error('User info not found in cache.');
  }

  var promise = __TESTABLE__.userInfo({
    cached: useHubHttpCache
  });

  setUserInfo({
    promise: promise
  });

  if (useHubHttpCache) {
    useHubHttpCache = false;
  }

  promise.then(function (userInfoResult) {
    setUserInfo({
      promise: promise,
      userInfo: userInfoResult
    });
  });
  return promise;
};

export { setOptions, getOptions, resetOptions, userInfo, clearUserInfo, __TESTABLE__ };