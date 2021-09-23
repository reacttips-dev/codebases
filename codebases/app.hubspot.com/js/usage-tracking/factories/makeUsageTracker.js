'use es6';

import { makeInAppUsageTracker } from './makeInAppUsageTracker';
import { makePublicUsageTracker } from './makePublicUsageTracker';
export function makeUsageTracker(_ref) {
  var messagesUtk = _ref.messagesUtk,
      _ref$inApp = _ref.inApp53,
      inApp53 = _ref$inApp === void 0 ? false : _ref$inApp;
  return inApp53 ? makeInAppUsageTracker({
    messagesUtk: messagesUtk
  }) : makePublicUsageTracker({
    messagesUtk: messagesUtk
  });
}