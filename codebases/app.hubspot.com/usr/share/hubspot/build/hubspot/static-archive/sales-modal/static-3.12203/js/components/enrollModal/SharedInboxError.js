'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import { CANDY_APPLE } from 'HubStyleTokens/colors';
import UIIcon from 'UIComponents/icon/UIIcon';
import UILink from 'UIComponents/link/UILink';
import { emailIntegrationSettings } from 'sales-modal/lib/links';

function SharedInboxError(_ref) {
  var inboxAddress = _ref.inboxAddress;
  return /*#__PURE__*/_jsxs("div", {
    className: "shared-inbox-error enrollment-error inbox-connect text-center p-all-5",
    children: [/*#__PURE__*/_jsx(UIIcon, {
      name: "warning",
      color: CANDY_APPLE
    }), /*#__PURE__*/_jsx("h1", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesModal.sharedInboxError.header"
      })
    }), /*#__PURE__*/_jsx("p", {
      children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: "salesModal.sharedInboxError.body_jsx",
        options: {
          sharedInboxAddress: inboxAddress,
          href: emailIntegrationSettings()
        },
        elements: {
          b: 'b',
          Link: UILink
        }
      })
    })]
  });
}

export default SharedInboxError;