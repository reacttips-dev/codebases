import { STARTED } from '../constants/asyncStatuses';
import { requestStateUpdate } from './requestStateUpdate';
/**
 * Set status and operate on data when a request started
 *
 * @param {Function} operator operator to apply to data
 * @param {AsyncData} asyncData AsyncData record to update
 * @returns {AsyncData}
 */

export var requestStartedWithOperator = requestStateUpdate(STARTED);