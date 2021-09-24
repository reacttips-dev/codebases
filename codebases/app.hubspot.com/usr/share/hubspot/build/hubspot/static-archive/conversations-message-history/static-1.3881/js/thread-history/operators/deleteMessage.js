'use es6';

import curry from 'transmute/curry';
import { MESSAGE_RESULTS } from '../constants/keyPaths';
/**
 * delete a message in a ThreadHistory
 *
 * @param {string} messageKey
 * @param {ThreadHistory} threadHistory
 * @returns {ThreadHistory}
 */

export var deleteMessage = curry(function (messageKey, threadHistory) {
  return threadHistory.deleteIn(MESSAGE_RESULTS.concat(messageKey));
});