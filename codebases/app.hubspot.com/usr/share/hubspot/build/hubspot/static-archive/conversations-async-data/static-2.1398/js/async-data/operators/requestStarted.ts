import identity from 'transmute/identity';
import { STARTED } from '../constants/asyncStatuses';
import { requestStateUpdate } from './requestStateUpdate';
/**
 * Set status when a request starts
 *
 * @param {AsyncData} asyncData AsyncData record to update
 * @returns {AsyncData}
 */

export var requestStarted = requestStateUpdate(STARTED, identity);