'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, Map as ImmutableMap } from 'immutable';
import pick from 'transmute/pick';
import partial from 'transmute/partial';
import AliasAddress from './AliasAddress';
import EmailIntegration from './EmailIntegration';
import EmailAliasList from './EmailAliasList';
import { HUBSPOT_HOSTED } from './InboxTypes';
import { logError } from 'customer-data-ui-utilities/eventLogging/eventLogger';
var pickAliasAddresses = pick(['address', 'displayableAddress', 'type', 'inboxId', 'disabled', 'conversationsInboxName', 'primary']);

var toAliasAddresses = function toAliasAddresses(accountId, alias) {
  return new AliasAddress(pickAliasAddresses(ImmutableMap(alias)).merge({
    accountId: accountId
  }));
};

var ConnectedAccountRecord = Record({
  address: null,
  facsimileInbox: null,
  integration: new EmailIntegration(),
  aliasList: EmailAliasList(),
  shared: false,
  inboxType: null,
  friendlyFromName: null,
  resolvedFromName: null,
  sendFromEmail: null
}, 'ConnectedAccountRecord');

var ConnectedAccount = /*#__PURE__*/function (_ConnectedAccountReco) {
  _inherits(ConnectedAccount, _ConnectedAccountReco);

  function ConnectedAccount() {
    _classCallCheck(this, ConnectedAccount);

    return _possibleConstructorReturn(this, _getPrototypeOf(ConnectedAccount).apply(this, arguments));
  }

  _createClass(ConnectedAccount, [{
    key: "hasFacsimileInbox",
    value: function hasFacsimileInbox() {
      return !!this.facsimileInbox;
    }
  }, {
    key: "isShared",
    value: function isShared() {
      return !!this.shared;
    }
  }, {
    key: "hasEmailIntegration",
    value: function hasEmailIntegration() {
      return !!this.integration.exists();
    }
  }, {
    key: "isEmailIntegrationEnabled",
    value: function isEmailIntegrationEnabled() {
      return this.integration.isEnabled();
    }
  }, {
    key: "getAliasEmailAddresses",
    value: function getAliasEmailAddresses() {
      return this.aliasList.aliases.map(partial(toAliasAddresses, this.address));
    }
  }, {
    key: "isHubSpotHosted",
    value: function isHubSpotHosted() {
      return !!this.inboxType && this.inboxType === HUBSPOT_HOSTED;
    }
  }, {
    key: "getAliasWithAddress",
    value: function getAliasWithAddress(address) {
      return this.aliasList.aliases.find(function (alias) {
        return alias.address === address;
      });
    }
  }, {
    key: "hasAlias",
    value: function hasAlias(address) {
      return !!this.getAliasWithAddress(address);
    }
  }, {
    key: "isEnabled",
    value: function isEnabled(address) {
      var alias = this.getAliasWithAddress(address);
      return !!alias && !alias.disabled;
    }
  }, {
    key: "getPrimaryAlias",
    value: function getPrimaryAlias() {
      var accountAlias = this.getAliasWithAddress(this.address);

      if (accountAlias) {
        return accountAlias;
      }

      return this.aliasList.aliases.find(function (alias) {
        return alias.primary;
      });
    }
  }, {
    key: "isPrimaryAlias",
    value: function isPrimaryAlias(address) {
      var alias = this.getAliasWithAddress(address);
      return !!alias && alias.primary;
    }
  }, {
    key: "updateSignature",
    value: function updateSignature(address, signature) {
      var idx = this.aliasList.aliases.findIndex(function (alias) {
        return alias.address === address;
      });

      if (idx === -1) {
        logError({
          error: new Error('Could not find alias in aliasList'),
          extraData: {
            aliases: this.aliasList.aliases,
            address: address,
            signature: signature
          }
        });
        return this;
      }

      var aliases = this.aliasList.aliases.update(idx, function (alias) {
        return alias.set('signature', signature);
      });
      return this.setIn(['aliasList', 'aliases'], aliases);
    }
  }], [{
    key: "fromJS",
    value: function fromJS(json) {
      if (!json || typeof json !== 'object') {
        return null;
      }

      return new ConnectedAccount(Object.assign({}, json, {
        integration: EmailIntegration.fromJS(json.integration),
        aliasList: EmailAliasList.fromJS(json.aliasList)
      }));
    }
  }]);

  return ConnectedAccount;
}(ConnectedAccountRecord);

export { ConnectedAccount as default };