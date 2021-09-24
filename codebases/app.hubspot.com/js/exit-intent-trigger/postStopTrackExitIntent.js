'use es6';

import { STOP_TRACK_EXIT_INTENT } from '../constants/PostMessageTypes';
import { postMessageToParent } from '../post-message/postMessageToParent';
export var postStopTrackExitIntent = function postStopTrackExitIntent() {
  postMessageToParent(STOP_TRACK_EXIT_INTENT);
};