'use es6';

import { TWILIO_BASED_PROVIDERS } from 'calling-lifecycle-internal/call-provider/operators/getIsTwilioBasedCallProvider';
export var getIsThirdPartyProvider = function getIsThirdPartyProvider(providerName) {
  return providerName && !TWILIO_BASED_PROVIDERS.includes(providerName);
};