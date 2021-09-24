'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import invariant from 'react-utils/invariant';

var getPart = function getPart(addressId, part) {
  var parts = addressId.split(' ');
  invariant(parts.length === 2, 'Invalid addressId %s', addressId);
  return parts[part];
};

var AliasAddressRecord = Record({
  accountId: null,
  address: null,
  displayableAddress: null,
  type: null,
  inboxId: null,
  conversationsInboxName: null,
  conversationsConnectedAccountId: null,
  disabled: null,
  primary: false
}, 'AliasAddressRecord');

var AliasAddress = /*#__PURE__*/function (_AliasAddressRecord) {
  _inherits(AliasAddress, _AliasAddressRecord);

  function AliasAddress() {
    _classCallCheck(this, AliasAddress);

    return _possibleConstructorReturn(this, _getPrototypeOf(AliasAddress).apply(this, arguments));
  }

  _createClass(AliasAddress, [{
    key: "getAddressId",
    value: function getAddressId() {
      return (this.accountId + " " + this.address).trim();
    }
  }], [{
    key: "toAddressId",
    value: function toAddressId(accountId, address) {
      return accountId + " " + address;
    }
  }, {
    key: "toAccountId",
    value: function toAccountId(addressId) {
      return getPart(addressId, 0);
    }
  }, {
    key: "toAliasAddress",
    value: function toAliasAddress(addressId) {
      return getPart(addressId, 1);
    }
  }, {
    key: "fromJS",
    value: function fromJS(json) {
      if (!json || typeof json !== 'object') {
        return json;
      }

      return new AliasAddress(json);
    }
  }]);

  return AliasAddress;
}(AliasAddressRecord);

export { AliasAddress as default };