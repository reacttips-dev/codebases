import { getBorderRadiusNumber, getBoundingVisibleRect, getSpacedRect } from './elementUtils';
/**
 * Generate SVG path for pulser background overlay and highlighted boarder
 *
 * For pulser background overlay:
 *   Two rectangle will be drawn, the background overlay will be the difference set of A to B:
 *      A. Rectangle with full screen size
 *      B. Rectangle covered highlighted area
 *
 * For highlighted boarder:
 *   A rectangle with solid line will be drawn around highlighted area
 *
 * M,V,H are all SVG path commands:
 * See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#path_commands}
 *
 * @param {Object} targetRect - The position and size info of highlighted area
 * @param {number} targetRect.width - width of the highlighted area
 * @param {number} targetRect.height - height of the highlighted area
 * @param {number} targetRect.x - x axis offset pixels
 * @param {number} targetRect.y - y axis offset pixels
 * @param {number} targetRect.r - radius pixels
 */

export var generatePulserPaths = function generatePulserPaths(_ref) {
  var width = _ref.width,
      height = _ref.height,
      _ref$x = _ref.x,
      x = _ref$x === void 0 ? 0 : _ref$x,
      _ref$y = _ref.y,
      y = _ref$y === void 0 ? 0 : _ref$y,
      _ref$r = _ref.r,
      r = _ref$r === void 0 ? 0 : _ref$r;
  var _window = window,
      w = _window.innerWidth,
      h = _window.innerHeight;
  var pulserBorder = [// Draw a rectangle around the target
  "M" + (x + r) + "," + y + "a" + r + "," + r + ",0,0,0-" + r + "," + r, "V" + (height + y - r) + "a" + r + "," + r + ",0,0,0," + r + "," + r, "H" + (width + x - r) + "a" + r + "," + r + ",0,0,0," + r + "-" + r, "V" + (y + r) + "a" + r + "," + r + ",0,0,0-" + r + "-" + r + "Z"].join('');
  return {
    border: pulserBorder,
    // Draw background overlay outside the target rectangle
    overlay: "M" + w + "," + h + "H0V0H" + w + "V" + h + "Z" + pulserBorder
  };
};
export var getPulserPaths = function getPulserPaths(target, scrollParent, _ref2) {
  var padding = _ref2.padding,
      distance = _ref2.distance,
      _ref2$radius = _ref2.radius,
      radius = _ref2$radius === void 0 ? getBorderRadiusNumber(target) : _ref2$radius;
  var pulserPaths = {
    start: {},
    end: {}
  };
  var targetRect = getBoundingVisibleRect(target, scrollParent, radius);
  var pulserStartRect = getSpacedRect(targetRect, padding);
  pulserPaths.start = generatePulserPaths(pulserStartRect);

  if (distance) {
    var pulserEndRect = getSpacedRect(targetRect, padding + distance);
    pulserPaths.end = generatePulserPaths(pulserEndRect);
  }

  return pulserPaths;
};