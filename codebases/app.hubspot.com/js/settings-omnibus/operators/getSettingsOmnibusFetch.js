'use es6';

import quickFetch from 'quick-fetch';
export function getSettingsOmnibusFetch() {
  var earlyTwilioSettingsRequest = quickFetch.getRequestStateByName('callSettingsOmnibus');

  if (earlyTwilioSettingsRequest && earlyTwilioSettingsRequest.finished) {
    return earlyTwilioSettingsRequest.data;
  }

  return null;
}