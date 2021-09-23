'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIIllustration from 'UIComponents/image/UIIllustration';
import H4 from 'UIComponents/elements/headings/H4';

function OutboxTableNoMoreResultsState() {
  return /*#__PURE__*/_jsx("tr", {
    children: /*#__PURE__*/_jsx("td", {
      colSpan: 4,
      children: /*#__PURE__*/_jsxs(UIFlex, {
        align: "center",
        justify: "center",
        direction: "column",
        children: [/*#__PURE__*/_jsx(UIIllustration, {
          name: "sunny",
          width: 125,
          className: "m-y-8"
        }), /*#__PURE__*/_jsx(H4, {
          className: "m-bottom-8",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "outbox.table.noMoreResults"
          })
        })]
      })
    })
  });
}

export default OutboxTableNoMoreResultsState;