'use es6';

import * as LimitsApi from '../api/Limits';
import { FETCH_LIMITS_SUCCEEDED, CONFIRM_VIDEO_UPLOAD_WITHOUT_EMBED, DECREASE_VIDEO_QUANTITY_USED } from './ActionTypes';
import { reportError } from '../utils/logging';
export function getFetchLimitSucceeded(limits) {
  return {
    type: FETCH_LIMITS_SUCCEEDED,
    limits: limits
  };
}
export var fetchLimits = function fetchLimits() {
  return function (dispatch) {
    return LimitsApi.fetchLimits().then(function (limits) {
      return dispatch(getFetchLimitSucceeded(limits));
    }).catch(function (e) {
      reportError(e, {
        action: 'FETCH_LIMITS_FAILED'
      });
    });
  };
};
export function getComfirmVideoUploadWithoutEmbedAction() {
  return {
    type: CONFIRM_VIDEO_UPLOAD_WITHOUT_EMBED
  };
}
export var confirmVideoUploadWithoutEmbed = function confirmVideoUploadWithoutEmbed() {
  return function (dispatch) {
    dispatch(getComfirmVideoUploadWithoutEmbedAction());
  };
};
export function getDecreaseVideoQuantityUsedAction(videoCount) {
  return {
    type: DECREASE_VIDEO_QUANTITY_USED,
    videoCount: videoCount
  };
}