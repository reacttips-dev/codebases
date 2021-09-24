'use es6';

import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILink from 'UIComponents/link/UILink';
import UIPopover from 'UIComponents/tooltip/UIPopover';

var AdvancedSearchPopover = function AdvancedSearchPopover(_ref) {
  var children = _ref.children,
      hasSeen = _ref.hasSeen,
      dismiss = _ref.dismiss,
      trackInteraction = _ref.trackInteraction;
  return /*#__PURE__*/_jsx(UIPopover, {
    open: hasSeen === false,
    showCloseButton: true,
    use: "shepherd",
    width: 300,
    onOpenChange: dismiss,
    placement: "bottom",
    "data-test-id": "advanced-search-popover",
    content: {
      header: /*#__PURE__*/_jsx("h4", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "FileManagerCore.advancedSearch.header"
        })
      }),
      body: /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(FormattedMessage, {
          message: "FileManagerCore.advancedSearch.body"
        }), /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx(UILink, {
          href: "https://knowledge.hubspot.com/files/organize-edit-and-delete-files",
          external: true,
          onClick: function onClick() {
            return trackInteraction('fileManagerExploreFiles', 'advanced-search-learnMore');
          },
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "FileManagerCore.advancedSearch.learnMore"
          })
        })]
      })
    },
    children: /*#__PURE__*/_jsx(_Fragment, {
      children: children
    })
  });
};

export default AdvancedSearchPopover;