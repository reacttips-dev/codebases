import curry from 'transmute/curry';
import pipe from 'transmute/pipe';
import { updateData, setError, setStatus, touch } from './setters';

/**
 * Set status and operate on data
 *
 * @param {string} newStatus updated status
 * @param {Function} operator update operator to update state
 * @param {AsyncData} asyncData AsyncData record to update
 * @returns {AsyncData}
 */
export var requestStateUpdate = curry(function (newStatus, operator, asyncData) {
  return pipe(setError(null), setStatus(newStatus), updateData(operator), touch)(asyncData);
});