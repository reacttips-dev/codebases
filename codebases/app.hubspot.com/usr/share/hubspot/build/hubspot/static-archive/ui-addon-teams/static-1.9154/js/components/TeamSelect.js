'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { List } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UISelect from 'UIComponents/input/UISelect';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import { sortTeamsAlphabetically } from '../lib/teams';
import Team from '../records/Team';
import I18nUnescapedText from 'I18n/utils/unescapedText';

var teamIdsAsStrings = function teamIdsAsStrings(teamIds) {
  return teamIds.map(function (teamId) {
    return typeof teamId === 'number' ? teamId.toString() : teamId;
  });
};

var TeamSelect = /*#__PURE__*/function (_Component) {
  _inherits(TeamSelect, _Component);

  function TeamSelect(props) {
    var _this;

    _classCallCheck(this, TeamSelect);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TeamSelect).call(this, props));
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.getTeamOptions = _this.getTeamOptions.bind(_assertThisInitialized(_this));
    _this.renderButtonText = _this.renderButtonText.bind(_assertThisInitialized(_this));
    _this.state = {
      filter: '',
      teamOptions: []
    };
    return _this;
  }

  _createClass(TeamSelect, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var teams = this.props.teams;
      this.createTeamOptions(teams);
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var teams = nextProps.teams;

      if (this.props.teams.size !== teams.size) {
        this.createTeamOptions(teams);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props = this.props,
          teams = _this$props.teams,
          customOptions = _this$props.customOptions;

      if (!customOptions.equals(prevProps.customOptions)) {
        this.createTeamOptions(teams);
      }
    }
  }, {
    key: "createTeamOptions",
    value: function createTeamOptions(teams) {
      teams = teams.map(Team.fromReference);
      var teamOptions = this.getTeamOptions(sortTeamsAlphabetically(teams));
      var customOptions = this.getCustomOptions();
      this.setState({
        teamOptions: customOptions.concat(teamOptions).toJS()
      });
    }
  }, {
    key: "handleChange",
    value: function handleChange(_ref) {
      var value = _ref.target.value;
      this.props.onChange(SyntheticEvent(List(value)));
    }
  }, {
    key: "getCustomOptions",
    value: function getCustomOptions() {
      var customOptions = this.props.customOptions;
      return customOptions.map(function (option) {
        return {
          text: option.label || option.text,
          value: option.value,
          disabled: !!option.disabled
        };
      });
    }
  }, {
    key: "getTeamOptions",
    value: function getTeamOptions(teams) {
      var _this2 = this;

      return teams.map(function (team) {
        var teamOption = {
          text: team.name,
          value: String(team.id)
        };

        if (team.childTeams.size) {
          return {
            text: I18nUnescapedText('uiAddonTeams.selectAll', {
              teamName: team.name
            }),
            selectAll: true,
            options: List.of(teamOption).concat(_this2.getTeamOptions(team.childTeams)).toJS()
          };
        } else {
          return teamOption;
        }
      });
    }
  }, {
    key: "getButtonContent",
    value: function getButtonContent() {
      var _this$props2 = this.props,
          ButtonContent = _this$props2.ButtonContent,
          showTags = _this$props2.showTags;

      if (ButtonContent && ButtonContent()) {
        return ButtonContent;
      } else if (!showTags) {
        return this.renderButtonText;
      }

      return null;
    }
  }, {
    key: "renderButtonText",
    value: function renderButtonText() {
      var value = this.props.value;

      if (value.size === 0) {
        return /*#__PURE__*/_jsx(FormattedMessage, {
          message: "uiAddonTeams.selectTeams",
          options: {
            count: value.size
          }
        });
      } else if (value.size === 1) {
        return /*#__PURE__*/_jsx(FormattedMessage, {
          message: "uiAddonTeams.teamSelectLabelOne",
          options: {
            count: value.size
          }
        });
      }

      return /*#__PURE__*/_jsx(FormattedMessage, {
        message: "uiAddonTeams.teamSelectLabelMany",
        options: {
          count: value.size
        }
      });
    }
  }, {
    key: "renderPlaceholder",
    value: function renderPlaceholder() {
      var _this$props3 = this.props,
          showPlaceholder = _this$props3.showPlaceholder,
          placeholder = _this$props3.placeholder;

      if (!showPlaceholder) {
        return null;
      }

      return placeholder || /*#__PURE__*/_jsx(FormattedMessage, {
        message: "uiAddonTeams.selectTeams"
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          showTags = _this$props4.showTags,
          className = _this$props4.className,
          menuWidth = _this$props4.menuWidth,
          multiCollapseLimit = _this$props4.multiCollapseLimit,
          buttonUse = _this$props4.buttonUse,
          value = _this$props4.value,
          isLoading = _this$props4.isLoading,
          open = _this$props4.open,
          disabled = _this$props4.disabled;
      var teamOptions = this.state.teamOptions;
      return /*#__PURE__*/_jsx("div", {
        className: className,
        children: /*#__PURE__*/_jsx(UISelect, {
          menuWidth: menuWidth,
          multiCollapseLimit: showTags ? multiCollapseLimit : null,
          anchorType: "button",
          buttonUse: buttonUse,
          ButtonContent: this.getButtonContent(),
          placeholder: this.renderPlaceholder(),
          multi: true,
          value: teamIdsAsStrings(value).toJS(),
          options: teamOptions,
          onChange: this.handleChange,
          isLoading: isLoading,
          minimumSearchCount: this.props.minimumSearchCount,
          open: open,
          disabled: disabled,
          onOpenChange: this.props.onOpenChange
        })
      });
    }
  }]);

  return TeamSelect;
}(Component);

TeamSelect.propTypes = {
  teams: PropTypes.instanceOf(List),
  showTags: PropTypes.bool,
  className: PropTypes.string,
  menuWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  multiCollapseLimit: PropTypes.number,
  buttonUse: PropTypes.string,
  showPlaceholder: PropTypes.bool,
  placeholder: PropTypes.node,
  onChange: PropTypes.func,
  value: PropTypes.instanceOf(List),
  isLoading: PropTypes.bool,
  multi: PropTypes.bool,
  ButtonContent: PropTypes.func,
  minimumSearchCount: PropTypes.number,
  open: PropTypes.bool,
  disabled: PropTypes.bool,
  onOpenChange: PropTypes.func,
  customOptions: PropTypes.instanceOf(List)
};
TeamSelect.defaultProps = {
  teams: List(),
  showTags: false,
  menuWidth: 'auto',
  buttonUse: 'transparent',
  showPlaceholder: true,
  value: List(),
  isLoading: false,
  customOptions: List()
};
export default TeamSelect;