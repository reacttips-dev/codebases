'use es6';

import memoize from 'transmute/memoize';
import SenderRecord from 'sales-modal/data/SenderRecord';
import getAccountWithAlias from './getAccountWithAlias';
import * as LocalStorageKeys from 'sales-modal/constants/LocalStorageKeys';
import * as localSettings from 'sales-modal/lib/localSettings';

var getCachedSender = function getCachedSender(_ref) {
  var connectedAccounts = _ref.connectedAccounts,
      cachedSelectedSenderAliasAddress = _ref.cachedSelectedSenderAliasAddress;
  var cachedSelectedConnectedAccount = cachedSelectedSenderAliasAddress && getAccountWithAlias({
    connectedAccounts: connectedAccounts,
    aliasEmailAddress: cachedSelectedSenderAliasAddress
  });
  var isCachedSelectedConnectedAccountEnabled = cachedSelectedConnectedAccount && cachedSelectedConnectedAccount.isEmailIntegrationEnabled();

  if (!isCachedSelectedConnectedAccountEnabled) {
    return null;
  }

  return SenderRecord({
    connectedAccount: cachedSelectedConnectedAccount,
    fromAddress: cachedSelectedSenderAliasAddress,
    inboxAddress: cachedSelectedConnectedAccount.address
  });
};

var getAliasSender = function getAliasSender(_ref2) {
  var connectedAccounts = _ref2.connectedAccounts,
      inboxAddress = _ref2.inboxAddress,
      aliasAddress = _ref2.aliasAddress;
  var isUsingAlias = inboxAddress !== aliasAddress;
  var connectedAccountsWithoutSharedAccount = connectedAccounts.update('accounts', function (accounts) {
    return accounts.filter(function (account) {
      return !account.isShared();
    });
  });
  var aliasConnectedAccount = isUsingAlias && getAccountWithAlias({
    connectedAccounts: connectedAccountsWithoutSharedAccount,
    aliasEmailAddress: aliasAddress
  });
  var isAliasConnectedAccountEnabled = aliasConnectedAccount && aliasConnectedAccount.isEmailIntegrationEnabled();

  if (!isAliasConnectedAccountEnabled) {
    return null;
  }

  return SenderRecord({
    connectedAccount: aliasConnectedAccount,
    fromAddress: aliasAddress,
    inboxAddress: aliasConnectedAccount.address
  });
};

var getPrimarySender = function getPrimarySender(_ref3) {
  var connectedAccounts = _ref3.connectedAccounts,
      inboxAddress = _ref3.inboxAddress;
  var primaryConnectedAccount = connectedAccounts.getPrimaryAccount(inboxAddress.toLowerCase());
  var isPrimaryConnectedAccountEnabled = primaryConnectedAccount && primaryConnectedAccount.isEmailIntegrationEnabled();

  if (!isPrimaryConnectedAccountEnabled) {
    return null;
  }

  return SenderRecord({
    connectedAccount: primaryConnectedAccount,
    fromAddress: primaryConnectedAccount.address,
    inboxAddress: primaryConnectedAccount.address
  });
};

var getNonPrimarySenderPersonalAccount = function getNonPrimarySenderPersonalAccount(_ref4) {
  var connectedAccounts = _ref4.connectedAccounts;
  var nonPrimaryAccountAlias = connectedAccounts.getFirstIntegratedAlias();
  var nonPrimaryConnectedAccount = nonPrimaryAccountAlias && connectedAccounts.getAccount(nonPrimaryAccountAlias.getAddressId());
  var isNonPrimaryConnectedAccountEnabled = nonPrimaryConnectedAccount && nonPrimaryConnectedAccount.isEmailIntegrationEnabled();

  if (!isNonPrimaryConnectedAccountEnabled) {
    return null;
  }

  var nonPrimaryConnectedAccountAlias = nonPrimaryConnectedAccount.getPrimaryAlias().address;
  return SenderRecord({
    connectedAccount: nonPrimaryConnectedAccount,
    fromAddress: nonPrimaryConnectedAccountAlias,
    inboxAddress: nonPrimaryConnectedAccountAlias
  });
};

var getConnectedAccount = memoize(function (connectedAccounts, inboxAddress, aliasAddress, selectConnectedAccount, useCachedConnectedAccount, cachedSelectedSenderAliasAddress) {
  inboxAddress = inboxAddress || '';
  aliasAddress = aliasAddress || inboxAddress;

  if (!connectedAccounts || !connectedAccounts.accounts) {
    return null;
  }

  var connectedAccountsWithoutSharedAccount = connectedAccounts.update('accounts', function (accounts) {
    return accounts.filter(function (account) {
      return !account.isShared();
    });
  });
  var cachedSenderPersonalAccount = selectConnectedAccount && // when selectConnectedAccount is false, we should not use cached address
  useCachedConnectedAccount && getCachedSender({
    connectedAccounts: connectedAccountsWithoutSharedAccount,
    cachedSelectedSenderAliasAddress: cachedSelectedSenderAliasAddress
  });
  var primarySenderAliasPersonalAccount = getAliasSender({
    connectedAccounts: connectedAccountsWithoutSharedAccount,
    inboxAddress: inboxAddress,
    aliasAddress: aliasAddress
  });
  var primarySender = getPrimarySender({
    connectedAccounts: connectedAccounts,
    inboxAddress: inboxAddress
  });
  var nonPrimarySenderPersonalAccount = getNonPrimarySenderPersonalAccount({
    connectedAccounts: connectedAccountsWithoutSharedAccount
  }); // In some scenarios, we must return the provided inboxAddress even if it doesn't exist:
  // - Edits, Resumes, Reenrolls (enrollments shouldn't switch fromAddress midway through)
  // - Enrolling from an email client (fromAddress has to match email client)
  // - Enrolling from the CRM record (fromAddress should match user's choice in the communicator)

  var alwaysReturnPrimarySender = !(selectConnectedAccount && useCachedConnectedAccount);

  if (alwaysReturnPrimarySender) {
    return primarySenderAliasPersonalAccount || primarySender;
  }

  if (cachedSenderPersonalAccount) {
    return cachedSenderPersonalAccount;
  }

  if (primarySenderAliasPersonalAccount) {
    return primarySenderAliasPersonalAccount;
  }

  if (primarySender) {
    // If we get to this point, we must be enrolling from index/lists/SequencesUI --
    // users can't choose the from address before they open the enroll modal.
    // So, we return a personal connected account if there is one.
    // Otherwise, return the primarySender, so the user sees SharedInboxError rather than EnrollmentInboxConnectedError
    if (!alwaysReturnPrimarySender && primarySender.connectedAccount.isShared() && nonPrimarySenderPersonalAccount) {
      return nonPrimarySenderPersonalAccount;
    } else {
      return primarySender;
    }
  }

  if (nonPrimarySenderPersonalAccount) {
    return nonPrimarySenderPersonalAccount;
  }

  return null;
});
export default (function (_ref5) {
  var connectedAccounts = _ref5.connectedAccounts,
      inboxAddress = _ref5.inboxAddress,
      aliasAddress = _ref5.aliasAddress,
      selectConnectedAccount = _ref5.selectConnectedAccount,
      useCachedConnectedAccount = _ref5.useCachedConnectedAccount;
  var cachedSelectedSenderAliasAddress = localSettings.get(LocalStorageKeys.SELECTED_SENDER_ADDRESS_ALIAS);
  return getConnectedAccount(connectedAccounts, inboxAddress, aliasAddress, selectConnectedAccount, useCachedConnectedAccount, cachedSelectedSenderAliasAddress);
});