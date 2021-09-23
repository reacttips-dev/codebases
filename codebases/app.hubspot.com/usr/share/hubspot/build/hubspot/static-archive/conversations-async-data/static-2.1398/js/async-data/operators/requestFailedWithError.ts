import curry from 'transmute/curry';
import pipe from 'transmute/pipe';
import { FAILED } from '../constants/asyncStatuses';
import { setError, setStatus, touch } from './setters';
/**
 * Set status when a request fails
 *
 * @param {AsyncData} asyncData AsyncData record to update
 * @returns {AsyncData}
 */

export var requestFailedWithError = curry(function (error, asyncData) {
  return pipe(setError(error), setStatus(FAILED), touch)(asyncData);
});