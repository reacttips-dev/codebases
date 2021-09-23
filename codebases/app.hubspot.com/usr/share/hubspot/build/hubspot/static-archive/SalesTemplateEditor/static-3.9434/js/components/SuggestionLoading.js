'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import { List, Range } from 'immutable';
import UIFlex from 'UIComponents/layout/UIFlex';
import Small from 'UIComponents/elements/Small';
export default function SuggestionLoading() {
  return /*#__PURE__*/_jsxs(UIFlex, {
    align: "center",
    children: [/*#__PURE__*/_jsx("div", {
      className: "suggestion-loading",
      children: List(Range(0, 5)).map(function (index) {
        return /*#__PURE__*/_jsx("div", {
          className: "circle",
          children: /*#__PURE__*/_jsx("div", {
            className: "inner"
          })
        }, "loading-circle-" + index);
      })
    }), /*#__PURE__*/_jsx(Small, {
      use: "help",
      className: "m-left-3",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "templateEditor.suggestions.loading"
      })
    })]
  });
}