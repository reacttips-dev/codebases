'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FlydownCard from './FlydownCard';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIIllustration from 'UIComponents/image/UIIllustration';
import Big from 'UIComponents/elements/Big';

function FactCard(_ref) {
  var text = _ref.text;
  return /*#__PURE__*/_jsxs(FlydownCard, {
    header: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.contextualFlydown.didYouKnow"
    }),
    iconName: "sprocket",
    children: [/*#__PURE__*/_jsx(UIIllustration, {
      className: "m-bottom-8",
      height: 100,
      name: "idea",
      width: "100%"
    }), /*#__PURE__*/_jsx("div", {
      className: "text-center",
      children: /*#__PURE__*/_jsx(Big, {
        use: "help",
        children: text
      })
    })]
  });
}

export default FactCard;