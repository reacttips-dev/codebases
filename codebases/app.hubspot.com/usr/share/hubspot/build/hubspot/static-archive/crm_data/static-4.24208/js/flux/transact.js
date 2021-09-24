'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { dispatchImmediate } from '../dispatch/Dispatch';
import emptyFunction from 'react-utils/emptyFunction';
import invariant from 'react-utils/invariant';
import isArray from 'transmute/isArray';
import isFunction from 'transmute/isFunction';
import partial from 'transmute/partial';
import isPromise from 'hs-promise-utils/isThenable';

function enforceValidOptions(options) {
  var accept = options.accept,
      commit = options.commit,
      operation = options.operation,
      rollback = options.rollback;
  invariant(isFunction(operation), 'expected `options.operation` to be a function but got `%s`', operation);
  invariant(!accept || isArray(accept) || isFunction(accept), 'expected `options.accept` to be an optional array or function but got `%s`', accept);
  invariant(isArray(commit), 'expected `options.commit` to be an array but got `%s`', commit);
  invariant(isArray(rollback), 'expected `options.rollback` to be an array but got `%s`', rollback);
  return options;
}
/**
 * `transact` is a utility for optimistic updates with GeneralStore
 *
 * Example:
 *
 *  transact({
 *    opertion: API.save,
 *    commit: [COMMIT_ACTION_TYPE, optimisticData],
 *    accept: [ACCEPT_ACTION_TYPE, acceptData],
 *    rollback: [ROLLBACK_ACTION_TYPE, rollbackData],
 *  });
 *
 * The `commit` tuple is dispatched immediately. Then `operation` is
 * called (it must return a Promise).
 *
 * If the promise is resolved and an `accept` tuple is provided, then the tuple
 * is dispatched. Otherwise, nothing happens and every thing is fine.
 *
 * If the promise is rejected the `rollback` tuple is dispatched/
 *
 * @param  {Object}
 * @return {Promise}
 */


export function transact(options) {
  var _enforceValidOptions = enforceValidOptions(options),
      accept = _enforceValidOptions.accept,
      commit = _enforceValidOptions.commit,
      operation = _enforceValidOptions.operation,
      rollback = _enforceValidOptions.rollback;

  dispatchImmediate.apply(void 0, _toConsumableArray(commit));
  var promise = operation();
  invariant(isPromise(promise), 'expected operation to return a promise but got `%s`', promise);
  promise.then(function (result) {
    if (isArray(accept)) {
      return dispatchImmediate.apply(void 0, _toConsumableArray(accept));
    }

    if (isFunction(accept)) {
      return accept(result);
    }

    return emptyFunction;
  }).catch(partial.apply(void 0, [dispatchImmediate].concat(_toConsumableArray(rollback)))).done();
  return promise;
}