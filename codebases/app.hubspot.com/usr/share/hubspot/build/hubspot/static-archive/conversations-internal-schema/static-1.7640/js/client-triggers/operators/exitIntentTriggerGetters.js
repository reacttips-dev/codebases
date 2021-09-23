'use es6';

import getIn from 'transmute/getIn';
import { ENABLED } from '../constants/exitIntentTriggerKeyPaths';
export var getEnabled = getIn(ENABLED);