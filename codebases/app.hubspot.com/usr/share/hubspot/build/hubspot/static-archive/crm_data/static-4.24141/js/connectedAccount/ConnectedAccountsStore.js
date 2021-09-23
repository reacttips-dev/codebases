'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { CRM_CONNECTED_ACCOUNTS } from '../actions/ActionNamespaces';
import { EMAIL_ALIAS_SIGNATURE_UPDATED } from '../actions/ActionTypes';
import { defineLazyValueStore } from '../store/LazyValueStore';
import { fetchAndHydrateConnectedAccounts } from './ConnectedAccountsAPI';
export default defineLazyValueStore({
  fetch: function fetch() {
    return fetchAndHydrateConnectedAccounts();
  },
  namespace: CRM_CONNECTED_ACCOUNTS
}).defineName('ConnectedAccountsStore').defineResponseTo(EMAIL_ALIAS_SIGNATURE_UPDATED, function (state, _ref) {
  var emailAddressId = _ref.emailAddressId,
      signature = _ref.signature;
  return state.set('value', state.value.updateSignature(emailAddressId, signature));
}).register(dispatcher);