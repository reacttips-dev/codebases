'use es6';

import setIn from 'transmute/setIn';
import { CHANNEL_INSTANCE_ID, GENERIC_CHANNEL_ID, INTEGRATION_ID, MESSAGE_DIRECTION, RECIPIENTS, SENDERS } from '../constants/keyPaths';
/**
 * The modern home of common message operators as we
 * look to get off of ./commonMessageFormatSetters, which
 * has a lot of edge-casing and checks introduced during
 * record migrations.
 */

export var setChannelInstanceId = setIn(CHANNEL_INSTANCE_ID);
export var setGenericChannelId = setIn(GENERIC_CHANNEL_ID);
export var setIntegrationId = setIn(INTEGRATION_ID);
export var setMessageDirection = setIn(MESSAGE_DIRECTION);
export var setRecipients = setIn(RECIPIENTS);
export var setSenders = setIn(SENDERS);