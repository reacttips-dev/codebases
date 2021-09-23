'use es6';

import { createSelector } from 'reselect';
import { Limits } from '../Constants';
export var getEmbeddableVideoLimit = function getEmbeddableVideoLimit(state) {
  return state.limits.getIn([Limits.EMBEDDABLE_VIDEO, 'quantityAllowed']);
};
export var getUsedEmbeddableVideoCount = function getUsedEmbeddableVideoCount(state) {
  return state.limits.getIn([Limits.EMBEDDABLE_VIDEO, 'quantityUsed']);
};
export var getAttemptedVideoUploadsCount = function getAttemptedVideoUploadsCount(state) {
  return state.limits.getIn([Limits.EMBEDDABLE_VIDEO, 'attemptedVideoUploads']);
};
export var getVideoUsageRequestStatus = function getVideoUsageRequestStatus(state) {
  return state.limits.get('requestStatus');
};
export var getHasUserExceededEmbeddableVideoLimit = createSelector([getEmbeddableVideoLimit, getUsedEmbeddableVideoCount], function (limit, used) {
  return used >= limit;
});