'use es6';

import { Record } from 'immutable';
import { UNKNOWN, PREVIOUSLY_BOUNCED } from './EmailDeliverabilityStatus';
var EmailRecipientDeliverabilityRecord = Record({
  address: null,
  sendResult: UNKNOWN,
  hasStatus: function hasStatus() {
    return this.sendResult !== UNKNOWN;
  },
  deliverable: function deliverable() {
    return this.sendResult !== PREVIOUSLY_BOUNCED;
  }
}, 'EmailRecipientDeliverabilityRecord');
export default EmailRecipientDeliverabilityRecord;