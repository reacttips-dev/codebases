'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import AliasAddress from 'customer-data-email/schema/connectedAccount/AliasAddress';
var BaseEmailAddressRecord = Record({
  id: null,
  addressId: null,
  firstName: null,
  lastName: null,
  address: null,
  friendlyName: null,
  sendAsAddress: null,
  resolvedFromName: null
}, 'EmailAddressRecord');

var EmailAddressRecord = /*#__PURE__*/function (_BaseEmailAddressReco) {
  _inherits(EmailAddressRecord, _BaseEmailAddressReco);

  function EmailAddressRecord() {
    _classCallCheck(this, EmailAddressRecord);

    return _possibleConstructorReturn(this, _getPrototypeOf(EmailAddressRecord).apply(this, arguments));
  }

  _createClass(EmailAddressRecord, [{
    key: "fullName",
    value: function fullName(nameFormatter) {
      return nameFormatter({
        firstName: this.firstName,
        lastName: this.lastName
      });
    }
  }, {
    key: "formatted",
    value: function formatted(nameFormatter) {
      var fullName = this.fullName(nameFormatter);

      if (fullName) {
        return "\"" + fullName + "\" <" + this.address + ">";
      }

      return this.address;
    }
  }, {
    key: "exists",
    value: function exists() {
      return !!this.id;
    }
  }, {
    key: "hasName",
    value: function hasName() {
      return !!(this.firstName || this.lastName || this.friendlyName);
    }
  }, {
    key: "hasAddress",
    value: function hasAddress() {
      return !!(this.address || this.sendAsAddress);
    }
  }, {
    key: "getAccountId",
    value: function getAccountId() {
      return AliasAddress.toAccountId(this.addressId);
    }
  }, {
    key: "getSendAsAddress",
    value: function getSendAsAddress() {
      return this.sendAsAddress || this.address;
    }
  }, {
    key: "getFriendlyName",
    value: function getFriendlyName(nameFormatter) {
      var fullName = this.fullName(nameFormatter);
      return this.resolvedFromName || this.friendlyName || fullName;
    }
  }]);

  return EmailAddressRecord;
}(BaseEmailAddressRecord);

export { EmailAddressRecord as default };