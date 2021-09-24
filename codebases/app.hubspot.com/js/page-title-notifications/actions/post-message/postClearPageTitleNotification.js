'use es6';

import { CLEAR_PAGE_TITLE_NOTIFICATION } from '../../../constants/PostMessageTypes';
import { postMessageToParent } from '../../../post-message/postMessageToParent';
export var postClearPageTitleNotification = function postClearPageTitleNotification() {
  postMessageToParent(CLEAR_PAGE_TITLE_NOTIFICATION);
};