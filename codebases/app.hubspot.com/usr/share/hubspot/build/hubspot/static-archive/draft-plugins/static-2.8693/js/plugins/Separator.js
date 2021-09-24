'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { createPlugin } from 'draft-extend';

var Separator = function Separator() {
  return /*#__PURE__*/_jsx("div", {
    className: "rich-text-separator"
  });
};

export default createPlugin({
  displayName: 'Separator',
  buttons: [Separator]
});