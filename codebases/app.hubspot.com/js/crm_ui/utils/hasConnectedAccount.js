'use es6';

export var hasConnectedAccount = function hasConnectedAccount(connectedAccounts) {
  if (!connectedAccounts || !connectedAccounts.accounts) {
    return false;
  }

  var connectedAccountsWithoutSharedAccount = connectedAccounts.update('accounts', function (accounts) {
    return accounts.filter(function (account) {
      return !account.isShared();
    });
  });
  var nonPrimaryAccountAlias = connectedAccountsWithoutSharedAccount.getFirstIntegratedAlias();

  if (!nonPrimaryAccountAlias) {
    return false;
  }

  var primaryConnectedAccount = connectedAccountsWithoutSharedAccount.getPrimaryAccount(nonPrimaryAccountAlias.address);
  var isPrimaryConnectedAccountEnabled = primaryConnectedAccount && primaryConnectedAccount.isEmailIntegrationEnabled();
  var nonPrimaryConnectedAccount = nonPrimaryAccountAlias && connectedAccountsWithoutSharedAccount.getAccount(nonPrimaryAccountAlias.getAddressId());
  var isNonPrimaryConnectedAccountEnabled = nonPrimaryConnectedAccount && nonPrimaryConnectedAccount.isEmailIntegrationEnabled();
  return isPrimaryConnectedAccountEnabled || isNonPrimaryConnectedAccountEnabled;
};