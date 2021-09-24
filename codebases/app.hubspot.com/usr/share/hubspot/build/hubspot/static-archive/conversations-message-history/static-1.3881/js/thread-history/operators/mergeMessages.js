'use es6';

import curry from 'transmute/curry';
import pipe from 'transmute/pipe';
import updateIn from 'transmute/updateIn';
import { MESSAGE_RESULTS } from '../constants/keyPaths';
export var mergeMessages = curry(function (newMessages, threadHistory) {
  return updateIn(MESSAGE_RESULTS, pipe(function (existingMessages) {
    return newMessages.merge(existingMessages);
  }), threadHistory);
});