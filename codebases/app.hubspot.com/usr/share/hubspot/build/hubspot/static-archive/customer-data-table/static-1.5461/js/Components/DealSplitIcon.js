'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIIcon from 'UIComponents/icon/UIIcon';

var DealSplitIcon = function DealSplitIcon() {
  return /*#__PURE__*/_jsx(UITooltip, {
    title: /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx(UIIcon, {
        className: "m-right-1",
        name: "splitModule"
      }), /*#__PURE__*/_jsx(FormattedMessage, {
        message: "customerDataTable.cells.profileLink.dealSplit.tooltip"
      })]
    }),
    children: /*#__PURE__*/_jsx(UIIcon, {
      className: "m-x-0 m-left-1",
      name: "splitModule"
    })
  });
};

export default DealSplitIcon;