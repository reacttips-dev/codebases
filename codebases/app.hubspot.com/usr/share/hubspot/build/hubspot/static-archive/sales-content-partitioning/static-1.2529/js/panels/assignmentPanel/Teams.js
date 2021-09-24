'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import PropTypes from 'prop-types';
import { Set as ImmutableSet } from 'immutable';
import UIList from 'UIComponents/list/UIList';
import TeamCheckbox from './TeamCheckbox';
import TeamsZeroState from './TeamsZeroState';

var Teams = /*#__PURE__*/function (_Component) {
  _inherits(Teams, _Component);

  function Teams() {
    _classCallCheck(this, Teams);

    return _possibleConstructorReturn(this, _getPrototypeOf(Teams).apply(this, arguments));
  }

  _createClass(Teams, [{
    key: "renderTeam",
    value: function renderTeam(team) {
      var childTeams = team.get('childTeams');

      if (!childTeams.isEmpty()) {
        return [this.renderTeamCheckbox(team), this.renderTeamsList(team)];
      }

      return this.renderTeamCheckbox(team);
    }
  }, {
    key: "renderTeamsList",
    value: function renderTeamsList(team) {
      var _this = this;

      var childTeams = team.get('childTeams');
      return /*#__PURE__*/_jsx(UIList, {
        className: "p-left-7",
        children: childTeams.map(function (childTeam) {
          return _this.renderTeam(childTeam);
        }).toArray()
      });
    }
  }, {
    key: "renderTeamCheckbox",
    value: function renderTeamCheckbox(team) {
      var _this$props = this.props,
          selectedTeams = _this$props.selectedTeams,
          handleTeamChange = _this$props.handleTeamChange,
          canAssignContent = _this$props.canAssignContent;
      return /*#__PURE__*/_jsx(TeamCheckbox, {
        onTeamChange: handleTeamChange,
        selectedTeams: selectedTeams,
        team: team,
        canAssignContent: canAssignContent
      }, team.get('id') + "-team-checkbox");
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var teams = this.props.teams;

      if (teams.isEmpty()) {
        return /*#__PURE__*/_jsx(TeamsZeroState, {});
      }

      return /*#__PURE__*/_jsx("div", {
        className: "hierarchical-teams-list",
        children: /*#__PURE__*/_jsx(UIList, {
          children: teams.map(function (team) {
            return _this2.renderTeam(team);
          }).toArray()
        })
      });
    }
  }]);

  return Teams;
}(Component);

Teams.propTypes = {
  teams: PropTypes.instanceOf(ImmutableSet).isRequired,
  selectedTeams: PropTypes.instanceOf(ImmutableSet).isRequired,
  handleTeamChange: PropTypes.func.isRequired,
  canAssignContent: PropTypes.bool.isRequired
};
export { Teams as default };