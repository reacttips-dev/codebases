'use es6';

export default (function (_ref) {
  var connectedAccounts = _ref.connectedAccounts,
      aliasEmailAddress = _ref.aliasEmailAddress;
  return connectedAccounts.accounts.find(function (acct) {
    return aliasEmailAddress && acct.hasAlias(aliasEmailAddress.toLowerCase()) && acct.isEmailIntegrationEnabled();
  });
});