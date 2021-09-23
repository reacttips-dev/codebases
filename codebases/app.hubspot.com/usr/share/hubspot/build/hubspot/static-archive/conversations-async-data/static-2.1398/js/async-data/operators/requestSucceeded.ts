import identity from 'transmute/identity';
import { SUCCEEDED } from '../constants/asyncStatuses';
import { requestStateUpdate } from './requestStateUpdate';
/**
 * Set status when a request succeeds
 *
 * @param {AsyncData} asyncData AsyncData record to update
 * @returns {AsyncData}
 */

export var requestSucceeded = requestStateUpdate(SUCCEEDED, identity);