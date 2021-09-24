'use es6';

import { Record } from 'immutable';
var EmailAlias = Record({
  address: null,
  displayableAddress: null,
  primary: false,
  signature: null,
  default: false,
  type: null,
  disabled: null,
  inboxId: null,
  conversationsInboxName: null,
  conversationsConnectedAccountId: null
}, 'EmailAlias');

EmailAlias.fromJS = function (json) {
  if (!json || typeof json !== 'object') {
    return null;
  }

  return EmailAlias(json);
};

export default EmailAlias;