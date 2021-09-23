'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Set as ImmutableSet } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import * as SharingOptionTypes from 'sales-content-partitioning/constants/SharingOptionTypes';
import { allowSave, validateSelectedOptions } from 'sales-content-partitioning/utils/validation';

var AssignmentPanelSaveButton = function AssignmentPanelSaveButton(props) {
  var isContentPermissionError = props.isContentPermissionError,
      handleConfirm = props.handleConfirm,
      otherProps = _objectWithoutProperties(props, ["isContentPermissionError", "handleConfirm"]);

  if (isContentPermissionError) {
    return null;
  }

  return /*#__PURE__*/_jsx(UITooltip, {
    disabled: validateSelectedOptions(otherProps),
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "salesContentPartitioning.assignmentPanel.footer.selectSomeTeamOrUser"
    }),
    children: /*#__PURE__*/_jsx(UILoadingButton, {
      disabled: !allowSave(otherProps),
      failed: false,
      loading: false,
      onClick: handleConfirm,
      use: "primary",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentPartitioning.assignmentPanel.footer.save"
      })
    })
  });
};

AssignmentPanelSaveButton.propTypes = {
  isContentPermissionError: PropTypes.bool.isRequired,
  selectedTeams: PropTypes.instanceOf(ImmutableSet).isRequired,
  selectedUsers: PropTypes.instanceOf(ImmutableSet).isRequired,
  sharingOption: PropTypes.oneOf(Object.values(SharingOptionTypes)).isRequired,
  initialSelectedTeams: PropTypes.instanceOf(ImmutableSet).isRequired,
  initialSelectedUsers: PropTypes.instanceOf(ImmutableSet).isRequired,
  initialSharingOption: PropTypes.oneOf(Object.values(SharingOptionTypes)).isRequired,
  canAssignContent: PropTypes.bool.isRequired,
  handleConfirm: PropTypes.func.isRequired
};
export default AssignmentPanelSaveButton;