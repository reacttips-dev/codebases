'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Set as ImmutableSet } from 'immutable';
import UICheckbox from 'UIComponents/input/UICheckbox';

var TeamCheckbox = function TeamCheckbox(_ref) {
  var selectedTeams = _ref.selectedTeams,
      team = _ref.team,
      canAssignContent = _ref.canAssignContent,
      onTeamChange = _ref.onTeamChange;

  var _team$toObject = team.toObject(),
      id = _team$toObject.id,
      name = _team$toObject.name;

  return /*#__PURE__*/_jsx(UICheckbox, {
    checked: selectedTeams.includes(id),
    readOnly: !canAssignContent,
    onChange: onTeamChange,
    value: id,
    children: name
  });
};

TeamCheckbox.propTypes = {
  onTeamChange: PropTypes.func.isRequired,
  selectedTeams: PropTypes.instanceOf(ImmutableSet).isRequired,
  team: PropTypes.object.isRequired,
  canAssignContent: PropTypes.bool.isRequired
};
export default TeamCheckbox;