'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import StyleDropdownPlugin from './StyleDropdownPlugin';
var fonts = [{
  text: 'Sans Serif',
  font: 'sans-serif',
  value: 'FONT-SANS-SERIF'
}, {
  text: 'Serif',
  font: 'serif',
  value: 'FONT-SERIF'
}, {
  text: 'Monospace',
  font: 'monospace',
  value: 'FONT-MONOSPACE'
}, {
  text: 'Georgia',
  font: 'Georgia',
  value: 'FONT-GEORGIA'
}, {
  text: 'Tahoma',
  font: 'Tahoma',
  value: 'FONT-TAHOMA'
}, {
  text: 'Trebuchet MS',
  font: "'Trebuchet MS'",
  value: 'FONT-TREBUCHET-MS'
}, {
  text: 'Verdana',
  font: 'Verdana',
  value: 'FONT-VERDANA'
}];

var styleFn = function styleFn(option) {
  return {
    fontFamily: option.font
  };
};

var matchDoubleQuotes = function matchDoubleQuotes(option) {
  return function (node) {
    return option.font.replace(/'/g, '"') === node.style.fontFamily;
  };
};

var tooltip = /*#__PURE__*/_jsx(FormattedHTMLMessage, {
  message: "draftPlugins.fontStyle.tooltip"
});

export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$dropdownClassNam = _ref.dropdownClassName,
      dropdownClassName = _ref$dropdownClassNam === void 0 ? 'font-dropdown' : _ref$dropdownClassNam,
      _ref$dropdownProps = _ref.dropdownProps,
      dropdownProps = _ref$dropdownProps === void 0 ? {} : _ref$dropdownProps;

  return StyleDropdownPlugin({
    options: fonts,
    styleFn: styleFn,
    placeholder: 'Sans Serif',
    matchFn: matchDoubleQuotes,
    dropdownClassName: dropdownClassName,
    dropdownProps: dropdownProps,
    tooltip: tooltip,
    testKey: 'font-styles-dropdown'
  });
});