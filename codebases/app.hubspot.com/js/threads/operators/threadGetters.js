'use es6';

import getIn from 'transmute/getIn';
import { ASSIGNEE, CHANNEL_DETAILS, LATEST_MESSAGE_TIMESTAMP, LATEST_READ_TIMESTAMP, PREVIEW_MESSAGE_ID, RESPONDER, STATUS, THREAD_ID, UNSEEN_COUNT } from '../constants/KeyPaths';
import pipe from 'transmute/pipe';
import { getChannelName as getChannelDetailsName } from '../../channel-details/operators/channelDetailsGetters';
export var getLatestReadTimestamp = getIn(LATEST_READ_TIMESTAMP);
export var getThreadId = getIn(THREAD_ID);
export var getAssignedAgentId = getIn(ASSIGNEE);
export var getStatus = getIn(STATUS);
export var getChannelDetails = getIn(CHANNEL_DETAILS);
export var getResponder = getIn(RESPONDER);
export var getUnseenCount = getIn(UNSEEN_COUNT);
export var getLatestMessageTimestamp = getIn(LATEST_MESSAGE_TIMESTAMP);
export var getPreviewMessageId = getIn(PREVIEW_MESSAGE_ID);
export var getChannelName = pipe(getChannelDetails, getChannelDetailsName);