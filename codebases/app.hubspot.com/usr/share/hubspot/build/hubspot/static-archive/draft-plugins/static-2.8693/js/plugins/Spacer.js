'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { createPlugin } from 'draft-extend';
export default createPlugin({
  buttons: function buttons() {
    return /*#__PURE__*/_jsx("div", {
      className: "toolbar-spacer",
      style: {
        flexGrow: 1
      }
    });
  }
});