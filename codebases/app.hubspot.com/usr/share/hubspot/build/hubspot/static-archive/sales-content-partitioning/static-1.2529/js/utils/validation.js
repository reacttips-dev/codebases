'use es6';

import { SPECIFIC } from 'sales-content-partitioning/constants/SharingOptionTypes';
export var validateSelectedOptions = function validateSelectedOptions(_ref) {
  var sharingOption = _ref.sharingOption,
      selectedTeams = _ref.selectedTeams,
      selectedUsers = _ref.selectedUsers;
  return sharingOption === SPECIFIC ? selectedTeams.size > 0 || selectedUsers.size > 1 : true;
};
export var allowSave = function allowSave(_ref2) {
  var canAssignContent = _ref2.canAssignContent,
      selectedTeams = _ref2.selectedTeams,
      selectedUsers = _ref2.selectedUsers,
      sharingOption = _ref2.sharingOption,
      initialSelectedTeams = _ref2.initialSelectedTeams,
      initialSelectedUsers = _ref2.initialSelectedUsers,
      initialSharingOption = _ref2.initialSharingOption;

  if (sharingOption === SPECIFIC) {
    var teamsOrUsersChanged = !selectedTeams.equals(initialSelectedTeams) || !selectedUsers.equals(initialSelectedUsers);
    return canAssignContent && teamsOrUsersChanged && validateSelectedOptions({
      sharingOption: sharingOption,
      selectedTeams: selectedTeams,
      selectedUsers: selectedUsers
    });
  }

  return initialSharingOption !== sharingOption;
};