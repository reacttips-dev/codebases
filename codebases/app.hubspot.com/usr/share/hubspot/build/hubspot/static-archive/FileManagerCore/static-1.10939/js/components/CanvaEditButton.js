'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import Small from 'UIComponents/elements/Small';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';

var CanvaEditButton = function CanvaEditButton(_ref) {
  var disabledReason = _ref.disabledReason,
      isDisabled = _ref.isDisabled,
      isDownloading = _ref.isDownloading,
      loadingButton = _ref.loadingButton,
      openCanva = _ref.openCanva;
  return /*#__PURE__*/_jsx(UITooltip, {
    title: disabledReason,
    children: isDownloading ? loadingButton : /*#__PURE__*/_jsxs(UIButton, {
      disabled: isDisabled,
      onClick: openCanva,
      children: [/*#__PURE__*/_jsx(FormattedMessage, {
        message: "FileManagerCore.actions.editInCanva"
      }), /*#__PURE__*/_jsx(Small, {
        className: "display-block m-all-0",
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "FileManagerCore.canva.editButton"
        })
      })]
    })
  });
};

CanvaEditButton.propTypes = {
  disabledReason: PropTypes.node,
  isDisabled: PropTypes.bool.isRequired,
  isDownloading: PropTypes.bool.isRequired,
  loadingButton: PropTypes.node.isRequired,
  openCanva: PropTypes.func.isRequired
};
export default CanvaEditButton;