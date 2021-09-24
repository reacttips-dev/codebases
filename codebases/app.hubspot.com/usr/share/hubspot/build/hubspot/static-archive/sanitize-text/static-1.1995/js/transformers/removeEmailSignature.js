'use es6';

import { secureDocument } from '../sanitizers/SanitizeConfiguration';
export var GMAIL_SIGNATURE = 'gmail_signature';
var HS_SIGNATURE = 'hs_signature'; // gmail class is covered separately

export var SIGNATURE_CLASSLIST = [// HubSpot
HS_SIGNATURE];

var hasSignatureClass = function hasSignatureClass(classList) {
  return classList && classList.contains && SIGNATURE_CLASSLIST.some(function (className) {
    return classList.contains(className);
  });
};

export var getNodeHasContent = function getNodeHasContent(node) {
  return Boolean(node && node.innerHTML && node.innerHTML.length);
};
/**
 * Users can insert content into the gmail_signature div, in situations where
 * all the content is in that div (i.e. no siblings) we should display the signature
 */

var isGmailSignatureAndHasSibling = function isGmailSignatureAndHasSibling(node) {
  return node.classList && node.classList.contains && node.classList.contains(GMAIL_SIGNATURE) && (getNodeHasContent(node.nextElementSibling) || getNodeHasContent(node.previousElementSibling));
};

export var removeEmailSignature = function removeEmailSignature(_ref) {
  var node = _ref.node;
  var classList = node.classList;
  var shouldRemoveSignature = isGmailSignatureAndHasSibling(node) || hasSignatureClass(classList);

  if (shouldRemoveSignature) {
    var span = secureDocument.createElement('span');
    span.innerHTML = '';
    return {
      node: span
    };
  }

  return null;
};