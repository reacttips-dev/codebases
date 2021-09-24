'use es6';

import getIn from 'transmute/getIn';
import { ID, TIMESTAMP, TYPE, NEW_CHANNEL, NEW_CHANNEL_NAME, OLD_CHANNEL_NAME, OLD_CHANNEL } from '../constants/keyPaths';
export var getId = getIn(ID);
export var getTimestamp = getIn(TIMESTAMP);
export var getType = getIn(TYPE);
export var getNewChannelName = getIn(NEW_CHANNEL_NAME);
export var getNewChannelDescriptor = getIn(NEW_CHANNEL);
export var getOldChannelName = getIn(OLD_CHANNEL_NAME);
export var getOldChannelDescriptor = getIn(OLD_CHANNEL);