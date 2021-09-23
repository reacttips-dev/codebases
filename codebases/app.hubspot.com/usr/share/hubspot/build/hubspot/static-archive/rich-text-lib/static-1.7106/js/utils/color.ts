import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
export var isValidHex = function isValidHex(hex) {
  if (hex && typeof hex === 'string') {
    return /^#([0-9A-F]{6}|[0-9A-F]{3})$/i.test(hex);
  }

  return false;
};
export var convertColorBitToHex = function convertColorBitToHex(color) {
  var hex = Number(color).toString(16);

  if (hex.length < 2) {
    hex = "0" + hex;
  }

  return hex;
};
export var convertRgbToHex = function convertRgbToHex(_ref) {
  var r = _ref.r,
      g = _ref.g,
      b = _ref.b;
  var red = convertColorBitToHex(r);
  var green = convertColorBitToHex(g);
  var blue = convertColorBitToHex(b);
  var hex = "#" + red + green + blue;

  if (!isValidHex(hex)) {
    throw new Error('RGB value passed to convertRgbToHex results in invalid hex value.');
  }

  return hex;
};
export var RGB_PATTERN = /rgba?\((\d+), (\d+), (\d+),? ?(\d\.?\d?)?\)/;
export var convertRgbStringToHex = function convertRgbStringToHex(rgb) {
  var match = rgb.match(RGB_PATTERN);

  if (!match) {
    throw new Error('Invalid RGB string passed to convertRgbStringToHex');
  }

  var _match = _slicedToArray(match, 5),
      __fullMatch = _match[0],
      r = _match[1],
      g = _match[2],
      b = _match[3],
      __a = _match[4];

  return convertRgbToHex({
    r: r,
    g: g,
    b: b
  });
};