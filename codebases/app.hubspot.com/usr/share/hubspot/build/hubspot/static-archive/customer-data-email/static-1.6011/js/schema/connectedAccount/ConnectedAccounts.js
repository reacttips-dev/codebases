'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, List, Map as ImmutableMap } from 'immutable';
import invariant from 'react-utils/invariant';
import AliasAddress from './AliasAddress';
import ConnectedAccount from './ConnectedAccount';
import EmailAddressRecord from '../email/EmailAddressRecord';
import { TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { getPersistentFromAddress } from '../../utils/PersistentFromAddress';
import { logError } from 'customer-data-ui-utilities/eventLogging/eventLogger';
var ConnectedAccountsRecord = Record({
  accounts: List()
}, 'ConnectedAccountsRecord');

var ConnectedAccounts = /*#__PURE__*/function (_ConnectedAccountsRec) {
  _inherits(ConnectedAccounts, _ConnectedAccountsRec);

  function ConnectedAccounts() {
    _classCallCheck(this, ConnectedAccounts);

    return _possibleConstructorReturn(this, _getPrototypeOf(ConnectedAccounts).apply(this, arguments));
  }

  _createClass(ConnectedAccounts, [{
    key: "logAccountsError",
    value: function logAccountsError(_ref) {
      var message = _ref.message,
          extraData = _objectWithoutProperties(_ref, ["message"]);

      logError({
        error: new Error("ConnectedAccounts Error: " + message),
        extraData: Object.assign({
          accounts: this.accounts
        }, extraData),
        persistedData: getPersistentFromAddress().addresses
      });
    }
  }, {
    key: "isIntegrated",
    value: function isIntegrated(aliasEmailAddressId) {
      if (aliasEmailAddressId) {
        var containingAccount = this.getAccount(aliasEmailAddressId, false);
        return containingAccount && containingAccount.hasEmailIntegration();
      }

      return !this.accounts.isEmpty() && this.accounts.some(function (account) {
        return account.hasEmailIntegration();
      });
    }
  }, {
    key: "getUsersConnectedAliasAddressId",
    value: function getUsersConnectedAliasAddressId(userEmailAddress) {
      var userEmailAddressId = this.getAddressId(userEmailAddress, false);

      if (userEmailAddressId && this.isConnected(userEmailAddressId) && this.isEnabled(userEmailAddressId)) {
        return userEmailAddressId;
      }

      return undefined;
    }
  }, {
    key: "getDefaultIntegratedAliasAddress",
    value: function getDefaultIntegratedAliasAddress(userEmailAddress, objectType) {
      var persistentFromAddress = getPersistentFromAddress().getAddressByType(objectType);

      if (persistentFromAddress) {
        var addressId = persistentFromAddress.addressId;

        try {
          var account = this.getAccount(addressId, false);

          if (!account) {
            this.logAccountsError({
              message: 'No account found in persistent from address',
              extraData: {
                method: 'getDefaultIntegratedAliasAddress',
                addressId: addressId
              }
            });
          }

          var hasAliasAccount = account && account.hasAlias(persistentFromAddress.address);

          if (hasAliasAccount && this.isEnabled(addressId) && (this.isConnected(addressId) || this.isIntegrated(addressId))) {
            return addressId;
          } else {
            getPersistentFromAddress().invalidate(objectType);
          }
        } catch (error) {
          this.logAccountsError({
            message: 'Failed to get persistent address from accounts',
            extraData: {
              error: error,
              persistentFromAddress: persistentFromAddress
            }
          });
          getPersistentFromAddress().invalidate(objectType);
        }
      }

      var usersConnectedAliasAddressId = this.getUsersConnectedAliasAddressId(userEmailAddress);

      if (objectType !== TICKET && usersConnectedAliasAddressId) {
        return usersConnectedAliasAddressId;
      }

      var firstIntegratedAlias = this.getPrimaryIntegratedAlias(objectType);

      if (firstIntegratedAlias) {
        return firstIntegratedAlias.getAddressId();
      }

      return AliasAddress.toAddressId(userEmailAddress, userEmailAddress);
    }
  }, {
    key: "getEnabledAliasMap",
    value: function getEnabledAliasMap() {
      var _this = this;

      var aliases;
      var aliasMap = {
        connectedAliases: {
          shared: List(),
          nonShared: List()
        },
        integratedAliases: {
          shared: List(),
          nonShared: List()
        }
      };

      try {
        aliases = this.getAliases();
      } catch (error) {
        this.logAccountsError({
          message: 'Could not get Aliases from account list',
          extraData: {
            error: error
          }
        });
      }

      if (!aliases) {
        return aliasMap;
      }

      return aliases.reduce(function (map, alias) {
        var addressId = alias.getAddressId();

        if (!_this.isEnabled(addressId)) {
          return map;
        }

        var sharedKey = _this.isShared(alias.getAddressId()) ? 'shared' : 'nonShared';

        if (_this.isConnected(addressId)) {
          map.connectedAliases[sharedKey] = map.connectedAliases[sharedKey].push(alias);
        } else if (_this.isIntegrated(addressId)) {
          map.integratedAliases[sharedKey] = map.integratedAliases[sharedKey].push(alias);
        }

        return map;
      }, aliasMap);
    }
  }, {
    key: "hasEnabledAliases",
    value: function hasEnabledAliases() {
      var _this$getEnabledAlias = this.getEnabledAliasMap(),
          connectedAliases = _this$getEnabledAlias.connectedAliases,
          integratedAliases = _this$getEnabledAlias.integratedAliases;

      return ['shared', 'nonShared'].reduce(function (total, type) {
        return total + connectedAliases[type].count() + integratedAliases[type].count();
      }, 0) > 0;
    }
  }, {
    key: "getFirstIntegratedAlias",
    value: function getFirstIntegratedAlias(objectType) {
      var _this$getEnabledAlias2 = this.getEnabledAliasMap(),
          connectedAliases = _this$getEnabledAlias2.connectedAliases,
          integratedAliases = _this$getEnabledAlias2.integratedAliases;

      var firstSharedConnectedAccount = connectedAliases.shared.get(0);

      if (firstSharedConnectedAccount && objectType === TICKET) {
        return firstSharedConnectedAccount;
      }

      var _ref2 = firstSharedConnectedAccount || connectedAliases.nonShared.count() ? connectedAliases : integratedAliases,
          nonShared = _ref2.nonShared,
          shared = _ref2.shared;

      return nonShared.get(0) || shared.get(0);
    }
  }, {
    key: "getPrimaryIntegratedAlias",
    value: function getPrimaryIntegratedAlias(objectType) {
      var _this$getEnabledAlias3 = this.getEnabledAliasMap(),
          connectedAliases = _this$getEnabledAlias3.connectedAliases,
          integratedAliases = _this$getEnabledAlias3.integratedAliases;

      var getPrimary = function getPrimary(arr) {
        return arr.find(function (item) {
          return item.primary;
        });
      };

      var primarySharedConnectedAccount = getPrimary(connectedAliases.shared) || connectedAliases.shared.get(0);

      if (primarySharedConnectedAccount && objectType === TICKET) {
        return primarySharedConnectedAccount;
      }

      var _ref3 = primarySharedConnectedAccount || connectedAliases.nonShared.count() ? connectedAliases : integratedAliases,
          nonShared = _ref3.nonShared,
          shared = _ref3.shared;

      return getPrimary(nonShared) || getPrimary(shared) || this.getFirstIntegratedAlias(objectType);
    }
  }, {
    key: "hasIntegration",
    value: function hasIntegration(type) {
      return this.accounts.some(function (account) {
        return account.isEmailIntegrationEnabled() && account.integration.type === type;
      });
    }
  }, {
    key: "areAllIntegrationsDisabled",
    value: function areAllIntegrationsDisabled() {
      return this.accounts.every(function (account) {
        return !account.isEmailIntegrationEnabled();
      });
    }
  }, {
    key: "isConnected",
    value: function isConnected(aliasEmailAddressId) {
      var containingAccount = this.getAccount(aliasEmailAddressId, false);
      return !!containingAccount && containingAccount.hasEmailIntegration() && containingAccount.isEmailIntegrationEnabled();
    }
  }, {
    key: "isEnabled",
    value: function isEnabled(aliasEmailAddressId) {
      var containingAccount = this.getAccount(aliasEmailAddressId, false);
      return !!containingAccount && containingAccount.isEnabled(AliasAddress.toAccountId(aliasEmailAddressId));
    }
  }, {
    key: "isShared",
    value: function isShared(aliasEmailAddressId) {
      var containingAccount = this.getAccount(aliasEmailAddressId, false);
      return !!containingAccount && containingAccount.isShared();
    }
  }, {
    key: "getHubSpotHostedAccounts",
    value: function getHubSpotHostedAccounts() {
      return this.accounts.filter(function (account) {
        return account.isHubSpotHosted();
      });
    }
  }, {
    key: "getNonHubSpotHostedAccounts",
    value: function getNonHubSpotHostedAccounts() {
      return this.accounts.filter(function (account) {
        return !account.isHubSpotHosted();
      });
    }
  }, {
    key: "isHubSpotHosted",
    value: function isHubSpotHosted(aliasEmailAddressId) {
      var account = this.getAccount(aliasEmailAddressId, false);
      return !!account && account.isHubSpotHosted();
    }
  }, {
    key: "isDisconnected",
    value: function isDisconnected(aliasEmailAddressId) {
      var containingAccount = this.getAccount(aliasEmailAddressId, false);
      return !!containingAccount && containingAccount.hasEmailIntegration() && !containingAccount.isEmailIntegrationEnabled();
    }
  }, {
    key: "isDisabled",
    value: function isDisabled(aliasEmailAddressId) {
      var containingAccount = this.getAccount(aliasEmailAddressId, false);
      return !!containingAccount && containingAccount.hasFacsimileInbox() && containingAccount.hasEmailIntegration() && !containingAccount.isEmailIntegrationEnabled();
    } // Gets the aliases of accounts that are facsimileInbox enabled and of logged in user.
    // The logged-in user is added to handle the case of new user logging into hubspot for the first
    // time without having connected their account

  }, {
    key: "getFacsimileInboxAliases",
    value: function getFacsimileInboxAliases(loggedInUserEmailAddress) {
      var accounts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.accounts;
      var fascimileInboxAccounts = accounts.filter(function (account) {
        return account.address === loggedInUserEmailAddress || account.hasFacsimileInbox() && account.facsimileInbox === 'ENABLED';
      });
      return this.getAliases(fascimileInboxAccounts, loggedInUserEmailAddress).filter(function (alias) {
        return alias.get('type') !== 'owner' || alias.get('address') === loggedInUserEmailAddress;
      });
    }
  }, {
    key: "getAliases",
    value: function getAliases() {
      var _this2 = this;

      var accounts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.accounts;
      var loggedInUserEmailAddress = arguments.length > 1 ? arguments[1] : undefined;
      // If there are duplicate aliases across the connected accounts, select one of them, giving preference to connected aliases.
      // Filter out all aliases that are of type owner with the exception of the loggedInUserEmailAddress alias
      return accounts.map(function (account) {
        return account.getAliasEmailAddresses();
      }).flatten(true).filterNot(function (alias) {
        return loggedInUserEmailAddress && alias.type === 'owner' && alias.address !== loggedInUserEmailAddress;
      }).sortBy(function (alias) {
        return alias.get('accountId');
      }).reduce(function (aliases, currentAlias) {
        var existingAlias = aliases.get(currentAlias.address);

        if (existingAlias) {
          var aliasId = currentAlias.getAddressId();
          var existingAliasId = existingAlias.getAddressId();

          var currentAliasAccount = _this2.getAccount(aliasId, false); // 1) Prioritize the connected primary alias (and make sure it's enabled)


          if (_this2.isConnected(aliasId) && _this2.isEnabled(aliasId) && currentAliasAccount.isPrimaryAlias(currentAlias.address)) {
            return aliases.set(currentAlias.address, currentAlias);
          } // 2) Keep the current alias if it is connected/enabled


          if (_this2.isConnected(existingAliasId) && _this2.isEnabled(existingAliasId)) {
            return aliases;
          }
        }

        return aliases.set(currentAlias.address, currentAlias);
      }, ImmutableMap()).valueSeq().sortBy(function (alias) {
        return alias.get('displayableAddress');
      }).sortBy(function (alias) {
        return !!alias.get('disabled');
      });
    }
  }, {
    key: "getAddressId",
    value: function getAddressId(aliasEmailAddress) {
      var validate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var accounts = this.getAccountsWithAlias(aliasEmailAddress);

      if (validate) {
        invariant(!accounts.isEmpty(), 'No containing account found for alias %s', aliasEmailAddress);
      }

      if (accounts.isEmpty()) {
        return '';
      }

      var enabledAccounts = accounts.filter(function (acct) {
        return acct.isEnabled(aliasEmailAddress);
      });
      var account = enabledAccounts.find(function (acct) {
        return acct.isPrimaryAlias(aliasEmailAddress) && acct.hasEmailIntegration() && acct.isEmailIntegrationEnabled();
      }) || enabledAccounts.find(function (acct) {
        return acct.hasEmailIntegration() && acct.isEmailIntegrationEnabled();
      }) || accounts.find(function (acct) {
        return acct.isEmailIntegrationEnabled();
      });

      if (!account) {
        account = accounts.first();
      }

      return AliasAddress.toAddressId(account.address, aliasEmailAddress);
    }
  }, {
    key: "getAliasEmailAddress",
    value: function getAliasEmailAddress(aliasEmailAddressId) {
      var validate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var account = this.getAccount(aliasEmailAddressId, false);
      var aliasEmailAddress = AliasAddress.toAliasAddress(aliasEmailAddressId);

      if (validate) {
        invariant(account.hasAlias(aliasEmailAddress), 'No alias email address found for address id %s', aliasEmailAddressId);
      } else if (!account || !account.hasAlias(aliasEmailAddress)) {
        this.logAccountsError({
          message: 'Unable to get Alias Email Address',
          extraData: {
            aliasEmailAddressId: aliasEmailAddressId,
            account: account
          }
        });
      }

      return aliasEmailAddress;
    }
  }, {
    key: "getAccountEmailAddress",
    value: function getAccountEmailAddress(aliasEmailAddressId) {
      var account = this.getAccount(aliasEmailAddressId, false);

      if (!account) {
        this.logAccountsError({
          message: 'Unable to get Account Email Address',
          extraData: {
            aliasEmailAddressId: aliasEmailAddressId
          }
        });
      }

      return account && account.address;
    }
  }, {
    key: "getAccount",
    value: function getAccount(aliasEmailAddressId) {
      var validate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var accountId = AliasAddress.toAccountId(aliasEmailAddressId);
      var account = this.accounts.find(function (acct) {
        return acct.address === accountId;
      });

      if (validate) {
        invariant(!!account, 'No containing account found for alias address id %s', aliasEmailAddressId);
      }

      return account;
    }
  }, {
    key: "getAccountsWithAlias",
    value: function getAccountsWithAlias(aliasEmailAddress) {
      return this.accounts.filter(function (acct) {
        return acct.hasAlias(aliasEmailAddress);
      });
    }
  }, {
    key: "getAccountWithAlias",
    value: function getAccountWithAlias(aliasEmailAddress) {
      var accountsWithAlias = this.getAccountsWithAlias(aliasEmailAddress);
      var primaryEnabledAlias = accountsWithAlias.find(function (acct) {
        return acct.isEnabled(aliasEmailAddress) && acct.isPrimaryAlias(aliasEmailAddress);
      });

      if (primaryEnabledAlias) {
        return primaryEnabledAlias;
      }

      return accountsWithAlias.get(0);
    }
  }, {
    key: "hasPrimaryAccount",
    value: function hasPrimaryAccount(userEmailAddress) {
      return !!this.getPrimaryAccount(userEmailAddress);
    }
  }, {
    key: "getPrimaryAccount",
    value: function getPrimaryAccount(userEmailAddress) {
      return this.accounts.find(function (account) {
        return account.address === userEmailAddress;
      });
    }
  }, {
    key: "getPrimarySignature",
    value: function getPrimarySignature(userEmailAddress) {
      var primaryAccount = this.getPrimaryAccount(userEmailAddress);

      if (!primaryAccount) {
        return null;
      }

      var primaryAlias = primaryAccount.getPrimaryAlias();
      return primaryAlias ? primaryAlias.signature : null;
    }
  }, {
    key: "updateSignature",
    value: function updateSignature(aliasEmailAddressId, signature) {
      var _this3 = this;

      var idx = this.accounts.indexOf(this.getAccount(aliasEmailAddressId, false));

      if (idx === -1) {
        this.logAccountsError({
          message: 'Unable to update email signature - email does not exist',
          extraData: {
            aliasEmailAddressId: aliasEmailAddressId
          }
        });
        return this;
      }

      return this.set('accounts', this.accounts.update(idx, function (account) {
        return account.updateSignature(_this3.getAliasEmailAddress(aliasEmailAddressId, false), signature);
      }));
    }
  }, {
    key: "getAliasFromAliasAddressId",
    value: function getAliasFromAliasAddressId(aliasAddressId) {
      var account = this.getAccount(aliasAddressId, false);

      if (account) {
        var address = account.get('address');
        return account.getAliasWithAddress(address);
      }

      return null;
    }
    /*
     * Given a set of toAddresses, identify a from address to which user has access to
     * Prioritize the shared address over personal address
     */

  }, {
    key: "getFromEmailAddress",
    value: function getFromEmailAddress(toAddress) {
      var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref4$skipPermissions = _ref4.skipPermissionsVerification,
          skipPermissionsVerification = _ref4$skipPermissions === void 0 ? false : _ref4$skipPermissions;

      var from;

      if (!toAddress) {
        return undefined;
      }

      if (!List.isList(toAddress)) {
        toAddress = new List([toAddress]);
      }

      if (this.accounts) {
        // find all connected addresses to which the email was sent to
        var emailAccountMapping = {}; // accountId: { isAlias, Account}

        var connectedAccounts = List();
        this.accounts.forEach(function (account) {
          toAddress.forEach(function (address) {
            var emailAddress = address.get('address');
            var isEnabledAlias = skipPermissionsVerification || account.isEnabled(emailAddress);
            var isSendFromEmail = emailAddress === account.sendFromEmail;
            var keepThisAccount = isEnabledAlias || isSendFromEmail && !account.hasAlias(emailAddress) && !account.getPrimaryAlias().disabled;

            if (keepThisAccount) {
              connectedAccounts = connectedAccounts.push(account);
              var accountId = account.get('address');
              emailAccountMapping[accountId] = {
                isAlias: isEnabledAlias,
                emailAddress: isEnabledAlias ? emailAddress : account.get('address'),
                account: account
              };
            }
          });
        });

        if (connectedAccounts && connectedAccounts.size) {
          // Try picking a connected account that is shared
          var connectedAccount = connectedAccounts.find(function (account) {
            return account.isShared();
          });

          if (!connectedAccount) {
            // If not, just pick the first address from the list
            connectedAccount = connectedAccounts.get(0);
          }

          var accountId = connectedAccount.get('address');
          var emailAddress = emailAccountMapping[accountId].emailAddress;

          try {
            from = new EmailAddressRecord({
              address: emailAddress,
              addressId: this.getAddressId(emailAddress),
              friendlyName: connectedAccount.get('friendlyFromName'),
              sendAsAddress: connectedAccount.get('sendFromEmail'),
              resolvedFromName: connectedAccount.get('resolvedFromName')
            });
          } catch (e) {
            this.logAccountsError({
              message: 'Could not get from address',
              extraData: {
                toAddress: toAddress,
                emailAddress: emailAddress,
                accountId: accountId
              }
            });
          }
        }
      }

      return from;
    }
  }], [{
    key: "fromJS",
    value: function fromJS(json) {
      if (!json || typeof json !== 'object') {
        return json;
      }

      return new ConnectedAccounts({
        accounts: json.accounts ? List(json.accounts.map(ConnectedAccount.fromJS)) : List()
      });
    }
  }]);

  return ConnectedAccounts;
}(ConnectedAccountsRecord);

export { ConnectedAccounts as default };