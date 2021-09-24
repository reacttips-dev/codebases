'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
export default (function (name, options) {
  return /*#__PURE__*/_jsx(FormattedHTMLMessage, {
    message: "draftSmartDetections.suggestions.rules." + name,
    options: options
  });
});