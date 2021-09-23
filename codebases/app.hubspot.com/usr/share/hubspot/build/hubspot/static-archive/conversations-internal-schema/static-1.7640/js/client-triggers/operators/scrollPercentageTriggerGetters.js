'use es6';

import getIn from 'transmute/getIn';
import { ENABLED, SCROLL_PERCENTAGE } from '../constants/scrollPercentageTriggerKeyPaths';
export var getEnabled = getIn(ENABLED);
export var getScrollPercentage = getIn(SCROLL_PERCENTAGE);