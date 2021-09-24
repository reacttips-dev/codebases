'use es6';

import { postStopTrackScrollPercentage } from '../../scroll-percentage-trigger/actions/postStopTrackScrollPercentage';
import { removeTimeOnPageTrigger } from '../../time-on-page-trigger/actions/removeTimeOnPageTrigger';
import { postStopTrackExitIntent } from '../../exit-intent-trigger/postStopTrackExitIntent';
export var removeAllClientTriggers = function removeAllClientTriggers() {
  return function (dispatch) {
    postStopTrackScrollPercentage();
    dispatch(removeTimeOnPageTrigger());
    postStopTrackExitIntent();
  };
};