'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UIFlex from 'UIComponents/layout/UIFlex';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';

var EnrollContactLoadingRow = function EnrollContactLoadingRow() {
  return /*#__PURE__*/_jsx("tr", {
    children: /*#__PURE__*/_jsx("td", {
      colSpan: 2,
      children: /*#__PURE__*/_jsx(UIFlex, {
        children: /*#__PURE__*/_jsx(UILoadingSpinner, {
          grow: true,
          minHeight: 150
        })
      })
    })
  });
};

export default EnrollContactLoadingRow;