'use es6';

import { LATEST_MESSAGE_TIMESTAMP } from '../constants/KeyPaths';
import setIn from 'transmute/setIn';
import { getFileAttachments } from 'conversations-message-history/common-message-format/operators/getFileAttachments';
import { getPlainText, getTimestamp, getId } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import { setHasFileAttachment, setPreviewText, setPreviewMessageId } from 'conversations-internal-schema/thread-preview/operators/threadPreviewSetters';
export var setLatestMessage = function setLatestMessage(message, thread) {
  thread = setIn(LATEST_MESSAGE_TIMESTAMP)(getTimestamp(message), thread);
  thread = setHasFileAttachment(Boolean(getFileAttachments(message) && getFileAttachments(message).length), thread);
  thread = setPreviewText(getPlainText(message), thread);
  thread = setPreviewMessageId(getId(message), thread);
  return thread;
};