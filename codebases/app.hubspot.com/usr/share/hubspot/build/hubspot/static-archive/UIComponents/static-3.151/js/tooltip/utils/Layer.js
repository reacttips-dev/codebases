'use es6';

import { JUPITER_LAYER } from 'HubStyleTokens/sizes';
var DEFAULT_ZINDEX = parseInt(JUPITER_LAYER, 10);
/**
 * @param {HTMLElement} rootNode the container the new element will be appended to
 * @param {string} id
 * @param {number} zIndex
 * @param {string} [className]
 * @returns {HTMLElement}
 */

export var makeFloatyLayerElement = function makeFloatyLayerElement(rootNode, id, zIndex, className) {
  var newLayerElement = document.createElement('div');
  newLayerElement.id = id;
  newLayerElement.style.zIndex = zIndex || DEFAULT_ZINDEX;
  newLayerElement.style.position = 'absolute';
  newLayerElement.style.top = '0px';
  newLayerElement.style.left = '0px'; // For backward compatibility with some selectors downstream

  newLayerElement.className = 'tether-element';
  if (className) newLayerElement.classList.add(className); // Prevent auto-focused content from triggering unwanted scrolling on first render

  var documentScrollPos = rootNode.ownerDocument.documentElement.scrollTop;
  newLayerElement.style.transform = "translate3d(0px, " + documentScrollPos + "px, 0px)";
  rootNode.appendChild(newLayerElement);
  return newLayerElement;
};