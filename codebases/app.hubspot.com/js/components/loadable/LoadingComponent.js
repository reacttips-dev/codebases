'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UIFlex from 'UIComponents/layout/UIFlex';
export default function LoadingComponent() {
  return /*#__PURE__*/_jsx(UIFlex, {
    justify: "center",
    align: "center",
    style: {
      height: '100%',
      position: 'absolute'
    },
    children: /*#__PURE__*/_jsx(UILoadingSpinner, {
      grow: true
    })
  });
}