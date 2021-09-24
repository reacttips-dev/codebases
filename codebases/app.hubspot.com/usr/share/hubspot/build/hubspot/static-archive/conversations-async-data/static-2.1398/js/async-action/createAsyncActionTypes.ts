import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { STARTED, SUCCEEDED, FAILED, UNINITIALIZED, OUT_OF_SYNC } from '../async-data/constants/asyncStatuses';
import invariant from '../lib/invariant';
import isActionType from '../lib/isActionType';

/**
 * @description given a base action name, returns an
 * object actions for all async statuses. Intended
 * to be used with ./createAsyncAction.
 * @param {String} actionName a base action name
 * @returns {Object} request status action types
 *
 * @example <caption>Async actions for fetching a record</caption>
 * const THREAD_FETCH = createAsyncActionTypes('THREAD_FETCH');
 * // THREAD_FETCH === {
 * //   FAILED: 'THREAD_FETCH_FAILED',
 * //   SUCCEEDED: 'THREAD_FETCH_SUCCEEDED',
 * //   STARTED: 'THREAD_FETCH_STARTED',
 * // }
 */
export var createAsyncActionTypes = function createAsyncActionTypes(actionName) {
  var _ref;

  invariant(isActionType(actionName), 'createAsyncActionTypes requires a valid base actionName');
  return _ref = {}, _defineProperty(_ref, FAILED, actionName + "_FAILED"), _defineProperty(_ref, OUT_OF_SYNC, actionName + "_OUT_OF_SYNC"), _defineProperty(_ref, STARTED, actionName + "_STARTED"), _defineProperty(_ref, SUCCEEDED, actionName + "_SUCCEEDED"), _defineProperty(_ref, UNINITIALIZED, actionName + "_UNINITIALIZED"), _ref;
};