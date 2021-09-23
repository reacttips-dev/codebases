'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import H4 from 'UIComponents/elements/headings/H4';
import PropTypes from 'prop-types';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import UIFlex from 'UIComponents/layout/UIFlex';

var CustomObjectAdminCelebrationShepherdPresentational = function CustomObjectAdminCelebrationShepherdPresentational(_ref) {
  var children = _ref.children,
      onClose = _ref.onClose,
      isOpen = _ref.isOpen;
  return /*#__PURE__*/_jsx(UIFlex, {
    justify: "center",
    children: /*#__PURE__*/_jsx(UIPopover, {
      use: "shepherd",
      width: 350,
      open: isOpen,
      showCloseButton: true,
      onOpenChange: onClose,
      placement: "right bottom",
      autoPlacement: false,
      content: {
        header: /*#__PURE__*/_jsx(H4, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "index.onboarding.customObjects.adminCelebrationShepherd.header"
          })
        }),
        body: /*#__PURE__*/_jsx("span", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "index.onboarding.customObjects.adminCelebrationShepherd.body"
          })
        })
      },
      children: children
    })
  });
};

CustomObjectAdminCelebrationShepherdPresentational.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
};
export default CustomObjectAdminCelebrationShepherdPresentational;