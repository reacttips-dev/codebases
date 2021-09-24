'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import { salesProUpgradePage } from 'sales-modal/lib/links';
import UIButton from 'UIComponents/button/UIButton';
import ComponentWithTarget from './ComponentWithTarget';
var UIButtonWithTarget = ComponentWithTarget(UIButton);
export default function SequencesUpsell() {
  return /*#__PURE__*/_jsxs("div", {
    className: "sequences-upsell-state enrollment-progress enrollment-error text-center p-all-10",
    children: [/*#__PURE__*/_jsx("h1", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequencesUpsell.header"
      })
    }), /*#__PURE__*/_jsx("p", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequencesUpsell.automateWithSequences"
      })
    }), /*#__PURE__*/_jsx(UIButtonWithTarget, {
      use: "primary",
      href: salesProUpgradePage(),
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequencesUpsell.learnMore"
      })
    })]
  });
}