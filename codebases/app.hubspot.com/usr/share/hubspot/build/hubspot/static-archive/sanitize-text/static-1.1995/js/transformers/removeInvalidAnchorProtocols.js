'use es6'; // eslint-disable-next-line no-script-url

var BLOCKLISTED_PROTOCOLS = ['javascript:']; // Sanitize any anchor tags that are not external links. This prevents any XSS, see
// https://issues.hubspotcentral.com/browse/HMSP-2657

export var removeInvalidAnchorProtocols = function removeInvalidAnchorProtocols(_ref) {
  var node = _ref.node;

  if (!node || !node.href || node.nodeName !== 'A' || !BLOCKLISTED_PROTOCOLS.includes(node.protocol)) {
    return null;
  }

  var replacementSpan = document.createElement('span');
  replacementSpan.innerText = node.innerText;
  return {
    node: replacementSpan
  };
};