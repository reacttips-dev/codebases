'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UIFlex from 'UIComponents/layout/UIFlex';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
export default function EnrollModalLoading() {
  return /*#__PURE__*/_jsx(UIFlex, {
    justify: "center",
    align: "center",
    className: "sequences-enroll-modal-loading m-top-6",
    children: /*#__PURE__*/_jsx(UILoadingSpinner, {})
  });
}