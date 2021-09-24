'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { _isUsingChrome } from '../utils/isUsingChrome';
import { isFunction } from '../utils/Utils';

var ChromeExtensionInstallHelpers = /*#__PURE__*/function () {
  function ChromeExtensionInstallHelpers() {
    _classCallCheck(this, ChromeExtensionInstallHelpers);

    this.authorizedWebstoreDomain = null;
    this.extensionUrl = null;
    this.isUsingChrome = _isUsingChrome();
    this._isExtensionInstalled = false;
    this.setup();
  } // Deprecated: no longer necessary to have a mock install process, since tryExtensionInstall just opens a new window.


  _createClass(ChromeExtensionInstallHelpers, [{
    key: "installDebug",
    value: function installDebug() {
      return false;
    }
  }, {
    key: "onInstallSuccess",
    value: function onInstallSuccess(callback) {
      var _this = this;

      return function () {
        _this._isExtensionInstalled = true;

        if (isFunction(callback)) {
          callback();
        }
      };
    }
  }, {
    key: "tryExtensionInstall",
    value: function tryExtensionInstall(onSuccess) {
      onSuccess = this.onInstallSuccess(onSuccess);
      window.open(this.extensionUrl, '_blank');
      return onSuccess();
    }
  }]);

  return ChromeExtensionInstallHelpers;
}();

export default ChromeExtensionInstallHelpers;