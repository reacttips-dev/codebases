'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
export var getDeviceErrorsFromState = get('deviceErrors');
export var getDeviceErrors = createSelector([getDeviceErrorsFromState], get('error'));