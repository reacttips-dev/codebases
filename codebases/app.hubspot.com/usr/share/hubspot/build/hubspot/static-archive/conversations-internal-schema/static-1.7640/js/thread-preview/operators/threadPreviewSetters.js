'use es6';

import setIn from 'transmute/setIn';
import { HAS_FILE_ATTACHMENT, PREVIEW_TEXT, FAILED, RESPONDER, VISITOR, PREVIEW_MESSAGE_ID } from '../constants/threadPreviewKeyPaths';
export var setHasFileAttachment = setIn(HAS_FILE_ATTACHMENT);
export var setPreviewText = setIn(PREVIEW_TEXT);
export var setPreviewMessageId = setIn(PREVIEW_MESSAGE_ID);
export var setFailed = setIn(FAILED);
export var setResponder = setIn(RESPONDER);
export var setVisitor = setIn(VISITOR);