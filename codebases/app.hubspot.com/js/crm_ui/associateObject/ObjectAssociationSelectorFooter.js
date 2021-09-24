'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import { GYPSUM, BATTLESHIP } from 'HubStyleTokens/colors';
import styled from 'styled-components';
var StyledAssociationSelectorFooter = styled(UIDialogFooter).withConfig({
  displayName: "ObjectAssociationSelectorFooter__StyledAssociationSelectorFooter",
  componentId: "sc-1wnehrm-0"
})(["background-color:", " !important;border-top:1px solid ", ";bottom:0;width:100%;left:0;position:fixed;z-index:1;"], GYPSUM, BATTLESHIP);
var propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  unsavedChangeCount: PropTypes.number.isRequired,
  shouldDisableSaveButton: PropTypes.bool
};

var ObjectAssociationSelectorFooter = function ObjectAssociationSelectorFooter(_ref) {
  var unsavedChangeCount = _ref.unsavedChangeCount,
      onReject = _ref.onReject,
      onConfirm = _ref.onConfirm,
      shouldDisableSaveButton = _ref.shouldDisableSaveButton;
  return /*#__PURE__*/_jsxs(StyledAssociationSelectorFooter, {
    children: [/*#__PURE__*/_jsx(UIButton, {
      use: "primary",
      onClick: onConfirm,
      disabled: shouldDisableSaveButton,
      "data-selenium-test": "object-association-panel-confirm-button",
      "data-unit-test": "objectAssociationPanelConfirmButton",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sidebar.associateObjectDialog.confirmButton.save"
      })
    }), /*#__PURE__*/_jsx(UIButton, {
      use: "secondary",
      onClick: onReject,
      "data-unit-test": "objectAssociationPanelCancelButton",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sidebar.associateObjectDialog.cancelButton"
      })
    }), unsavedChangeCount !== 0 && /*#__PURE__*/_jsx(FormattedMessage, {
      className: "p-left-3",
      message: "sidebar.associateObjectDialog.changesMade",
      "data-unit-test": "associateObjectDialogMessage",
      options: {
        unsavedChangeCount: unsavedChangeCount,
        count: unsavedChangeCount
      }
    })]
  });
};

ObjectAssociationSelectorFooter.propTypes = propTypes;
export default ObjectAssociationSelectorFooter;