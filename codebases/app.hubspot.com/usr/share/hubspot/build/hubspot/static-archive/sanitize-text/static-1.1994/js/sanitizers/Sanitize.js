'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { secureDocument, config as SanitizeConfig } from './SanitizeConfiguration';
import memoize from 'transmute/memoize';
import { removeStyles } from 'sanitize-text/transformers/removeStyles';
import { standardizeBlockQuoteStyling } from 'sanitize-text/transformers/standardizeBlockQuoteStyling';
import { removeInvalidAnchorProtocols } from 'sanitize-text/transformers/removeInvalidAnchorProtocols';
import { buildSanitizer } from './buildSanitizer';
import { addLinkTargetAttribute } from '../transformers/addLinkTargetAttribute';
export var hasImage = memoize(function (text) {
  var containsImageRegex = /(<img *src="(.*)"(\s)*(\/)?>)/;
  return containsImageRegex.test(text);
});
export var sanitize = memoize(function (text, config) {
  var transformers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var element = secureDocument.body;

  try {
    secureDocument.domain = window.location.hostname.indexOf('qa') >= 0 ? 'hubspotqa.com' : 'hubspot.com';
  } catch (e) {// IE11 needs to have this but it throws an error in Chrome.
  }

  var div = secureDocument.createElement('div');

  if (text && text !== '') {
    element.innerHTML = text;
    var newConfig = Object.assign({}, config);
    newConfig.transformers = [standardizeBlockQuoteStyling, removeStyles, addLinkTargetAttribute, removeInvalidAnchorProtocols].concat(_toConsumableArray(transformers)); // For specific documentation on the Sanitize.js library, config, or transformers, see: https://github.com/gbirke/Sanitize.js

    try {
      var sanitizer = buildSanitizer(newConfig);
      var fragment = sanitizer.clean_node(element).cloneNode(true);
      div.appendChild(fragment);
    } catch (e) {
      console.error(e);
    }
  }

  var isTextContentOnly = config === SanitizeConfig.TEXTONLY;
  return isTextContentOnly ? div.textContent : div.innerHTML;
});
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}