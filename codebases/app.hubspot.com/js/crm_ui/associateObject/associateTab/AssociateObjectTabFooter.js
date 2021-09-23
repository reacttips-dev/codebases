'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import UIPanelFooter from 'UIComponents/panel/UIPanelFooter';
import { GYPSUM, BATTLESHIP } from 'HubStyleTokens/colors';
import styled from 'styled-components';
import UIButton from 'UIComponents/button/UIButton';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
var StyledUIPanelFooter = styled(UIPanelFooter).withConfig({
  displayName: "AssociateObjectTabFooter__StyledUIPanelFooter",
  componentId: "iae74w-0"
})(["background-color:", " !important;border-top:1px solid ", ";bottom:0;width:100%;left:0;position:fixed;z-index:1;"], GYPSUM, BATTLESHIP);

var AssociateObjectTabFooter = function AssociateObjectTabFooter(_ref) {
  var onConfirm = _ref.onConfirm,
      onReject = _ref.onReject,
      isSaveDisabled = _ref.isSaveDisabled;
  return /*#__PURE__*/_jsxs(StyledUIPanelFooter, {
    children: [/*#__PURE__*/_jsx(UIButton, {
      "data-selenium-test": "object-association-panel-confirm-button",
      use: "primary",
      onClick: onConfirm,
      disabled: isSaveDisabled,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sidebar.associateObjectDialog.associateTab.AssociateObjectTabFooter.updateButtonLabel"
      })
    }), /*#__PURE__*/_jsx(UIButton, {
      use: "secondary",
      onClick: onReject,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sidebar.associateObjectDialog.associateTab.AssociateObjectTabFooter.cancelButtonLabel"
      })
    })]
  });
};

AssociateObjectTabFooter.propTypes = {
  isSaveDisabled: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
};
export default AssociateObjectTabFooter;