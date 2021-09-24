'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import ColorPlugin from './ColorPlugin';

var tooltip = /*#__PURE__*/_jsx(FormattedHTMLMessage, {
  message: "draftPlugins.textColorPlugin.tooltip"
});

export default ColorPlugin({
  tooltip: tooltip
});