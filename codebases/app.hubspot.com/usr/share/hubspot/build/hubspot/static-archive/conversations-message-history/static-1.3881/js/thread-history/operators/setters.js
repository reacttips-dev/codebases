'use es6';

import setIn from 'transmute/setIn';
import { VISITOR_LAST_READ_AT_TIMESTAMP, NUM_SOFT_DELETED_MESSAGES, MESSAGE_RESULTS, MESSAGES, MESSAGE_OFFSET, OFFSET_TIMESTAMP, OFFSET_ORDINAL, MESSAGE_HAS_MORE, ATTACHMENTS, FILE_ATTACHMENTS } from '../constants/keyPaths';
export var setMessagesBase = setIn(MESSAGES);
export var setHasMore = setIn(MESSAGE_HAS_MORE);
export var setOffset = setIn(MESSAGE_OFFSET);
export var setOffsetTimestamp = setIn(OFFSET_TIMESTAMP);
export var setOffsetOrdinal = setIn(OFFSET_ORDINAL);
export var setMessages = setIn(MESSAGE_RESULTS);
export var setVisitorLastReadAtTimestamp = setIn(VISITOR_LAST_READ_AT_TIMESTAMP);
export var setNumSoftDeletedMessages = setIn(NUM_SOFT_DELETED_MESSAGES);
export var setAttachments = setIn(ATTACHMENTS);
export var setFileAttachments = setIn(FILE_ATTACHMENTS);