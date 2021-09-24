'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { NavMarker } from 'react-rhumb';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIIllustration from 'UIComponents/image/UIIllustration';

var OutBoxEmptyState = function OutBoxEmptyState() {
  return /*#__PURE__*/_jsxs(UIFlex, {
    className: "outbox-empty-state",
    direction: "column",
    align: "center",
    justify: "start",
    children: [/*#__PURE__*/_jsx(NavMarker, {
      name: "OUTBOX_LOAD"
    }), /*#__PURE__*/_jsx(UIIllustration, {
      name: "empty-state-charts",
      className: "m-bottom-4",
      width: 200
    }), /*#__PURE__*/_jsx(FormattedMessage, {
      message: "outbox.empty.content"
    })]
  });
};

export default OutBoxEmptyState;