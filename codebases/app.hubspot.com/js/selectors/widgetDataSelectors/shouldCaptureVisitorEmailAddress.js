'use es6';

import { createSelector } from 'reselect';
import { getCaptureVisitorEmailAddress } from 'conversations-internal-schema/message/operators/messageGetters';
import { getWelcomeMessage } from './getWelcomeMessage';
export var shouldCaptureVisitorEmailAddress = createSelector(getWelcomeMessage, getCaptureVisitorEmailAddress);