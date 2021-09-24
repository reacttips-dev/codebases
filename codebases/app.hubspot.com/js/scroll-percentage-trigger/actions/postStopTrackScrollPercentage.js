'use es6';

import { STOP_TRACK_SCROLL_PERCENTAGE } from '../../constants/PostMessageTypes';
import { postMessageToParent } from '../../post-message/postMessageToParent';
export var postStopTrackScrollPercentage = function postStopTrackScrollPercentage() {
  postMessageToParent(STOP_TRACK_SCROLL_PERCENTAGE);
};