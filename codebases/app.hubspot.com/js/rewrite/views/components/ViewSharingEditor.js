'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIRadioInput from 'UIComponents/input/UIRadioInput';
import UISelect from 'UIComponents/input/UISelect';
import UIToggleGroup from 'UIComponents/input/UIToggleGroup';
import { useCurrentUserTeams } from '../../auth/hooks/useCurrentUserTeams';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { useHasAllScopes } from '../../auth/hooks/useHasAllScopes';
import { useTeams } from '../../teams/hooks/useTeams';
var PRIVATE = 'PRIVATE';
var TEAM = 'TEAM';
var PUBLIC = 'PUBLIC';

var getInitialTeamId = function getInitialTeamId(_ref, userTeams) {
  var teamId = _ref.teamId;
  return teamId || userTeams.length && userTeams[0].id || null;
};

var getInitialCheckedButton = function getInitialCheckedButton(_ref2) {
  var isPrivate = _ref2.private,
      teamId = _ref2.teamId;

  if (isPrivate && !teamId) {
    return PRIVATE;
  } else if (isPrivate && teamId) {
    return TEAM;
  } else {
    return PUBLIC;
  }
};

var getTeamOptions = function getTeamOptions(_ref3) {
  var initialView = _ref3.initialView,
      teams = _ref3.teams,
      userTeams = _ref3.userTeams;
  var teamId = initialView.teamId;
  var shouldAppendTeam = teamId && !userTeams.find(function (_ref4) {
    var id = _ref4.id;
    return id === teamId;
  });
  var options = userTeams.map(function (_ref5) {
    var id = _ref5.id,
        name = _ref5.name;
    return {
      text: name,
      value: id
    };
  });

  if (shouldAppendTeam) {
    var team = teams[teamId];
    var text = team ? team.name : String(teamId);
    return [].concat(_toConsumableArray(options), [{
      text: text,
      value: teamId,
      help: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.views.modals.manageSharing.notOnTeam"
      })
    }]);
  }

  return options;
};

var ViewSharingEditor = function ViewSharingEditor(_ref6) {
  var initialView = _ref6.initialView,
      onChange = _ref6.onChange;
  var teams = useTeams();
  var userTeams = useCurrentUserTeams();
  var hasAllScopes = useHasAllScopes();
  var canMakeViewsPublic = !hasAllScopes('bet-views-public-share-restricted') || hasAllScopes('bet-views-public-share');
  var teamOptions = useMemo(function () {
    return getTeamOptions({
      initialView: initialView,
      teams: teams,
      userTeams: userTeams
    });
  }, [initialView, teams, userTeams]);
  var hasTeamOption = teamOptions.length > 0;
  var hasMultipleTeamOptions = teamOptions.length > 1;
  var teamRadioMessage = !hasTeamOption || hasMultipleTeamOptions ? 'index.views.modals.manageSharing.team' : 'index.views.modals.manageSharing.myTeam';

  var _useState = useState(getInitialTeamId(initialView, userTeams)),
      _useState2 = _slicedToArray(_useState, 2),
      selectedTeamId = _useState2[0],
      setSelectedTeamId = _useState2[1];

  var _useState3 = useState(getInitialCheckedButton(initialView)),
      _useState4 = _slicedToArray(_useState3, 2),
      checkedButton = _useState4[0],
      setCheckedButton = _useState4[1];

  var handleCheckedChange = useCallback(function (_ref7) {
    var value = _ref7.target.value;
    setCheckedButton(value);
    onChange({
      private: value !== PUBLIC,
      teamId: value === TEAM ? selectedTeamId : null
    });
  }, [onChange, selectedTeamId]);
  var handleTeamSelectChange = useCallback(function (_ref8) {
    var value = _ref8.target.value;
    setSelectedTeamId(value);
    onChange({
      private: true,
      teamId: value
    });
  }, [onChange]);
  return /*#__PURE__*/_jsx(UIFormControl, {
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.views.modals.manageSharing.label"
    }),
    children: /*#__PURE__*/_jsxs(UIToggleGroup, {
      name: "view-sharing-options",
      children: [/*#__PURE__*/_jsx(UIRadioInput, {
        value: PRIVATE,
        checked: checkedButton === PRIVATE,
        onChange: handleCheckedChange,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.views.modals.manageSharing.private"
        })
      }), /*#__PURE__*/_jsx(UITooltip, {
        placement: "left",
        disabled: hasTeamOption,
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.views.permissions.userHasNoTeam"
        }),
        children: /*#__PURE__*/_jsx(UIRadioInput, {
          disabled: !hasTeamOption,
          checked: checkedButton === TEAM,
          value: TEAM,
          onChange: handleCheckedChange,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: teamRadioMessage,
            options: hasTeamOption ? {
              name: teamOptions[0].text
            } : undefined
          })
        })
      }), hasMultipleTeamOptions && /*#__PURE__*/_jsx(UISelect, {
        minimumSearchCount: 0,
        className: "width-100",
        readOnly: checkedButton !== TEAM,
        options: teamOptions,
        value: selectedTeamId,
        onChange: handleTeamSelectChange
      }), /*#__PURE__*/_jsx(UITooltip, {
        disabled: canMakeViewsPublic,
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.views.permissions.shareViewEveryoneDisabledTooltip"
        }),
        children: /*#__PURE__*/_jsx(UIRadioInput, {
          disabled: !canMakeViewsPublic,
          value: PUBLIC,
          checked: checkedButton === PUBLIC,
          onChange: handleCheckedChange,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "index.views.modals.manageSharing.everyone"
          })
        })
      })]
    })
  });
};

ViewSharingEditor.propTypes = {
  initialView: PropTypes.instanceOf(ViewRecord).isRequired,
  onChange: PropTypes.func.isRequired
};
export default ViewSharingEditor;