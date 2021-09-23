'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UIButton from 'UIComponents/button/UIButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UILink from 'UIComponents/link/UILink';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UICheckbox from 'UIComponents/input/UICheckbox';

var helpLink = /*#__PURE__*/_jsx(UILink, {
  external: true,
  href: 'https://knowledge.hubspot.com/contacts/marketing-contacts',
  children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
    message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.link"
  })
});

function renderBody(_ref) {
  var selectionCount = _ref.selectionCount,
      marketingCount = _ref.marketingCount,
      pendingCount = _ref.pendingCount,
      nonMarketingCount = _ref.nonMarketingCount,
      nextChangeDate = _ref.nextChangeDate;

  if (marketingCount > 0 && pendingCount > 0 && nonMarketingCount > 0) {
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.notIncluded"
        })
      }), /*#__PURE__*/_jsxs("ul", {
        children: [/*#__PURE__*/_jsx("li", {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.nonMarketingCount",
            options: {
              count: nonMarketingCount
            }
          })
        }), /*#__PURE__*/_jsx("li", {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.alreadyScheduledCount",
            options: {
              count: pendingCount,
              date: nextChangeDate
            }
          })
        })]
      }), /*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.updateCount",
          options: {
            date: nextChangeDate,
            marketingCount: marketingCount,
            count: selectionCount
          }
        })
      }), /*#__PURE__*/_jsxs("p", {
        children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.warning"
        }), ' ', helpLink]
      })]
    });
  } else if (pendingCount > 0 && nonMarketingCount > 0) {
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.attemptCount",
          options: {
            count: selectionCount
          }
        })
      }), /*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.notIncluded"
        })
      }), /*#__PURE__*/_jsxs("ul", {
        children: [/*#__PURE__*/_jsx("li", {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.nonMarketingCount",
            options: {
              count: nonMarketingCount
            }
          })
        }), /*#__PURE__*/_jsx("li", {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.alreadyScheduledCount",
            options: {
              count: pendingCount,
              date: nextChangeDate
            }
          })
        })]
      }), /*#__PURE__*/_jsxs("p", {
        children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.warning"
        }), ' ', helpLink]
      })]
    });
  } else if (marketingCount > 0 && pendingCount > 0) {
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.notIncluded"
        })
      }), /*#__PURE__*/_jsx("ul", {
        children: /*#__PURE__*/_jsx("li", {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.alreadyScheduledCount",
            options: {
              count: pendingCount,
              date: nextChangeDate
            }
          })
        })
      }), /*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.updateCount",
          options: {
            date: nextChangeDate,
            marketingCount: marketingCount,
            count: selectionCount
          }
        })
      }), /*#__PURE__*/_jsxs("p", {
        children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.warning"
        }), ' ', helpLink]
      })]
    });
  } else if (marketingCount > 0 && nonMarketingCount > 0) {
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.notIncluded"
        })
      }), /*#__PURE__*/_jsx("ul", {
        children: /*#__PURE__*/_jsx("li", {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.nonMarketingCount",
            options: {
              count: nonMarketingCount
            }
          })
        })
      }), /*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.updateCount",
          options: {
            date: nextChangeDate,
            marketingCount: marketingCount,
            count: selectionCount
          }
        })
      }), /*#__PURE__*/_jsxs("p", {
        children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.warning"
        }), ' ', helpLink]
      })]
    });
  } else if (selectionCount === pendingCount) {
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.alreadyScheduled",
          options: {
            count: selectionCount,
            date: nextChangeDate
          }
        })
      }), /*#__PURE__*/_jsxs("p", {
        children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.warning"
        }), ' ', helpLink]
      })]
    });
  } else if (selectionCount === marketingCount) {
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.change",
          options: {
            count: selectionCount
          }
        })
      }), /*#__PURE__*/_jsxs("p", {
        children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.warning"
        }), ' ', /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.statusChangeDate",
          options: {
            date: nextChangeDate
          }
        }), ' ', helpLink]
      })]
    });
  } else if (selectionCount === nonMarketingCount) {
    return /*#__PURE__*/_jsx(Fragment, {
      children: /*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.alreadyMarketing",
          options: {
            count: selectionCount
          }
        })
      })
    });
  } else {
    return /*#__PURE__*/_jsx("div", {});
  }
}

function BulkSetMarketingContactsDialog(props) {
  var onReject = props.onReject,
      handleConfirm = props.handleConfirm,
      nonMarketingCount = props.nonMarketingCount,
      pendingCount = props.pendingCount,
      marketingCount = props.marketingCount,
      selectionCount = props.selectionCount,
      nextChangeDate = props.nextChangeDate,
      allSelected = props.allSelected,
      isFilterApplied = props.isFilterApplied,
      applyToAll = props.applyToAll,
      handleChecked = props.handleChecked;
  var isApplyToAllGuardSatisfied = allSelected && !isFilterApplied ? applyToAll : true;
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsxs(UIDialogBody, {
      children: [renderBody({
        selectionCount: selectionCount,
        marketingCount: marketingCount,
        pendingCount: pendingCount,
        nonMarketingCount: nonMarketingCount,
        nextChangeDate: nextChangeDate
      }), allSelected && !isFilterApplied && /*#__PURE__*/_jsx(UIFormControl, {
        required: true,
        children: /*#__PURE__*/_jsx(UICheckbox, {
          id: "apply-to-all-checkbox",
          checked: applyToAll,
          onChange: handleChecked,
          className: "m-bottom-2",
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.confirmApplyToAll"
          })
        })
      })]
    }), marketingCount > 0 ? /*#__PURE__*/_jsxs(UIDialogFooter, {
      children: [/*#__PURE__*/_jsx(UIButton, {
        "data-selenium-test": "set-non-marketable-dialog-confirm-button",
        "data-confirm-button": "accept",
        onClick: handleConfirm,
        use: "primary",
        autoFocus: true,
        disabled: !isApplyToAllGuardSatisfied,
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.confirmLabel"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        onClick: onReject,
        use: "tertiary-light",
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.rejectLabel"
        })
      })]
    }) : /*#__PURE__*/_jsx(UIDialogFooter, {
      children: /*#__PURE__*/_jsx(UIButton, {
        "data-selenium-test": "set-non-marketable-dialog-okay-button",
        "data-confirm-button": "accept",
        onClick: onReject,
        use: "primary",
        autoFocus: true,
        disabled: !isApplyToAllGuardSatisfied,
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.okayLabel"
        })
      })
    })]
  });
}

var propTypes = {
  onReject: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  allSelected: PropTypes.bool.isRequired,
  applyToAll: PropTypes.bool.isRequired,
  handleChecked: PropTypes.func.isRequired,
  isFilterApplied: PropTypes.bool.isRequired,
  nonMarketingCount: PropTypes.number.isRequired,
  pendingCount: PropTypes.number.isRequired,
  marketingCount: PropTypes.number.isRequired,
  selectionCount: PropTypes.number.isRequired,
  nextChangeDate: PropTypes.string.isRequired
};
BulkSetMarketingContactsDialog.propTypes = propTypes;
export default BulkSetMarketingContactsDialog;