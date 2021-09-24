'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import H2 from 'UIComponents/elements/headings/H2';
import UIModal from 'UIComponents/dialog/UIModal';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIIllustration from 'UIComponents/image/UIIllustration';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogHeaderImage from 'UIComponents/dialog/UIDialogHeaderImage';
import FormattedMessage from 'I18n/components/FormattedMessage';
export var MarketingEventModalPresentational = function MarketingEventModalPresentational(_ref) {
  var deny = _ref.deny,
      isAdmin = _ref.isAdmin,
      confirm = _ref.confirm;
  return /*#__PURE__*/_jsxs(UIModal, {
    use: "info",
    width: 540,
    children: [/*#__PURE__*/_jsx(UIDialogHeaderImage, {
      offsetBottom: -23,
      offsetTop: 56,
      children: /*#__PURE__*/_jsx(UIIllustration, {
        alt: "Illustration of marketing event lanyard",
        name: "marketing-events-modal",
        width: 150
      })
    }), /*#__PURE__*/_jsxs(UIDialogHeader, {
      children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: deny
      }), /*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "zeroStates.marketingEvents.modal.title"
        })
      })]
    }), /*#__PURE__*/_jsx(UIDialogBody, {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "zeroStates.marketingEvents.modal.body"
      })
    }), /*#__PURE__*/_jsxs(UIDialogFooter, {
      align: "center",
      children: [/*#__PURE__*/_jsx(UITooltip, {
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "zeroStates.marketingEvents.modal.adminTooltip"
        }),
        disabled: isAdmin,
        children: /*#__PURE__*/_jsx(UIButton, {
          use: "primary",
          onClick: confirm,
          disabled: !isAdmin,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "zeroStates.marketingEvents.modal.confirmCTA"
          })
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        use: "secondary",
        onClick: deny,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "zeroStates.marketingEvents.modal.refuseCTA"
        })
      })]
    })]
  });
};