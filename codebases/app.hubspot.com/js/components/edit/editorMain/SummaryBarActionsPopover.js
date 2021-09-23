'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import * as links from 'SequencesUI/lib/links';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UITooltipContent from 'UIComponents/tooltip/UITooltipContent';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIList from 'UIComponents/list/UIList';
import UIButton from 'UIComponents/button/UIButton';
import UILink from 'UIComponents/link/UILink';
import HR from 'UIComponents/elements/HR';

var TooltipContent = function TooltipContent() {
  return /*#__PURE__*/_jsxs(UITooltipContent, {
    className: "p-x-0 p-top-4 p-bottom-0",
    children: [/*#__PURE__*/_jsxs(UIList, {
      ordered: true,
      styled: true,
      className: "m-x-4 p-left-6",
      childClassName: "m-y-3",
      style: {
        fontSize: '14px'
      },
      children: [/*#__PURE__*/_jsx(FormattedMessage, {
        message: "edit.summaryBar.popover.actions.email"
      }), /*#__PURE__*/_jsx(FormattedMessage, {
        message: "edit.summaryBar.popover.actions.meeting"
      })]
    }), /*#__PURE__*/_jsx(HR, {
      className: "m-bottom-0"
    }), /*#__PURE__*/_jsx(UIFlex, {
      align: "center",
      justify: "center",
      direction: "column",
      className: "p-y-1",
      children: /*#__PURE__*/_jsx(UIButton, {
        use: "transparent",
        onClick: function onClick() {
          // eslint-disable-next-line no-undef
          hubspot.zorse.openHelpWidget({
            url: links.unenrollContactKB()
          });
        },
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "edit.summaryBar.popover.learnMore"
        })
      })
    })]
  });
};

var SummaryBarActionsPopover = function SummaryBarActionsPopover() {
  return /*#__PURE__*/_jsx(UITooltip, {
    width: 230,
    Content: TooltipContent,
    placement: "bottom",
    use: "longform",
    children: /*#__PURE__*/_jsx(UILink, {
      className: "p-left-1",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "edit.summaryBar.popover.button",
        className: "sequence-editor-summary-bar-popover-button"
      })
    })
  });
};

export default SummaryBarActionsPopover;