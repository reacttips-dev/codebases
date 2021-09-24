'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UIButton from 'UIComponents/button/UIButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIMatchTextArea from 'UIComponents/input/UIMatchTextArea';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIAlert from 'UIComponents/alert/UIAlert';
import UILink from 'UIComponents/link/UILink';
import PortalIdParser from 'PortalIdParser';

function BulkSetMarketingContactsDialog(props) {
  var nonMarketingCount = props.nonMarketingCount,
      onReject = props.onReject,
      isOverLimit = props.isOverLimit,
      selectionCount = props.selectionCount,
      marketingCount = props.marketingCount,
      handleMatch = props.handleMatch,
      handleChecked = props.handleChecked,
      handleConfirm = props.handleConfirm,
      allSelected = props.allSelected,
      isFilterApplied = props.isFilterApplied,
      applyToAll = props.applyToAll,
      isMatched = props.isMatched,
      pendingCount = props.pendingCount;
  var isApplyToAllGuardSatisfied = allSelected && !isFilterApplied ? applyToAll : true;

  var accountAndBillingLink = /*#__PURE__*/_jsx(UILink, {
    external: true,
    href: "/account-and-billing/" + PortalIdParser.get() + "/usage",
    children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "marketing-contacts-ui.bulkSetMarketingPrompt.link"
    })
  });

  if (nonMarketingCount === 0 && pendingCount === 0) {
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx(UIDialogBody, {
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetMarketingPrompt.noContactsToUpdate"
        })
      }), /*#__PURE__*/_jsx(UIDialogFooter, {
        children: /*#__PURE__*/_jsx(UIButton, {
          onClick: onReject,
          use: "tertiary-light",
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "marketing-contacts-ui.bulkSetMarketingPrompt.rejectLabel"
          })
        })
      })]
    });
  }

  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsxs(UIDialogBody, {
      children: [isOverLimit && /*#__PURE__*/_jsxs(UIAlert, {
        type: "warning",
        use: "inline",
        className: "m-bottom-4",
        titleText: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetMarketingPrompt.overlimitAlert.title"
        }),
        children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetMarketingPrompt.overlimitAlert.body"
        }), ' ', accountAndBillingLink]
      }), nonMarketingCount !== selectionCount && /*#__PURE__*/_jsx("p", {
        className: "m-bottom-4",
        "data-selenium-id": "not-matching",
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetMarketingPrompt.notUpdating",
          options: {
            count: marketingCount
          }
        })
      }), nonMarketingCount > 0 && /*#__PURE__*/_jsx("p", {
        className: "m-bottom-4",
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetMarketingPrompt.updating",
          options: {
            count: nonMarketingCount
          }
        })
      }), pendingCount > 0 && /*#__PURE__*/_jsx("p", {
        className: "m-bottom-4",
        "data-selenium-id": "pending",
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetMarketingPrompt.undoing",
          options: {
            count: pendingCount
          }
        })
      }), !isOverLimit && /*#__PURE__*/_jsxs("p", {
        className: "m-bottom-4",
        children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetMarketingPrompt.billingInfo",
          options: {
            count: nonMarketingCount
          }
        }), ' ', accountAndBillingLink]
      }), nonMarketingCount >= 0 && /*#__PURE__*/_jsx(UIFormControl, {
        className: "m-bottom-4 m-left-0",
        label: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetMarketingPrompt.matchedMessage",
          options: {
            count: nonMarketingCount
          }
        }),
        children: /*#__PURE__*/_jsx(UIMatchTextArea, {
          match: String(nonMarketingCount + pendingCount),
          onMatchedChange: handleMatch,
          size: "xxl",
          "data-selenium-test": "set-marketable-dialog-match",
          autoFocus: true
        })
      }), allSelected && !isFilterApplied && /*#__PURE__*/_jsx(UIFormControl, {
        required: true,
        children: /*#__PURE__*/_jsx(UICheckbox, {
          id: "apply-to-all-checkbox",
          checked: applyToAll,
          onChange: handleChecked,
          className: "m-bottom-2",
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "marketing-contacts-ui.bulkSetMarketingPrompt.confirmApplyToAll"
          })
        })
      })]
    }), /*#__PURE__*/_jsxs(UIDialogFooter, {
      children: [/*#__PURE__*/_jsx(UIButton, {
        "data-selenium-test": "set-marketable-dialog-confirm-button",
        "data-confirm-button": "accept",
        onClick: handleConfirm,
        use: "primary",
        disabled: !isMatched || !isApplyToAllGuardSatisfied,
        autoFocus: true,
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetMarketingPrompt.confirmLabel"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        onClick: onReject,
        use: "tertiary-light",
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetMarketingPrompt.rejectLabel"
        })
      })]
    })]
  });
}

var propTypes = {
  allSelected: PropTypes.bool.isRequired,
  applyToAll: PropTypes.bool.isRequired,
  handleChecked: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  handleMatch: PropTypes.func.isRequired,
  isFilterApplied: PropTypes.bool.isRequired,
  isMatched: PropTypes.bool.isRequired,
  isOverLimit: PropTypes.bool.isRequired,
  marketingCount: PropTypes.number.isRequired,
  nonMarketingCount: PropTypes.number.isRequired,
  onReject: PropTypes.func.isRequired,
  selectionCount: PropTypes.number.isRequired,
  pendingCount: PropTypes.number.isRequired
};
BulkSetMarketingContactsDialog.propTypes = propTypes;
export default BulkSetMarketingContactsDialog;