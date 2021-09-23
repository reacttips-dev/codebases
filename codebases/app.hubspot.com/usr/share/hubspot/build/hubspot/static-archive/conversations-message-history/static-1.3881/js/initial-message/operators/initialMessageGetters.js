'use es6';

import getIn from 'transmute/getIn';
import { CLIENT_TYPE, ID, RICH_TEXT, SENDER, STATUS, TEXT, TIMESTAMP } from '../constants/keyPaths';
export var getClientType = getIn(CLIENT_TYPE);
export var getId = getIn(ID);
export var getRichText = getIn(RICH_TEXT);
export var getSender = getIn(SENDER);
export var getStatus = getIn(STATUS);
export var getText = getIn(TEXT);
export var getTimestamp = getIn(TIMESTAMP);