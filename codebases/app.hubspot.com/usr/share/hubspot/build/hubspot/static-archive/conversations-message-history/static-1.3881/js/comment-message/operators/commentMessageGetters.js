'use es6';

import getIn from 'transmute/getIn';
import { ATTACHMENTS, CLIENT_TYPE, HAS_MORE, ID, MESSAGE_DELETED_STATUS, RICH_TEXT, SENDER, STATUS, TEXT, TIMESTAMP } from '../constants/keyPaths';
export var getAttachments = getIn(ATTACHMENTS);
export var getClientType = getIn(CLIENT_TYPE);
export var getHasMore = getIn(HAS_MORE);
export var getId = getIn(ID);
export var getMessageDeletedStatus = getIn(MESSAGE_DELETED_STATUS);
export var getRichText = getIn(RICH_TEXT);
export var getSender = getIn(SENDER);
export var getStatus = getIn(STATUS);
export var getText = getIn(TEXT);
export var getTimestamp = getIn(TIMESTAMP);