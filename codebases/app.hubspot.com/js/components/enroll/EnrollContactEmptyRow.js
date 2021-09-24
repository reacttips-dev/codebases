'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIIllustration from 'UIComponents/image/UIIllustration';

var EnrollContactEmptyRow = function EnrollContactEmptyRow() {
  return /*#__PURE__*/_jsx("tr", {
    children: /*#__PURE__*/_jsx("td", {
      colSpan: 2,
      children: /*#__PURE__*/_jsxs(UIFlex, {
        align: "center",
        justify: "center",
        direction: "column",
        children: [/*#__PURE__*/_jsx(UIIllustration, {
          name: "empty-state-charts",
          width: 150,
          className: "m-bottom-2"
        }), /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.enroll.table.noResults"
        })]
      })
    })
  });
};

export default EnrollContactEmptyRow;