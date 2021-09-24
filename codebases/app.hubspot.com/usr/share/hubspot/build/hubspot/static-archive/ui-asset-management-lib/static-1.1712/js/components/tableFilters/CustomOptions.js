'use es6';

import I18n from 'I18n';
import { formatOwnerName } from '../../utils/UserUtils';
import { FilterOptionTypes, BaseFilterLevels } from './Constants';

var getCustomFilterOptions = function getCustomFilterOptions(_ref) {
  var allowPrivate = _ref.allowPrivate,
      assetTypeDisplayName = _ref.assetTypeDisplayName,
      userHasTeamAssignmentScope = _ref.userHasTeamAssignmentScope,
      _ref$showAny = _ref.showAny,
      showAny = _ref$showAny === void 0 ? true : _ref$showAny,
      showUnassigned = _ref.showUnassigned,
      customTeamOptionDisabled = _ref.customTeamOptionDisabled,
      additionalOptions = _ref.additionalOptions,
      ownerInfo = _ref.ownerInfo,
      showMyTeamsOption = _ref.showMyTeamsOption;
  var CustomOptions = [];
  var allLangKey = userHasTeamAssignmentScope ? 'allUsersAndTeams' : 'allTeams';

  if (userHasTeamAssignmentScope && allowPrivate) {
    CustomOptions.push({
      value: BaseFilterLevels.ASSIGNED_TO_USER,
      type: FilterOptionTypes.CUSTOM,
      text: I18n.text('ui-asset-management-lib.filterOptions.myAssets', {
        ownerName: I18n.SafeString(formatOwnerName(ownerInfo))
      })
    });
  }

  if (showMyTeamsOption) {
    CustomOptions.push({
      value: BaseFilterLevels.ASSIGNED_TO_USERS_TEAM,
      type: FilterOptionTypes.CUSTOM,
      text: I18n.text('ui-asset-management-lib.filterOptions.myTeamsAssets'),
      disabled: customTeamOptionDisabled
    });
  }

  additionalOptions.forEach(function (option) {
    CustomOptions.push(option);
  });

  if (showAny) {
    CustomOptions.push({
      value: BaseFilterLevels.ALL,
      type: FilterOptionTypes.CUSTOM,
      text: I18n.text("ui-asset-management-lib.filterOptions." + allLangKey)
    });
  }

  if (showUnassigned) {
    CustomOptions.push({
      value: BaseFilterLevels.UNASSIGNED,
      type: FilterOptionTypes.CUSTOM,
      text: I18n.text('ui-asset-management-lib.filterOptions.unassignedAssets', {
        assetType: assetTypeDisplayName
      })
    });
  }

  return CustomOptions;
};

export default getCustomFilterOptions;