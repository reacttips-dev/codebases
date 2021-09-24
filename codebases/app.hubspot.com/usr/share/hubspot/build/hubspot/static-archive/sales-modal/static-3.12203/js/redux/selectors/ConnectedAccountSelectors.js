'use es6';

import { createSelector } from 'reselect';
import SenderRecord from 'sales-modal/data/SenderRecord';

var getConnectedAccounts = function getConnectedAccounts(state) {
  return state.connectedAccounts.data;
};

export var selectEnabledSenderRecords = createSelector(getConnectedAccounts, function (connectedAccounts) {
  var validConnectedAccounts = connectedAccounts.update('accounts', function (accounts) {
    return accounts.filter(function (account) {
      return !account.isShared() && account.isEmailIntegrationEnabled();
    });
  });
  return validConnectedAccounts.getAliases().filter(function (aliasAddress) {
    return aliasAddress.type !== 'owner';
  }).map(function (aliasAddress) {
    return SenderRecord({
      inboxAddress: aliasAddress.accountId,
      fromAddress: aliasAddress.address,
      connectedAccount: connectedAccounts.getAccount(aliasAddress.getAddressId())
    });
  }).filter(function (_ref) {
    var connectedAccount = _ref.connectedAccount;
    return !connectedAccount.isShared() && connectedAccount.isEmailIntegrationEnabled();
  }).toList();
});