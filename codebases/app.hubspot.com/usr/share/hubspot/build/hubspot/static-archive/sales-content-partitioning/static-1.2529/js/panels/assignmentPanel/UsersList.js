'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Set as ImmutableSet } from 'immutable';
import { getAllUserIdsFromTeams } from 'sales-content-partitioning/lib/TeamHelpers';
import UIList from 'UIComponents/list/UIList';
import UISearchInput from 'UIComponents/input/UISearchInput';
import UserCheckbox from './UserCheckbox';

var UsersList = function UsersList(_ref) {
  var ownerId = _ref.ownerId,
      teams = _ref.teams,
      selectedTeams = _ref.selectedTeams,
      selectedUsers = _ref.selectedUsers,
      usersForTeams = _ref.usersForTeams,
      userSearch = _ref.userSearch,
      handleUserSearch = _ref.handleUserSearch,
      handleUserChange = _ref.handleUserChange,
      canAssignContent = _ref.canAssignContent;
  var userIdsFromSelectedTeams = getAllUserIdsFromTeams(teams, selectedTeams);
  var sortedUsers = usersForTeams.sortBy(function (value) {
    return value.get('fullName');
  }, function (a, b) {
    return a.localeCompare(b);
  }).filter(function (user) {
    return user.get('fullName').toLowerCase().includes(userSearch);
  });
  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx(UISearchInput, {
      onChange: function onChange(e) {
        return handleUserSearch(e.target.value);
      }
    }), /*#__PURE__*/_jsx(UIList, {
      children: sortedUsers.map(function (user) {
        return /*#__PURE__*/_jsx(UserCheckbox, {
          selectedUsers: selectedUsers,
          ownerId: ownerId,
          user: user,
          userPartOfSelectedTeams: userIdsFromSelectedTeams.includes(user.get('id')),
          handleUserChange: handleUserChange,
          canAssignContent: canAssignContent
        }, user.get('id'));
      }).toArray()
    })]
  });
};

UsersList.propTypes = {
  ownerId: PropTypes.number.isRequired,
  selectedUsers: PropTypes.instanceOf(ImmutableSet).isRequired,
  selectedTeams: PropTypes.instanceOf(ImmutableSet).isRequired,
  teams: PropTypes.instanceOf(ImmutableSet).isRequired,
  usersForTeams: PropTypes.instanceOf(ImmutableSet).isRequired,
  userSearch: PropTypes.string.isRequired,
  handleUserSearch: PropTypes.func.isRequired,
  handleUserChange: PropTypes.func.isRequired,
  canAssignContent: PropTypes.bool.isRequired
};
export default UsersList;