'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import SidekickExtensionInstallHelpers from 'ExtensionInstallHelpers.SidekickExtensionInstallHelpers';
import requiredData from 'customer-data-tracking/constants/requiredData';
var CHROME_EXTENSION_INSTALLED = requiredData.CHROME_EXTENSION_INSTALLED;

var isWordPress = function isWordPress() {
  return /(^|\?|&)wp=/.test(window.location.search);
};

export function get() {
  var _ref;

  return _ref = {}, _defineProperty(_ref, CHROME_EXTENSION_INSTALLED, SidekickExtensionInstallHelpers.hasExtension()), _defineProperty(_ref, 'wordpress-plugin', isWordPress()), _ref;
}