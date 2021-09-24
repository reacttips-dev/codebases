'use es6';

var BLANK_TARGET = '_blank';
export var openLinksInNewTab = function openLinksInNewTab(_ref) {
  var node = _ref.node,
      node_name = _ref.node_name;

  if (node_name === 'a' && node && node.attributes && node.getAttribute('target') !== BLANK_TARGET) {
    node.setAttribute('target', BLANK_TARGET);
    return {
      node: node
    };
  }

  return null;
};