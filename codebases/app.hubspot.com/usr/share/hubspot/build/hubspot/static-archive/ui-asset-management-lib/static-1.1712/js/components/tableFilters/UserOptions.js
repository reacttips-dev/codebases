'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import UIAvatar from 'ui-addon-avatars/UIAvatar';
import { getSortedUsers } from '../../utils/UserUtils';
import { formatUserFullNameForDisplay } from '../../utils/UserUtils';
import { FilterOptionTypes } from './Constants';

var makeUserSelectOption = function makeUserSelectOption(user, assetTypeDisplayName) {
  var id = user.id,
      email = user.email,
      ownedAssetCount = user.ownedAssetCount;
  return {
    value: id,
    text: formatUserFullNameForDisplay(user),
    type: FilterOptionTypes.USER,
    ownedAssetCount: ownedAssetCount,
    assetTypeDisplayName: assetTypeDisplayName,
    avatar: /*#__PURE__*/_jsx(UIAvatar, {
      size: "xs",
      displayName: email,
      lookup: {
        type: 'hubSpotUserEmail',
        primaryIdentifier: email
      }
    })
  };
};

var getUserOptions = function getUserOptions(_ref) {
  var users = _ref.users,
      assetTypeDisplayName = _ref.assetTypeDisplayName,
      userHasTeamAssignmentScope = _ref.userHasTeamAssignmentScope;

  if (!userHasTeamAssignmentScope || users.length === 0) {
    return [];
  }

  return [{
    text: I18n.text('ui-asset-management-lib.labels.users'),
    options: getSortedUsers(users).map(function (user) {
      return makeUserSelectOption(user, assetTypeDisplayName);
    })
  }];
};

export default getUserOptions;