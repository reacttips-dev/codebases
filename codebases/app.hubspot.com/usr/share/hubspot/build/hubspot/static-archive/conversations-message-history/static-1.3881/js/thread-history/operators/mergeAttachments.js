'use es6';

import curry from 'transmute/curry';
import pipe from 'transmute/pipe';
import updateIn from 'transmute/updateIn';
import { ATTACHMENTS } from '../constants/keyPaths';
export var mergeAttachments = curry(function (newAttachments, threadHistory) {
  return updateIn(ATTACHMENTS, pipe(function (existingAttachments) {
    return newAttachments.mergeDeep(existingAttachments);
  }), threadHistory);
});