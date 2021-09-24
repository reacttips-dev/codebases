'use es6';

import { createSelector } from 'reselect';
import getConnectedAccount from 'sales-modal/utils/enrollModal/getConnectedAccount';

var getConnectedAccounts = function getConnectedAccounts(state) {
  return state.connectedAccounts;
};

export var isConnectedAccountValid = createSelector([getConnectedAccounts], function (connectedAccounts) {
  return !!getConnectedAccount({
    connectedAccounts: connectedAccounts,
    selectConnectedAccount: true,
    useCachedConnectedAccount: true
  });
});