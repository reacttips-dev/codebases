'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import SafeStorage from 'SafeStorage';
import PortalIdParser from 'PortalIdParser';
import { logError } from './utils';
var TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24;
var OPT_OUT_DURATION = TWENTY_FOUR_HOURS;

var PortalStorage = /*#__PURE__*/function () {
  function PortalStorage(key) {
    _classCallCheck(this, PortalStorage);

    this.key = key || "hs:social:" + PortalIdParser.get();
    this.fetch();
  }

  _createClass(PortalStorage, [{
    key: "fetch",
    value: function fetch() {
      var rawValue = SafeStorage.getItem(this.key);

      if (rawValue) {
        try {
          this.value = JSON.parse(SafeStorage.getItem(this.key));
        } catch (e) {
          logError(e);
        }
      }

      return this.value;
    }
  }, {
    key: "get",
    value: function get() {
      return this.value || {};
    }
  }, {
    key: "set",
    value: function set(obj) {
      var _this = this;

      this.value = Object.assign({}, this.value, {}, obj);
      Object.keys(this.value).forEach(function (k) {
        if (_this.value[k] === null || typeof _this.value[k] === 'undefined') {
          delete _this.value[k];
        }
      });
      SafeStorage.setItem(this.key, JSON.stringify(this.value));
    }
  }, {
    key: "clear",
    value: function clear() {
      return localStorage.removeItem(this.key);
    }
  }, {
    key: "hasOptedOut",
    value: function hasOptedOut() {
      return Boolean(this.get().ssOptOut && this.get().ssOptOut > new Date().valueOf() - OPT_OUT_DURATION);
    }
  }, {
    key: "hasJustOptedIn",
    value: function hasJustOptedIn() {
      return Boolean(this.get().ssOptIn && this.get().ssOptIn > new Date().valueOf() - 1000 * 30);
    }
  }, {
    key: "hasDismissedAccountExpirationMessage",
    value: function hasDismissedAccountExpirationMessage() {
      return Boolean(this.get().accountExpirationMessageDismissed && this.get().accountExpirationMessageDismissed > new Date().valueOf() - TWENTY_FOUR_HOURS);
    }
  }, {
    key: "hasDismissedAccountReauthMessage",
    value: function hasDismissedAccountReauthMessage() {
      return Boolean(this.get().accountReauthMessageDismissed && this.get().accountReauthMessageDismissed > new Date().valueOf() - TWENTY_FOUR_HOURS);
    }
  }]);

  return PortalStorage;
}();

export { PortalStorage as default };
var inst = new PortalStorage();

PortalStorage.getInstance = function () {
  return inst;
};