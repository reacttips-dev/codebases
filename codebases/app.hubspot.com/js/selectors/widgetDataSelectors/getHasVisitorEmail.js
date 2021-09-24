'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
var getEmailCaptureStatus = get('emailCapture');
export var getHasVisitorEmail = createSelector(getEmailCaptureStatus, get('hasVisitorEmail'));