'use es6';

import { Record } from 'immutable';
var SenderRecord = Record({
  inboxAddress: null,
  fromAddress: null,
  connectedAccount: null
}, 'SenderRecord');
export default SenderRecord;