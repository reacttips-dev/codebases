'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import ColorPlugin from './ColorPlugin';

var tooltip = /*#__PURE__*/_jsx(FormattedHTMLMessage, {
  message: "draftPlugins.backgroundColorPlugin.tooltip"
});

export default ColorPlugin({
  getStyleName: function getStyleName(hexString) {
    return "BACKGROUND-COLOR-" + hexString;
  },
  cssProperty: 'background-color',
  tooltip: tooltip
});