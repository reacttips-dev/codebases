'use es6';

import getConnectedAccount from 'sales-modal/utils/enrollModal/getConnectedAccount';
export default (function (_ref) {
  var connectedAccounts = _ref.connectedAccounts;
  return !!getConnectedAccount({
    connectedAccounts: connectedAccounts,
    selectConnectedAccount: true,
    useCachedConnectedAccount: true
  });
});