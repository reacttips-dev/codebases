'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Set as ImmutableSet } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UITab from 'UIComponents/nav/UITab';
import UITabs from 'UIComponents/nav/UITabs';
import Teams from './Teams';
import UsersList from './UsersList';

var AssignmentPanelTabs = function AssignmentPanelTabs(_ref) {
  var ownerId = _ref.ownerId,
      teams = _ref.teams,
      selectedTeams = _ref.selectedTeams,
      selectedUsers = _ref.selectedUsers,
      usersForTeams = _ref.usersForTeams,
      userSearch = _ref.userSearch,
      selectedTab = _ref.selectedTab,
      handleTeamChange = _ref.handleTeamChange,
      handleTabChange = _ref.handleTabChange,
      handleUserChange = _ref.handleUserChange,
      handleUserSearch = _ref.handleUserSearch,
      canAssignContent = _ref.canAssignContent;
  return /*#__PURE__*/_jsxs(UITabs, {
    selected: selectedTab,
    className: "m-top-4",
    children: [/*#__PURE__*/_jsx(UITab, {
      tabId: "teams",
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentPartitioning.assignmentPanel.tabs.teams"
      }),
      onClick: function onClick() {
        return handleTabChange('teams');
      },
      children: /*#__PURE__*/_jsx(Teams, {
        teams: teams,
        selectedTeams: selectedTeams,
        handleTeamChange: handleTeamChange,
        canAssignContent: canAssignContent
      })
    }), /*#__PURE__*/_jsx(UITab, {
      tabId: "users",
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentPartitioning.assignmentPanel.tabs.users"
      }),
      onClick: function onClick() {
        return handleTabChange('users');
      },
      children: /*#__PURE__*/_jsx(UsersList, {
        ownerId: ownerId,
        selectedTeams: selectedTeams,
        selectedUsers: selectedUsers,
        teams: teams,
        usersForTeams: usersForTeams,
        userSearch: userSearch,
        handleUserChange: handleUserChange,
        handleUserSearch: handleUserSearch,
        canAssignContent: canAssignContent
      })
    })]
  });
};

AssignmentPanelTabs.propTypes = {
  ownerId: PropTypes.number.isRequired,
  teams: PropTypes.instanceOf(ImmutableSet).isRequired,
  selectedTeams: PropTypes.instanceOf(ImmutableSet).isRequired,
  selectedUsers: PropTypes.instanceOf(ImmutableSet).isRequired,
  usersForTeams: PropTypes.instanceOf(ImmutableSet).isRequired,
  selectedTab: PropTypes.string.isRequired,
  userSearch: PropTypes.string.isRequired,
  handleTabChange: PropTypes.func.isRequired,
  handleTeamChange: PropTypes.func.isRequired,
  handleUserChange: PropTypes.func.isRequired,
  handleUserSearch: PropTypes.func.isRequired,
  canAssignContent: PropTypes.bool.isRequired
};
export default AssignmentPanelTabs;