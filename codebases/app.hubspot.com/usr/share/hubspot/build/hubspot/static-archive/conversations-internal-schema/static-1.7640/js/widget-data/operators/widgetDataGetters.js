'use es6';

import getIn from 'transmute/getIn';
import get from 'transmute/get';
export var getBotResponder = getIn(['sendFrom', '0']);
export var getChatHeadingConfig = getIn(['message', 'chatHeadingConfig']);
export var getColoring = get('coloring');
export var getConsentToCommunicateMessage = getIn(['message', 'customConsentToCommunicateMessage']);
export var getConsentToProcessMessage = getIn(['message', 'customConsentToProcessMessage']);
export var getGDPRConsentToProcessStatus = getIn(['gdprConsentOptions', 'consentToProcessStatus']);
export var getMessage = get('message');
export var getSendFrom = getIn(['sendFrom']);
export var getSessionId = get('sessionId');
export var getShowPreviousConversations = get('showPreviousConversations');
export var getTypicalResponseTime = get('typicalResponseTime');