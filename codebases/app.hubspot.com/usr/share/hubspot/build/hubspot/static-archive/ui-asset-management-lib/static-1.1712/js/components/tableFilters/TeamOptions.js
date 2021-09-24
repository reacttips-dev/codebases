'use es6';

import I18n from 'I18n';
import { getSortedFlattenedTeamsList } from '../../utils/TeamUtils';
import { FilterOptionTypes } from './Constants';

var makeTeamSelectOption = function makeTeamSelectOption(_ref) {
  var depth = _ref.depth,
      id = _ref.id,
      name = _ref.name;
  return {
    depth: depth,
    value: id,
    text: name,
    icon: 'lists',
    type: FilterOptionTypes.TEAM
  };
};

var getTeamOptions = function getTeamOptions(_ref2) {
  var teams = _ref2.teams;
  var teamOptions = getSortedFlattenedTeamsList(teams).map(makeTeamSelectOption);
  return [{
    text: I18n.text('ui-asset-management-lib.labels.teams'),
    options: teamOptions
  }];
};

export default getTeamOptions;