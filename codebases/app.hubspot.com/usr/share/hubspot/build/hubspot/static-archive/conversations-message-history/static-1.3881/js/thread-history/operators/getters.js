'use es6';

import getIn from 'transmute/getIn';
import { MESSAGE_RESULTS, VISITOR_LAST_READ_AT_TIMESTAMP, NUM_SOFT_DELETED_MESSAGES, MESSAGES, MESSAGE_OFFSET, OFFSET_TIMESTAMP, OFFSET_ORDINAL, MESSAGE_HAS_MORE, ATTACHMENTS, FILE_ATTACHMENTS } from '../constants/keyPaths';
export var getMessagesBase = getIn(MESSAGES);
export var getHasMore = getIn(MESSAGE_HAS_MORE);
export var getOffset = getIn(MESSAGE_OFFSET);
export var getOffsetTimestamp = getIn(OFFSET_TIMESTAMP);
export var getOffsetOrdinal = getIn(OFFSET_ORDINAL);
export var getMessages = getIn(MESSAGE_RESULTS);
export var getVisitorLastReadAtTimestamp = getIn(VISITOR_LAST_READ_AT_TIMESTAMP);
export var getNumSoftDeletedMessages = getIn(NUM_SOFT_DELETED_MESSAGES);
export var getAttachments = getIn(ATTACHMENTS);
export var getFileAttachments = getIn(FILE_ATTACHMENTS);