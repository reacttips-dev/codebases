'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { NavMarker } from 'react-rhumb';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIIllustration from 'UIComponents/image/UIIllustration';

var OutboxErrorState = function OutboxErrorState() {
  return /*#__PURE__*/_jsxs(UIFlex, {
    className: "p-top-4",
    direction: "column",
    align: "center",
    justify: "start",
    children: [/*#__PURE__*/_jsx(NavMarker, {
      name: "OUTBOX_ERROR"
    }), /*#__PURE__*/_jsx(UIIllustration, {
      name: "errors/general",
      className: "m-bottom-4",
      width: 200
    }), /*#__PURE__*/_jsx(FormattedMessage, {
      message: "outbox.error"
    })]
  });
};

export default OutboxErrorState;