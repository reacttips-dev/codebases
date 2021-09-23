'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIResultsMessage from 'UIComponents/results/UIResultsMessage';
import { sequences } from 'sales-modal/lib/links';
import ComponentWithTarget from 'sales-modal/components/enrollModal/ComponentWithTarget';
import H2 from 'UIComponents/elements/headings/H2';
var UIButtonWithTarget = ComponentWithTarget(UIButton);
export default function SalesUpsell() {
  return /*#__PURE__*/_jsx(UIFlex, {
    align: "center",
    justify: "center",
    children: /*#__PURE__*/_jsxs(UIResultsMessage, {
      illustration: "sales-professional",
      illustrationProps: {
        width: 150
      },
      title: /*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "salesUpsell.header"
        })
      }),
      children: [/*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "salesUpsell.automateWithSequences"
        })
      }), /*#__PURE__*/_jsx(UIButtonWithTarget, {
        use: "primary",
        href: sequences(),
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "salesUpsell.learnMore"
        })
      })]
    })
  });
}