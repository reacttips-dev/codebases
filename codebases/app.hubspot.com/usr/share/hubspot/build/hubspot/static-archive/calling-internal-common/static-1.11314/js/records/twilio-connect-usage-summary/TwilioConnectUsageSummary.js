'use es6';

import { Record } from 'immutable';
var TwilioConnectUsageSummary = Record({
  category: null,
  usage: 0,
  count: 0,
  price: null,
  priceUnit: null,
  usageUnit: null
}, 'TwilioConnectUsageSummary');
export default TwilioConnectUsageSummary;