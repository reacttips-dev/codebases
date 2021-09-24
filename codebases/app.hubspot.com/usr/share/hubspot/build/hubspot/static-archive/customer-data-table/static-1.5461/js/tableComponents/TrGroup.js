'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
var TrGroupMemo = /*#__PURE__*/memo(function (_ref) {
  var children = _ref.children;
  return children;
});

var TrGroup = function TrGroup(props) {
  return /*#__PURE__*/_jsx(TrGroupMemo, Object.assign({}, props));
};

export default TrGroup;