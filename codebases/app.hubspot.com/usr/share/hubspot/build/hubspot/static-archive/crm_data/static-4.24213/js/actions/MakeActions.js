'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as ActionSteps from './ActionSteps';
import * as ActionVerbs from './ActionVerbs';
import invariant from 'react-utils/invariant';
/**
 * Creates a "constants" object.
 *
 * @example
 * constants(['ONE', 'TWO', 'THREE'])
 * // => {ONE: 'ONE', TWO: 'TWO', THREE: 'THREE'}
 *
 * @param  {...Array<string>} keys to set in the constants object
 * @return {{[key:string]: string}} a "constants" object
 */

function constants() {
  var result = {};

  for (var _len = arguments.length, keys = new Array(_len), _key = 0; _key < _len; _key++) {
    keys[_key] = arguments[_key];
  }

  keys.forEach(function (key) {
    result[key] = key;
  });
  return result;
}

export function makeAction() {
  for (var _len2 = arguments.length, segments = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    segments[_key2] = arguments[_key2];
  }

  return segments.join('_').toUpperCase();
}
export function makeAsyncActionType(namespace, verb, step) {
  invariant(typeof namespace === 'string' && namespace.length > 0, 'expected `namespace` to be a non-empty string but got `%s`', namespace);
  invariant(Object.prototype.hasOwnProperty.call(ActionVerbs, verb), 'expected `verb` to be defined in `crm_data/actions/ActionVerbs` but got `%s`', verb);
  invariant(Object.prototype.hasOwnProperty.call(ActionSteps, step), 'expected `step` to be defined in `crm_data/actions/ActionSteps` but got `%s`', step);
  return makeAction(namespace, verb, step);
}
/**
 * Returns an array of actionType strings that describe the standard async
 * progression: QUEUED, STARTED, FAILED, SUCCEEDED.
 *
 * @example
 * makeAsyncActionTypes('TEST', 'FETCH') // =>
 *  {
 *    QUEUED: 'TEST_FETCH_QUEUED',
 *    STARTED: 'TEST_FETCH_STARTED',
 *    FAILED: 'TEST_FETCH_FAILED',
 *    SUCCEEDED: 'TEST_FETCH_SUCCEEDED',
 *  }
 *
 * @param  {string} namespace the types belong to
 * @param  {string} verb the types describe
 * @return {{[key: string]: string}} actionTypes by short key
 */

export function makeAsyncActionTypes(namespace, verb) {
  var _ref;

  return _ref = {}, _defineProperty(_ref, ActionSteps.QUEUED, makeAsyncActionType(namespace, verb, ActionSteps.QUEUED)), _defineProperty(_ref, ActionSteps.STARTED, makeAsyncActionType(namespace, verb, ActionSteps.STARTED)), _defineProperty(_ref, ActionSteps.FAILED, makeAsyncActionType(namespace, verb, ActionSteps.FAILED)), _defineProperty(_ref, ActionSteps.SUCCEEDED, makeAsyncActionType(namespace, verb, ActionSteps.SUCCEEDED)), _defineProperty(_ref, ActionSteps.SETTLED, makeAsyncActionType(namespace, verb, ActionSteps.SETTLED)), _ref;
}
/**
 * Similar to `makeAsyncActionTypes` but returns "constants" object.
 *
 * @example
 * makeAsyncActionConstants('TEST', 'FETCH')
 * // => {TEST_FETCH_QUEUED: 'TEST_FETCH_QUEUED', ...}
 *
 * It's useful for merging actions into a big object like in ActionTypes.js.
 *
 * @example
 * // ActionTypes.js
 * export default {
 *   OTHER_ACTION: 'OTHER_ACTION',
 *   ...makeAsyncActionConstants('TEST', 'FETCH'),
 * };
 *
 * @param  {string} namespace the types belong to
 * @param  {string} verb the types describe
 * @return {{[key:string]: string}} list of actionTypes
 */

export function makeAsyncActionConstants(namespace, verb) {
  return constants(makeAsyncActionType(namespace, verb, ActionSteps.QUEUED), makeAsyncActionType(namespace, verb, ActionSteps.STARTED), makeAsyncActionType(namespace, verb, ActionSteps.FAILED), makeAsyncActionType(namespace, verb, ActionSteps.SUCCEEDED), makeAsyncActionType(namespace, verb, ActionSteps.SETTLED));
}