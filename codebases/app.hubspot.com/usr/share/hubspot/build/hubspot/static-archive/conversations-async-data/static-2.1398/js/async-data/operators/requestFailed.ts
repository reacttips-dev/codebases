import identity from 'transmute/identity';
import { FAILED } from '../constants/asyncStatuses';
import { requestStateUpdate } from './requestStateUpdate';
/**
 * Set status when a request fails
 *
 * @param {AsyncData} asyncData AsyncData record to update
 * @returns {AsyncData}
 */

export var requestFailed = requestStateUpdate(FAILED, identity);