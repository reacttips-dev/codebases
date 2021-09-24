'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import links from 'draft-smart-detections/rules/lib/links';
import UIButton from 'UIComponents/button/UIButton';

var toI18nText = function toI18nText(name) {
  return I18n.text("draftSmartDetections.suggestions.rules.documentLinkDescription." + name);
};

export default (function () {
  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx("p", {
      className: "m-bottom-3",
      children: toI18nText('includeADocument')
    }), /*#__PURE__*/_jsx(UIButton, {
      use: "tertiary-light",
      size: "small",
      href: links.documents(),
      target: "_blank",
      children: toI18nText('uploadADocument')
    })]
  });
});