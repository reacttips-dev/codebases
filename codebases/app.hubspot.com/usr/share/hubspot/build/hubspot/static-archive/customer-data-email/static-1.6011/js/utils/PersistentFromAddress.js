'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { Map as ImmutableMap } from 'immutable';
import { logError } from 'customer-data-ui-utilities/eventLogging/eventLogger';
import EmailAddressRecord from 'customer-data-email/schema/email/EmailAddressRecord';
import once from 'transmute/once';
import { TICKET } from 'customer-data-objects/constants/ObjectTypes';
import PortalIdParser from 'PortalIdParser';
export var PersistentFromAddress = /*#__PURE__*/function () {
  function PersistentFromAddress(storage) {
    _classCallCheck(this, PersistentFromAddress);

    this.storage = storage;
    this.key = "EmailSettings:PersistentFromAddress:" + PortalIdParser.get();
    this.defaultKey = 'DEFAULT';
    this.addresses = ImmutableMap();
    this.allowedKeys = [TICKET];

    if (this.storage && this.isRestorable()) {
      this.restore();
    }
  }

  _createClass(PersistentFromAddress, [{
    key: "getStorageKeyByType",
    value: function getStorageKeyByType(objectType) {
      return this.allowedKeys.includes(objectType) ? objectType : this.defaultKey;
    }
  }, {
    key: "setAddressByType",
    value: function setAddressByType(objectType, value) {
      var key = this.getStorageKeyByType(objectType);

      if (value && value.addressId) {
        this.addresses = this.addresses.set(key, value);
      }

      return this;
    }
  }, {
    key: "getAddressByType",
    value: function getAddressByType(objectType) {
      var key = this.getStorageKeyByType(objectType);

      if (this.addresses.has(key)) {
        return this.addresses.get(key);
      }

      return null;
    }
  }, {
    key: "isRestorable",
    value: function isRestorable() {
      return this.storage && !!this.storage.getItem(this.key);
    }
  }, {
    key: "validateSavedAddresses",
    value: function validateSavedAddresses(addressObject) {
      var invalidContents = false;
      this.addresses = ImmutableMap(addressObject).reduce(function (acc, address, objectType) {
        if (address && address.addressId) {
          acc = acc.set(objectType, new EmailAddressRecord(address));
        } else {
          invalidContents = true;
        }

        return acc;
      }, ImmutableMap());

      if (invalidContents) {
        logError({
          error: new Error('Invalid address found in persisted from address'),
          extraData: {
            persistedData: this.addresses,
            storage: addressObject
          }
        });
        this.save();
      }
    }
  }, {
    key: "restore",
    value: function restore() {
      var addressObject;

      try {
        addressObject = this.storage.getItem(this.key);
        addressObject = JSON.parse(addressObject);
      } catch (error) {
        this.storage.removeItem(this.key);
        logError({
          error: new Error('Parsing failed for persisted from addresses'),
          extraData: {
            persistedData: this.addresses,
            storage: addressObject,
            error: error
          }
        });
        addressObject = null;
      }

      if (!addressObject) {
        return this;
      }

      this.validateSavedAddresses(addressObject);
      return this;
    }
  }, {
    key: "save",
    value: function save() {
      try {
        this.storage.setItem(this.key, JSON.stringify(this.addresses.toJS()));
      } catch (error) {
        this.addresses = ImmutableMap();
        logError({
          error: new Error('Error saving persisted from address'),
          extraData: {
            error: error,
            storage: this.addresses
          }
        });
      }

      return this;
    }
  }, {
    key: "invalidate",
    value: function invalidate(objectType) {
      var key = this.getStorageKeyByType(objectType);
      this.addresses = this.addresses.delete(key);
      this.save();
      return this;
    }
  }]);

  return PersistentFromAddress;
}();
export var getPersistentFromAddress = once(function () {
  var storage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.localStorage;
  return new PersistentFromAddress(storage);
});