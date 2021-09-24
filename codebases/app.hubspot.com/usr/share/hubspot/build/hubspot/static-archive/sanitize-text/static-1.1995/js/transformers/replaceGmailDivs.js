'use es6';

import { secureDocument } from '../sanitizers/SanitizeConfiguration';
export var replaceGmailDivs = function replaceGmailDivs(_ref) {
  var node = _ref.node,
      node_name = _ref.node_name;

  if (node_name === 'div' && node && node.classList && node.classList.contains('gmail_default')) {
    var span = secureDocument.createElement('span');
    Object.keys(node.attributes).forEach(function (key) {
      var attribute = node.attributes[key];
      span.setAttribute(attribute.nodeName, attribute.nodeValue);
    });
    span.innerHTML = node.innerHTML.trim();
    return {
      node: span
    };
  }

  return null;
};