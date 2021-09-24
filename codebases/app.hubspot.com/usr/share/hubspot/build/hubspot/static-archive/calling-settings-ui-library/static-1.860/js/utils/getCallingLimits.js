'use es6';

import { CallingLimitHigh, CallingLimitMedium } from './constants/AccessLevels';
import { isScoped, someScoped } from './ScopeOperators';
var CALLING_LIMITS = {
  free: {
    type: 'free',
    warningThreshold: 5
  },
  starter: {
    type: 'starter',
    warningThreshold: 50
  },
  pro: {
    type: 'pro',
    warningThreshold: 100
  }
};
export var getCallingLimits = function getCallingLimits(scopes) {
  if (isScoped(scopes, CallingLimitMedium)) {
    return CALLING_LIMITS.starter;
  } else if (someScoped(scopes, [CallingLimitHigh, 'super-user'])) {
    return CALLING_LIMITS.pro;
  } else {
    return CALLING_LIMITS.free;
  }
};