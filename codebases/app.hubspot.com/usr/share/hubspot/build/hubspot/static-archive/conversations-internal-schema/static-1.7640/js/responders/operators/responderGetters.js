'use es6';

import pipe from 'transmute/pipe';
import getIn from 'transmute/getIn';
import formatName from 'I18n/utils/formatName';
import getLang from 'I18n/utils/getLang';
import { AVATAR, FIRST_NAME, LAST_NAME, IS_BOT, USER_ID, IS_ONLINE, EMAIL, AGENT_TYPE, MEETINGS_LINKS_TEXT, MEETINGS_LINKS_URL } from '../constants/keyPaths';
import { AGENT } from '../constants/agentTypes';
var formalNameLanguages = ['de', 'ja'];
export var getAvatar = getIn(AVATAR);
export var getFirstName = getIn(FIRST_NAME);
export var getLastName = getIn(LAST_NAME);
export var getEmail = getIn(EMAIL);
export var getFullName = function getFullName(responder) {
  return formatName({
    firstName: getFirstName(responder),
    lastName: getLastName(responder)
  });
};
export var getFriendlyOrFormalName = function getFriendlyOrFormalName(responder, locale) {
  var lang = locale || getLang();
  return formalNameLanguages.indexOf(lang) >= 0 ? getFullName(responder) : getFirstName(responder);
};
export var getIsBot = getIn(IS_BOT);
export var getIsOnline = getIn(IS_ONLINE);
export var getUserId = pipe(getIn(USER_ID), function (userId) {
  return userId && "" + userId;
});
export var getAgentType = getIn(AGENT_TYPE);
export var getMeetingsLinkText = getIn(MEETINGS_LINKS_TEXT);
export var getMeetingsLinkUrl = getIn(MEETINGS_LINKS_URL);
export var getAgentRespondersList = getIn([AGENT]);