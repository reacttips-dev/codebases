'use es6';

export var hexToRGB = function hexToRGB(hexColorValue) {
  var colorValue = hexColorValue.slice(1);

  if (colorValue.length === 3) {
    colorValue = colorValue.replace(/(.)/g, '$1$1');
  }

  var r = parseInt(colorValue.substr(0, 2), 16);
  var g = parseInt(colorValue.substr(2, 2), 16);
  var b = parseInt(colorValue.substr(4, 2), 16);
  return {
    r: r,
    g: g,
    b: b
  };
};