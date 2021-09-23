'use es6';

import getIn from 'transmute/getIn';
import { CURRENT_STATUS, PREVIOUS_STATUS, AUDIT } from '../constants/keyPaths';
export var getCurrentStatus = getIn(CURRENT_STATUS);
export var getPreviousStatus = getIn(PREVIOUS_STATUS);
export var getAudt = getIn(AUDIT);