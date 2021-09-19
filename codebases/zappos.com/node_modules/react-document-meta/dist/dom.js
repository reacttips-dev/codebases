'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canUseDOM = undefined;
exports.removeDocumentMeta = removeDocumentMeta;
exports.insertDocumentMeta = insertDocumentMeta;

var _utils = require('./utils');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var canUseDOM = exports.canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

function removeNode(node) {
  node.parentNode.removeChild(node);
}

function removeDocumentMeta() {
  (0, _utils.forEach)(document.querySelectorAll('head [data-rdm]'), removeNode);
}

function insertDocumentMetaNode(entry) {
  var tagName = entry.tagName,
      attr = _objectWithoutProperties(entry, ['tagName']);

  var newNode = document.createElement(tagName);
  for (var prop in attr) {
    if (entry.hasOwnProperty(prop)) {
      newNode.setAttribute(prop, entry[prop]);
    }
  }
  newNode.setAttribute('data-rdm', '');
  document.getElementsByTagName('head')[0].appendChild(newNode);
}

function insertDocumentMeta(nodes) {
  removeDocumentMeta();

  (0, _utils.forEach)(nodes, insertDocumentMetaNode);
}
