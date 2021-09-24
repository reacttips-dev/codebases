'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import FormattedName from 'I18n/components/FormattedName';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UICheckbox from 'UIComponents/input/UICheckbox';

var UserCheckbox = function UserCheckbox(_ref) {
  var ownerId = _ref.ownerId,
      selectedUsers = _ref.selectedUsers,
      user = _ref.user,
      userPartOfSelectedTeams = _ref.userPartOfSelectedTeams,
      handleUserChange = _ref.handleUserChange,
      canAssignContent = _ref.canAssignContent;

  var _user$toObject = user.toObject(),
      firstName = _user$toObject.firstName,
      lastName = _user$toObject.lastName,
      email = _user$toObject.email,
      id = _user$toObject.id;

  var isOwner = id === ownerId;
  var forceChecked = userPartOfSelectedTeams || isOwner;
  var tooltipMessage = isOwner ? 'salesContentPartitioning.assignmentPanel.tooltips.userIsOwner' : 'salesContentPartitioning.assignmentPanel.tooltips.userOnSelectedTeam';
  return /*#__PURE__*/_jsx(UITooltip, {
    placement: "left",
    disabled: !forceChecked,
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: tooltipMessage
    }),
    children: /*#__PURE__*/_jsx(UICheckbox, {
      checked: selectedUsers.includes(id) || forceChecked,
      readOnly: forceChecked || !canAssignContent,
      onChange: handleUserChange,
      value: id,
      children: /*#__PURE__*/_jsx(FormattedName, {
        givenName: firstName,
        familyName: lastName,
        email: email
      })
    }, id + "-user-checkbox")
  }, id + "-checkbox-tooltip");
};

UserCheckbox.propTypes = {
  ownerId: PropTypes.number.isRequired,
  user: PropTypes.instanceOf(ImmutableMap).isRequired,
  selectedUsers: PropTypes.instanceOf(ImmutableSet).isRequired,
  userPartOfSelectedTeams: PropTypes.bool.isRequired,
  handleUserChange: PropTypes.func.isRequired,
  canAssignContent: PropTypes.bool.isRequired
};
export default UserCheckbox;