'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';

function CalleeSelectMessage(_ref) {
  var message = _ref.message,
      className = _ref.className;
  return /*#__PURE__*/_jsx("div", {
    className: "p-x-3 p-y-5 " + className,
    children: message
  });
}

export default /*#__PURE__*/memo(CalleeSelectMessage);