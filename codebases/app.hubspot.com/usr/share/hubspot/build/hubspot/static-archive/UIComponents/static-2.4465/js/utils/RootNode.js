'use es6';

var defaultNode = null;
export var setDefaultNode = function setDefaultNode(node) {
  defaultNode = node;
};
export var getDefaultNode = function getDefaultNode() {
  return defaultNode || document.body;
};