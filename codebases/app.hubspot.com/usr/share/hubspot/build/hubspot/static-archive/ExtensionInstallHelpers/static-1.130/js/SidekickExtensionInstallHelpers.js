'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { objectDoesExist } from './utils/Utils';
import ChromeExtensionInstallHelpers from './lib/ChromeExtensionInstallHelpers';
import ChromeExtension from './constants/ChromeExtension';

var _hasExtension = function _hasExtension() {
  return objectDoesExist(window, ['SIG_EXT']);
};

var SidekickExtensionInstallHelpers = /*#__PURE__*/function (_ChromeExtensionInsta) {
  _inherits(SidekickExtensionInstallHelpers, _ChromeExtensionInsta);

  function SidekickExtensionInstallHelpers() {
    _classCallCheck(this, SidekickExtensionInstallHelpers);

    return _possibleConstructorReturn(this, _getPrototypeOf(SidekickExtensionInstallHelpers).apply(this, arguments));
  }

  _createClass(SidekickExtensionInstallHelpers, [{
    key: "setup",
    value: function setup() {
      var ChromeExtensionData = ChromeExtension.sidekick;
      this.extensionUrl = ChromeExtensionData.extensionUrl;
      this._isExtensionInstalled = _hasExtension();
    }
  }, {
    key: "hasExtension",
    value: function hasExtension() {
      return this._isExtensionInstalled || _hasExtension();
    }
  }]);

  return SidekickExtensionInstallHelpers;
}(ChromeExtensionInstallHelpers);

export default new SidekickExtensionInstallHelpers();