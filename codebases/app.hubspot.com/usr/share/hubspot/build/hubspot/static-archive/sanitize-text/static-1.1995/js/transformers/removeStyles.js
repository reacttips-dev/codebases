'use es6';

export var BLOCKLISTED_STYLES = ['background-image', 'bottom', 'clear', 'float', 'left', 'opacity', 'position', 'right', 'top', 'visibility', 'white-space', 'z-index'];
export var removeStyles = function removeStyles(_ref) {
  var node = _ref.node;

  if (node && node.style && node.style.length > 0 && node.style.removeProperty) {
    if (node.style.fontSize === '0px') {
      node.style.setProperty('font-size', '14px');
    }

    if (node.style.lineHeight === '0') {
      node.style.setProperty('line-height', 1);
    }

    if (node.style.color === 'transparent') {
      node.style.removeProperty('color');
    }

    BLOCKLISTED_STYLES.forEach(function (style) {
      return node.style.removeProperty(style);
    });
    return {
      node: node
    };
  }

  return null;
};