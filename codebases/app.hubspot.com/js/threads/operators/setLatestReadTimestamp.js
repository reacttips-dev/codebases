'use es6';

import { LATEST_READ_TIMESTAMP } from '../constants/KeyPaths';
import setIn from 'transmute/setIn';
export var setLatestReadTimestamp = setIn(LATEST_READ_TIMESTAMP);