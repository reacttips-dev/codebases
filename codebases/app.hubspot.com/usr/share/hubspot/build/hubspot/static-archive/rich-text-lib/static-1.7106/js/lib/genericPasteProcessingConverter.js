'use es6';

import parseHTML from '../utils/parseHTML';
import { serializeStyles, parseStyles, transformStyles, styleTransformers } from '../utils/dom';

var stripThirdPartyClasses = function stripThirdPartyClasses(node) {
  var classNames = node.getAttribute('class');

  if (typeof classNames !== 'string') {
    return;
  }

  var validClasses = classNames.split(' ').filter(function (className) {
    return className.includes('hs-');
  });

  if (validClasses.length === 0) {
    node.removeAttribute('class');
    return;
  }

  node.setAttribute('class', validClasses.join(' '));
};

function transformNode(node, formatTransformMap, clearAllStyles, defaultStylesMap, defaultAttributesMap) {
  var newNode = node; // Transform the node type

  if (formatTransformMap[node.nodeName]) {
    newNode = document.createElement(formatTransformMap[node.nodeName]);
    Array.from(node.childNodes).forEach(function (child) {
      return newNode.appendChild(child.cloneNode(true));
    });
    node.parentNode.replaceChild(newNode, node);
  } // Clear node of all inline styles and classes


  if (clearAllStyles && newNode.style) {
    newNode.removeAttribute('style');
    stripThirdPartyClasses(newNode);
  } // Replace newlines with <br> in pre tags


  if (newNode.nodeName === 'PRE') {
    var html = newNode.innerHTML.replace(/\r?\n/g, '<br />');
    newNode.innerHTML = html;
  }

  if (newNode.nodeName !== '#text') {
    var styleAttribute = newNode && typeof newNode.getAttribute === 'function' ? newNode.getAttribute('style') || '' : ''; // Transform styles

    var stylesMap = transformStyles(parseStyles(styleAttribute), styleTransformers); // Add default styles of node

    if (defaultStylesMap[newNode.nodeName]) {
      // Set default styles if nothing is set already
      stylesMap = Object.assign({}, defaultStylesMap[newNode.nodeName], {}, stylesMap);
    }

    var serializedStyles = serializeStyles(stylesMap);

    if (serializedStyles) {
      newNode.setAttribute('style', serializedStyles);
    }
  }

  var defaultAttrs = defaultAttributesMap[newNode.nodeName];

  if (defaultAttrs) {
    Object.keys(defaultAttrs).forEach(function (attr) {
      newNode.setAttribute(attr, defaultAttrs[attr]);
    });
  }

  Array.from(newNode.childNodes).forEach(function (child) {
    return transformNode(child, formatTransformMap, clearAllStyles, defaultStylesMap, defaultAttributesMap);
  });
  return newNode;
}

export var getGenericPasteProcessingConverter = function getGenericPasteProcessingConverter() {
  var formatTransformMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var clearAllStyles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var defaultStylesMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var defaultAttributesMap = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return function (html) {
    if (Object.keys(formatTransformMap).length || clearAllStyles || Object.keys(defaultStylesMap).length || Object.keys(defaultAttributesMap).length) {
      var doc = parseHTML(html);
      Array.from(doc.childNodes).forEach(function (node) {
        return transformNode(node, formatTransformMap, clearAllStyles, defaultStylesMap, defaultAttributesMap);
      });
      return doc.outerHTML;
    }

    return html;
  };
};