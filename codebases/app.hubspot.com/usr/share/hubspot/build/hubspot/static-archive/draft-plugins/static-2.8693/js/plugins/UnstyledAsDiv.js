'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { createPlugin } from 'draft-extend';
export default createPlugin({
  blockToHTML: function blockToHTML(block) {
    var isAligned = block.data && block.data.align && block.data.align !== '';

    if (block.type === 'unstyled' && !isAligned && block.type !== 'atomic') {
      if (block.text.length > 0 && block.text.trim().length === 0) {
        return /*#__PURE__*/_jsx("br", {});
      }

      return {
        element: /*#__PURE__*/_jsx("div", {}),
        empty: /*#__PURE__*/_jsx("br", {})
      };
    }

    return undefined;
  }
});