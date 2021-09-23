'use es6';

import memoize from 'transmute/memoize';
import { ACTIVE_TITLE_BAR_HEIGHT, BASE_TITLE_BAR_HEIGHT, THIRD_PARTY_PROVIDER, TWILIO_WIDGET_OPTIONS } from '../../constants/twilioWidgetOptions';
import { UNINITIALIZED, LOADING, INITIALIZING_OUTBOUND_CALL, READY, RINGING, ANSWERED, ENDING, ENDED, SYNC_TIMEOUT } from '../constants/CallWidgetStates';
export var getShouldShowPreCallState = memoize(function (status, startCall) {
  return !startCall && [UNINITIALIZED, READY, LOADING, SYNC_TIMEOUT].includes(status);
});
export var getShouldShowEndCallState = memoize(function (status) {
  return [ENDING, ENDED].includes(status);
});
export var getShouldShowActiveCallState = memoize(function (status) {
  return [INITIALIZING_OUTBOUND_CALL, RINGING, ANSWERED].includes(status);
});
export var canStartCallFromStatus = memoize(function (status) {
  return [UNINITIALIZED, READY, ENDED].includes(status);
});
export var getTitleBarHeight = memoize(function (callStatus) {
  if (getShouldShowActiveCallState(callStatus)) {
    return ACTIVE_TITLE_BAR_HEIGHT;
  }

  return BASE_TITLE_BAR_HEIGHT;
});
export var getDefaultMiniumDimensions = memoize(function (isTwilioBasedCallProvider) {
  return isTwilioBasedCallProvider ? TWILIO_WIDGET_OPTIONS : THIRD_PARTY_PROVIDER;
});