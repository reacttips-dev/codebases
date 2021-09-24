'use es6';

import once from 'hs-lodash/once';
import { getIsEmbeddedInProduct } from '../query-params/getIsEmbeddedInProduct';
import { getMessagesUtk } from '../query-params/getMessagesUtk';
import { makeUsageTracker } from './factories/makeUsageTracker';

var makeUsageTrackerSingleton = function makeUsageTrackerSingleton() {
  return makeUsageTracker({
    messagesUtk: getMessagesUtk(),
    inApp53: getIsEmbeddedInProduct()
  });
};

export var getUsageTracker = once(makeUsageTrackerSingleton);