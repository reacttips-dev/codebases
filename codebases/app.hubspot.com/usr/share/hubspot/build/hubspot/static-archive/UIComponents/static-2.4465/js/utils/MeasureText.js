'use es6';

var MEASURABLE_PROPERTIES = ['-webkit-font-smoothing', 'border', 'border-bottom-left-radius', 'border-bottom-right-radius', 'border-bottom-style', 'border-bottom-width', 'border-collapse', 'border-image-outset', 'border-image-repeat', 'border-image-slice', 'border-image-width', 'border-left-color', 'border-left-style', 'border-left-width', 'border-right-color', 'border-right-style', 'border-right-width', 'border-top-left-radius', 'border-top-right-radius', 'border-top-style', 'border-top-width', 'box-sizing', 'font-family', 'font-size', 'font-style', 'font-variant', 'font-weight', 'line-height', 'margin', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'white-space', 'word-break', 'word-spacing', 'word-wrap'];
/**
 * @param {(HTMLTextAreaElement|HTMLInputElement)} node
 * @param {('width'|'height')} fixedDimension
 * @returns {HTMLElement}
 */

var getMeasureNode = function getMeasureNode(originalNode, fixedDimension, valueOverride) {
  var originalStyles = getComputedStyle(originalNode, null); // Patch for Firefox < 62: https://bugzilla.mozilla.org/show_bug.cgi?id=1467722

  if (!originalStyles) return originalNode;
  var measureNode = document.createElement(fixedDimension === 'width' ? 'pre' : 'span');
  MEASURABLE_PROPERTIES.forEach(function (property) {
    measureNode.style[property] = originalStyles[property];
  });
  measureNode.style[fixedDimension] = originalStyles[fixedDimension];
  measureNode.style.position = 'fixed'; // Prevent document layout from being recalculated (#6903)

  measureNode.appendChild(document.createTextNode((valueOverride != null ? valueOverride : originalNode.value || originalNode.placeholder || '') + " "));
  return measureNode;
};
/**
 * @param {(HTMLTextAreaElement|HTMLInputElement)} node
 * @param {('width'|'height')} fixedDimension
 * @returns {ClientRect}
 */


var computeTextBounds = function computeTextBounds(node, fixedDimension, valueOverride) {
  var _document = document,
      body = _document.body;
  var measureNode = getMeasureNode(node, fixedDimension, valueOverride);
  body.appendChild(measureNode);
  var bounds = measureNode.getBoundingClientRect();
  body.removeChild(measureNode);
  return bounds;
};
/**
 * @param {HTMLTextAreaElement} textareaNode
 * @returns {number} The height the given <textarea> would have if it could expand/shrink freely
 */


export function getTextHeight(textareaNode, valueOverride) {
  return computeTextBounds(textareaNode, 'width', valueOverride).height;
}
/**
 * @param {HTMLInputElement} inputNode
 * @param {?string} valueOverride A value to use instead of the input's actual value/placeholder
 * @returns {number} The width the given <input> would have if it could expand/shrink freely
 */

export function getTextWidth(inputNode, valueOverride) {
  return computeTextBounds(inputNode, 'height', valueOverride).width;
}