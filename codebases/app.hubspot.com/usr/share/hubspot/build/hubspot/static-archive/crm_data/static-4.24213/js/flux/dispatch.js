'use es6';

import { dispatchImmediate } from '../dispatch/Dispatch';
/**
 * DEPRECATED
 * ==========
 * This method exists for backwards compatibility.
 * Prefer one of the explicit dispatch methods in `crm_data/dispatch/Dispatch`.
 *
 * `dispatch` behaves similarly to `dispatchSafe` but will warn if it is called
 * within another dispatch.
 *
 * @param  {string}   actionType
 * @param  {any}      data
 */

export function dispatch(actionType, data) {
  dispatchImmediate(actionType, data);
}