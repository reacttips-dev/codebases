'use es6';

import curry from 'transmute/curry';
import set from 'transmute/set';
import updateIn from 'transmute/updateIn';
import { MESSAGE_RESULTS } from '../constants/keyPaths';
/**
 * Set a message in a ThreadHistory
 *
 * @param {string} messageKey
 * @param {MessageRecord} message
 * @param {ThreadHistory} threadHistory
 * @returns {ThreadHistory}
 */

export var setMessage = curry(function (messageKey, message, threadHistory) {
  return updateIn(MESSAGE_RESULTS, set(messageKey, message), threadHistory);
});