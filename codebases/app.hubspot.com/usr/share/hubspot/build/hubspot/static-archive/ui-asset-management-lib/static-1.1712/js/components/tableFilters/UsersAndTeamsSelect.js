'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import userInfo from 'hub-http/userInfo';
import HR from 'UIComponents/elements/HR';
import Small from 'UIComponents/elements/Small';
import UISelect from 'UIComponents/input/UISelect';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { TeamOptionType } from '../../types/OptionTypes';
import { BaseFilterLevels, FilterOptionTypes } from './Constants';
import getCustomFilterOptions from './CustomOptions';
import getTeamOptions from './TeamOptions';
import getUserOptions from './UserOptions';
var IndentedTeamOption = styled.div.withConfig({
  displayName: "UsersAndTeamsSelect__IndentedTeamOption",
  componentId: "sc-10zgesg-0"
})(["padding-left:", ";"], function (props) {
  return props.depth * 10 + "px";
});

var UserAndTeamOptionComponent = function UserAndTeamOptionComponent(_ref) {
  var option = _ref.option,
      children = _ref.children,
      rest = _objectWithoutProperties(_ref, ["option", "children"]);

  // include a divider between the top "all" option and the final custom option "unassigned"
  if (option.value === BaseFilterLevels.ALL || option.value === BaseFilterLevels.UNASSIGNED) {
    return /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx("div", Object.assign({}, rest, {
        children: children
      })), /*#__PURE__*/_jsx(HR, {
        distance: "flush"
      })]
    });
  }

  if (option.value === BaseFilterLevels.ASSIGNED_TO_USERS_TEAM && option.disabled) {
    return /*#__PURE__*/_jsx("span", Object.assign({}, rest, {
      children: /*#__PURE__*/_jsx(UITooltip, {
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "ui-asset-management-lib.tooltips.noTeamAssignmentTooltip"
        }),
        children: children
      })
    }));
  }

  if (option.type === FilterOptionTypes.TEAM) {
    return /*#__PURE__*/_jsx(IndentedTeamOption, Object.assign({
      depth: option.depth
    }, rest, {
      children: children
    }));
  }

  if (option.type === FilterOptionTypes.USER) {
    var _rest$className = rest.className,
        className = _rest$className === void 0 ? '' : _rest$className,
        otherProps = _objectWithoutProperties(rest, ["className"]);

    return /*#__PURE__*/_jsxs("div", Object.assign({
      className: className + " align-center p-y-3"
    }, otherProps, {
      children: [option.avatar, /*#__PURE__*/_jsxs("div", {
        className: "m-left-4",
        children: [/*#__PURE__*/_jsx("div", {
          children: option.text
        }), /*#__PURE__*/_jsxs(Small, {
          children: [option.ownedAssetCount, " ", option.assetTypeDisplayName]
        })]
      })]
    }));
  }

  return /*#__PURE__*/_jsx("div", Object.assign({}, rest, {
    children: children
  }));
};

var UsersAndTeamsSelect = function UsersAndTeamsSelect(_ref2) {
  var requestsLoading = _ref2.requestsLoading,
      requestsError = _ref2.requestsError,
      users = _ref2.users,
      teams = _ref2.teams,
      allowPrivate = _ref2.allowPrivate,
      assetTypeDisplayName = _ref2.assetTypeDisplayName,
      userHasTeamAssignmentScope = _ref2.userHasTeamAssignmentScope,
      onChange = _ref2.onChange,
      showUnassigned = _ref2.showUnassigned,
      showAny = _ref2.showAny,
      customTeamOptionDisabled = _ref2.customTeamOptionDisabled,
      additionalOptions = _ref2.additionalOptions,
      multi = _ref2.multi,
      menuWidth = _ref2.menuWidth,
      showMyTeamsOption = _ref2.showMyTeamsOption,
      rest = _objectWithoutProperties(_ref2, ["requestsLoading", "requestsError", "users", "teams", "allowPrivate", "assetTypeDisplayName", "userHasTeamAssignmentScope", "onChange", "showUnassigned", "showAny", "customTeamOptionDisabled", "additionalOptions", "multi", "menuWidth", "showMyTeamsOption"]);

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      ownerInfo = _useState2[0],
      setOwnerInfo = _useState2[1];

  useEffect(function () {
    userInfo().then(function (authData) {
      setOwnerInfo(authData.user);
    }).catch(function () {
      setOwnerInfo({});
    });
  }, []);

  if (requestsLoading || !ownerInfo) {
    return /*#__PURE__*/_jsx(UILoadingSpinner, {});
  }

  if (requestsError) {
    // TODO: What should we do on error?
    return null;
  }

  var options = [].concat(_toConsumableArray(getCustomFilterOptions({
    allowPrivate: allowPrivate,
    assetTypeDisplayName: assetTypeDisplayName,
    userHasTeamAssignmentScope: userHasTeamAssignmentScope,
    showUnassigned: showUnassigned,
    showAny: showAny,
    customTeamOptionDisabled: customTeamOptionDisabled,
    additionalOptions: additionalOptions,
    ownerInfo: ownerInfo,
    showMyTeamsOption: showMyTeamsOption
  })), _toConsumableArray(getTeamOptions({
    teams: teams
  })), _toConsumableArray(getUserOptions({
    users: users,
    assetTypeDisplayName: assetTypeDisplayName,
    userHasTeamAssignmentScope: userHasTeamAssignmentScope
  })));
  return /*#__PURE__*/_jsx(UISelect, Object.assign({
    buttonUse: "transparent",
    menuWidth: menuWidth,
    options: options,
    optionComponent: UserAndTeamOptionComponent,
    defaultValue: BaseFilterLevels.ALL,
    multi: multi,
    searchPlaceholder: I18n.text('ui-asset-management-lib.searchUsersAndTeams'),
    onSelectedOptionChange: function onSelectedOptionChange(_ref3) {
      var target = _ref3.target;
      var val = target.value;
      var output = multi ? val.map(function (elmnt) {
        return {
          id: elmnt.value,
          type: elmnt.type
        };
      }) : {
        id: val.value,
        type: val.type
      };
      onChange(output);
    }
  }, rest));
};

UsersAndTeamsSelect.propTypes = {
  // The display name of the asset (e.g. landing pages, workflows, ect.)
  // * Name should always be pluralized
  assetTypeDisplayName: PropTypes.string.isRequired,
  // The teams that can be filtered. should be passed in in heirarchical format.
  // - It should only show teams that the user can see/has access to
  // - It should not include teams that have no assets assigned to them.
  teams: PropTypes.arrayOf(TeamOptionType).isRequired,
  // Should not be all the users in the portal, instead it should include
  // - active users in the portal who have at least 1 asset assigned to them
  // - removed users as well if they have at least 1 asset assigned to them
  // ** Technically not required if the user does not have userHasTeamAssignmentScope
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    // All users must have a count of the number of assets assigned to them.
    ownedAssetCount: PropTypes.number.isRequired
  })).isRequired,
  // Optional: If requests for either users or teams are loading to show a loading state
  requestsLoading: PropTypes.bool.isRequired,
  // Optional: If requests for either users or teams have failed show a failure state.
  requestsError: PropTypes.bool.isRequired,
  // If the asset can be assigned to a single individual user, shows filter option to support.
  allowPrivate: PropTypes.bool,
  // Optional: If the user is allowed to filter by individual users, somewhat legacy case
  userHasTeamAssignmentScope: PropTypes.bool,
  // Called when filter changes, includes the type of filter selected (user/team/custom, and the ID)
  onChange: PropTypes.func.isRequired,
  // Optional: User can filter by assets that have not be assigned
  showUnassigned: PropTypes.bool,
  // Optional: True if the user is not assigned to any teams
  showAny: PropTypes.bool,
  // Optional: True if the dropdown should show ALL option
  multi: PropTypes.bool,
  // Optional: True if the select should be multi
  menuWidth: PropTypes.string,
  // Optional: Sets the width of the dropdown
  customTeamOptionDisabled: PropTypes.bool,
  // Optional: Adds extra options to the select
  additionalOptions: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    disabled: PropTypes.bool
  })),
  showMyTeamsOption: PropTypes.bool
};
UsersAndTeamsSelect.defaultProps = {
  showAny: true,
  allowPrivate: true,
  requestsError: false,
  requestsLoading: false,
  userHasTeamAssignmentScope: true,
  showUnassigned: true,
  customTeamOptionDisabled: false,
  additionalOptions: [],
  menuWidth: 'auto',
  showMyTeamsOption: true
};
export default UsersAndTeamsSelect;