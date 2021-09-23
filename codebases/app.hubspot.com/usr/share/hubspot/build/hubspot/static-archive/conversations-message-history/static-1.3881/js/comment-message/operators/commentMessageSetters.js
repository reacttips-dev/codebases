'use es6';

import setIn from 'transmute/setIn';
import { ATTACHMENTS, ID, STATUS, TIMESTAMP } from '../constants/keyPaths';
export var setId = setIn(ID);
export var setStatus = setIn(STATUS);
export var setAttachments = setIn(ATTACHMENTS);
export var setTimestamp = setIn(TIMESTAMP);