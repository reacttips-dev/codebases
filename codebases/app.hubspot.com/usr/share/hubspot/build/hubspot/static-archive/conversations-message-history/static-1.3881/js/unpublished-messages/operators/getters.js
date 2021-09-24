'use es6';

import getIn from 'transmute/getIn';
import { ALLOW_RETRY, THREAD_ID, CHANNEL, MESSAGE } from '../constants/keyPaths';
export var getAllowRetry = getIn(ALLOW_RETRY);
export var getThreadId = getIn(THREAD_ID);
export var getChannel = getIn(CHANNEL);
export var getMessage = getIn(MESSAGE);