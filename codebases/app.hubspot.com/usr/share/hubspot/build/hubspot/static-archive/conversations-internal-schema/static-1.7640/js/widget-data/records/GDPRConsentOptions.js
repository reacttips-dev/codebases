'use es6';

import { Record } from 'immutable';
import { NEVER } from '../constants/gdprCookieConsentTypes';
import { SHOULD_NOT_ASK_FOR_CONSENT } from './GDPRConsentToProcessStatusTypes';
export default Record({
  consentToCommunicateSubscriptionId: null,
  customConsentToCommunicateMessage: null,
  customConsentToProcessMessage: null,
  gdprConsentToCommunicateEnabled: false,
  gdprConsentToProcessEnabled: false,
  gdprExplicitConsentToProcessRequired: false,
  consentToProcessStatus: SHOULD_NOT_ASK_FOR_CONSENT,
  cookieConsentPrompt: NEVER
}, 'GDPRConsentOptions');