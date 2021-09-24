'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import StyleDropdownPlugin from './StyleDropdownPlugin';
var sizes = [{
  text: '8',
  points: 8,
  value: 'FONT-SIZE-8'
}, {
  text: '9',
  points: 9,
  value: 'FONT-SIZE-9'
}, {
  text: '10',
  points: 10,
  value: 'FONT-SIZE-10'
}, {
  text: '11',
  points: 11,
  value: 'FONT-SIZE-11'
}, {
  text: '12',
  points: 12,
  value: 'FONT-SIZE-12'
}, {
  text: '14',
  points: 14,
  value: 'FONT-SIZE-14'
}, {
  text: '18',
  points: 18,
  value: 'FONT-SIZE-18'
}, {
  text: '24',
  points: 24,
  value: 'FONT-SIZE-24'
}, {
  text: '36',
  points: 36,
  value: 'FONT-SIZE-36'
}];

var styleFn = function styleFn(option) {
  var pixels = option.points * 4 / 3;
  var roundedPixels = Math.round(pixels * 10000) / 10000;
  return {
    fontSize: roundedPixels + "px",
    lineHeight: roundedPixels * 1.2 + "px"
  };
};

var matchFn = function matchFn(option) {
  return function (node) {
    if (!node.style.fontSize) {
      return false;
    }

    var initialValue = parseFloat(node.style.fontSize, 10);
    var isPixels = node.style.fontSize.indexOf('pt') === -1;
    var points = isPixels ? initialValue * 3 / 4 : initialValue;
    return Math.round(points) === option.points;
  };
};

var tooltip = /*#__PURE__*/_jsx(FormattedHTMLMessage, {
  message: "draftPlugins.sizeStyle.tooltip"
});

export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$dropdownClassNam = _ref.dropdownClassName,
      dropdownClassName = _ref$dropdownClassNam === void 0 ? '' : _ref$dropdownClassNam,
      _ref$dropdownProps = _ref.dropdownProps,
      dropdownProps = _ref$dropdownProps === void 0 ? {} : _ref$dropdownProps;

  return StyleDropdownPlugin({
    options: sizes,
    styleFn: styleFn,
    placeholder: 'Size',
    matchFn: matchFn,
    tooltip: tooltip,
    dropdownClassName: dropdownClassName,
    dropdownProps: dropdownProps,
    testKey: 'size-styles-dropdown'
  });
});