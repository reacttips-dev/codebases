'use es6';

import getIn from 'transmute/getIn';
import { ENABLED, TIME_DELAY_SECONDS } from '../constants/timeDelayTriggerKeyPaths';
export var getEnabled = getIn(ENABLED);
export var getTimeDelaySeconds = getIn(TIME_DELAY_SECONDS);