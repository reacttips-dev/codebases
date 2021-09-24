'use es6';

import { Limits } from '../Constants';
import { splitNameAndExtension, getType } from './file';
export function countUploadingFilesByType(uploadingFiles, fileType) {
  return uploadingFiles.filter(function (file) {
    return getType(splitNameAndExtension(file).extension) === fileType;
  }).length || 0;
}
export var isOrWillVideoLimitBeReached = function isOrWillVideoLimitBeReached(_ref) {
  var hasUserExceededVideoLimit = _ref.hasUserExceededVideoLimit,
      attemptedVideoUploadsCount = _ref.attemptedVideoUploadsCount,
      quantityUsed = _ref.quantityUsed,
      quantityAllowed = _ref.quantityAllowed;
  return hasUserExceededVideoLimit || attemptedVideoUploadsCount + quantityUsed >= quantityAllowed;
};
export var updateAttemptedVideoUploads = function updateAttemptedVideoUploads(state, newValue) {
  return state.get(Limits.EMBEDDABLE_VIDEO).merge({
    attemptedVideoUploads: newValue
  });
};
export function getDecreasedQuantityUsed(state, count) {
  return state.getIn([Limits.EMBEDDABLE_VIDEO, 'quantityUsed']) - count;
}
export function getIncreasedQuantityUsed(state, count) {
  return state.getIn([Limits.EMBEDDABLE_VIDEO, 'quantityUsed']) + count;
}