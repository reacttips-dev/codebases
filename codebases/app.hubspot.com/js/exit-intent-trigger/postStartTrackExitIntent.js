'use es6';

import { START_TRACK_EXIT_INTENT } from '../constants/PostMessageTypes';
import { postMessageToParent } from '../post-message/postMessageToParent';
export var postStartTrackExitIntent = function postStartTrackExitIntent() {
  postMessageToParent(START_TRACK_EXIT_INTENT);
};