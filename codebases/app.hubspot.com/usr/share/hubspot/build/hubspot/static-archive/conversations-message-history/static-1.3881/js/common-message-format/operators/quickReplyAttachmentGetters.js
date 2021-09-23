'use es6';

import getIn from 'transmute/getIn';
import { ALLOW_MULTI_SELECT, ALLOW_USER_INPUT, QUICK_REPLIES } from '../constants/quickReplyAttachmentKeyPaths';
export var getAllowMultiSelect = getIn(ALLOW_MULTI_SELECT);
export var getAllowUserInput = getIn(ALLOW_USER_INPUT);
export var getQuickReplies = getIn(QUICK_REPLIES);