'use es6';

import { START_TRACK_SCROLL_PERCENTAGE } from '../../constants/PostMessageTypes';
import { postMessageToParent } from '../../post-message/postMessageToParent';
export var postStartTrackScrollPercentage = function postStartTrackScrollPercentage() {
  postMessageToParent(START_TRACK_SCROLL_PERCENTAGE);
};