'use es6';

import { List } from 'immutable';
import { extend, omit } from 'underscore';
import ActionMapper from '../lib/legacyRequestActionMapper';
import defer from 'hs-promise-utils/defer';
var requestQueues = {};
export default (function (_ref) {
  var withLegacyPromiseResolve = _ref.withLegacyPromiseResolve;
  return function (store) {
    return function (next) {
      return function (action) {
        if (!action.apiRequest) {
          if (withLegacyPromiseResolve) {
            return Promise.resolve(next(action));
          } else {
            return next(action);
          }
        }

        if (!requestQueues[action.type]) requestQueues[action.type] = new List([]);
        var d = defer();

        var request = function request() {
          store.dispatch(extend({}, omit(action, 'apiRequest'), {
            type: ActionMapper.began(action.type),
            fromApi: true
          }));
          var promise = action.apiRequest(store.getState()).then(function (response) {
            store.dispatch(extend({}, omit(action, 'apiRequest'), {
              type: ActionMapper.success(action.type),
              data: response,
              fromApi: true
            }));
            return d.resolve(response);
          }).catch(function (error) {
            store.dispatch(extend({}, omit(action, 'apiRequest'), {
              type: ActionMapper.error(action.type),
              error: error,
              fromApi: true
            }));
            return d.reject(error);
          });

          var alwaysCall = function alwaysCall() {
            requestQueues[action.type] = requestQueues[action.type].shift();
            if (!requestQueues[action.type].isEmpty()) requestQueues[action.type].first()();
          }; // Support for different promises


          if (promise.finally) promise.finally(alwaysCall);else if (promise.always) promise.always(alwaysCall);
          return promise;
        };

        if (requestQueues[action.type].isEmpty()) request();
        requestQueues[action.type] = requestQueues[action.type].push(request);
        return d.promise;
      };
    };
  };
});