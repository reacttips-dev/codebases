'use es6';

import { createAsyncActionTypes } from './createAsyncActionTypes';
import deprecateFunction from '../lib/deprecateFunction';

var getActionTypes = function getActionTypes(actionName, actionTypes) {
  if (actionTypes) return actionTypes;
  return createAsyncActionTypes(actionName);
};

export var createDeprecatedAsyncAction = deprecateFunction('`createDeprecatedAsyncAction` will be removed soon - Use `createAsyncAction` instead', function (_ref) {
  var requestFn = _ref.requestFn,
      actionName = _ref.actionName,
      _ref$actionTypes = _ref.actionTypes,
      actionTypes = _ref$actionTypes === void 0 ? null : _ref$actionTypes,
      toRecordFn = _ref.toRecordFn,
      _ref$successMetaActio = _ref.successMetaActionCreator,
      successMetaActionCreator = _ref$successMetaActio === void 0 ? function () {
    return {};
  } : _ref$successMetaActio,
      _ref$failureMetaActio = _ref.failureMetaActionCreator,
      failureMetaActionCreator = _ref$failureMetaActio === void 0 ? function () {
    return {};
  } : _ref$failureMetaActio;

  if (!actionName && !actionTypes || actionName && actionTypes) {
    throw new Error('Either an actionName or actionTypes are required to create an async action');
  }

  if (!requestFn || typeof requestFn !== 'function') {
    throw new Error("Invalid requestFn \"" + requestFn + "\"");
  }

  if (!toRecordFn || typeof toRecordFn !== 'function') {
    throw new Error("Invalid toRecordFn \"" + toRecordFn + "\"");
  }

  var _getActionTypes = getActionTypes(actionName, actionTypes),
      STARTED = _getActionTypes.STARTED,
      SUCCEEDED = _getActionTypes.SUCCEEDED,
      FAILED = _getActionTypes.FAILED;

  return function (requestArgs) {
    return function (dispatch) {
      var isObject = typeof requestArgs === 'object' && !Array.isArray(requestArgs);

      if (requestArgs && !isObject) {
        throw new Error("Invalid argument \"" + requestArgs + "\"");
      }

      dispatch({
        type: STARTED,
        payload: {
          requestArgs: requestArgs
        }
      });
      var promise = requestFn(requestArgs).then(function (resp) {
        var payload = {
          requestArgs: requestArgs,
          data: toRecordFn(resp)
        };
        return dispatch({
          type: SUCCEEDED,
          payload: payload,
          meta: successMetaActionCreator(payload)
        });
      }, function (error) {
        var payload = {
          requestArgs: requestArgs,
          error: error
        };
        return dispatch({
          type: FAILED,
          payload: payload,
          meta: failureMetaActionCreator(payload)
        });
      });
      promise.done();
      return promise;
    };
  };
});