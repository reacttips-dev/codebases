'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import UIIcon from 'UIComponents/icon/UIIcon';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIList from 'UIComponents/list/UIList';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import FormattedMessage from 'I18n/components/FormattedMessage';

var FolderTeamsList = function FolderTeamsList(_ref) {
  var teams = _ref.teams,
      teamIds = _ref.teamIds,
      isTeamsRequestSucceeded = _ref.isTeamsRequestSucceeded;

  if (!isTeamsRequestSucceeded || teams.isEmpty()) {
    return /*#__PURE__*/_jsx(UILoadingSpinner, {});
  }

  return /*#__PURE__*/_jsx(UIList, {
    styled: true,
    "data-test-id": "tooltip-teams-list",
    children: teamIds.map(function (teamId) {
      return /*#__PURE__*/_jsx("span", {
        "data-test-object-id": teamId,
        children: teams.getIn([teamId, 'name'])
      }, teamId);
    })
  });
};

var RestrictedAccessIcon = function RestrictedAccessIcon(_ref2) {
  var folder = _ref2.folder,
      teams = _ref2.teams,
      isTeamsRequestSucceeded = _ref2.isTeamsRequestSucceeded,
      fetchTeams = _ref2.fetchTeams;
  return /*#__PURE__*/_jsx(UITooltip, {
    headingText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "FileManagerCore.folderAccess.title"
    }),
    use: "longform",
    placement: "bottom",
    "data-test-id": "folder-access-tooltip",
    title: /*#__PURE__*/_jsx(FolderTeamsList, {
      teamIds: folder.get('teams'),
      teams: teams,
      isTeamsRequestSucceeded: isTeamsRequestSucceeded
    }),
    onOpenChange: function onOpenChange() {
      if (!isTeamsRequestSucceeded) {
        fetchTeams();
      }
    },
    children: /*#__PURE__*/_jsx(UIIcon, {
      name: "lists"
    })
  });
};

RestrictedAccessIcon.propTypes = {
  folder: PropTypes.instanceOf(Immutable.Map).isRequired,
  teams: PropTypes.instanceOf(Immutable.Map).isRequired,
  isTeamsRequestSucceeded: PropTypes.bool.isRequired,
  fetchTeams: PropTypes.func.isRequired
};
FolderTeamsList.propTypes = {
  teams: PropTypes.instanceOf(Immutable.Map).isRequired,
  teamIds: PropTypes.array.isRequired,
  isTeamsRequestSucceeded: PropTypes.bool.isRequired
};
export default RestrictedAccessIcon;