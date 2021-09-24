'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import PropTypes from 'prop-types';
import { Map as ImmutableMap, List, Set as ImmutableSet } from 'immutable';
import { fetchUsersAndTeams } from 'sales-content-partitioning/api/UsersAndTeamsApi';
import { fetchPermissionsForContent, saveContentPermissions } from 'sales-content-partitioning/api/ContentPermissionsApi';
import { canAssignContent } from 'sales-content-partitioning/lib/Permissions';
import { toggleSelectedTeam } from 'sales-content-partitioning/lib/TeamHelpers';
import { PRIVATE, EVERYONE, SPECIFIC } from 'sales-content-partitioning/constants/SharingOptionTypes';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import H2 from 'UIComponents/elements/headings/H2';
import UIModalPanel from 'UIComponents/dialog/UIModalPanel';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIButton from 'UIComponents/button/UIButton';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import AssignmentPanelBulkWarning from './assignmentPanel/AssignmentPanelBulkWarning';
import AssignmentPanelOptions from './assignmentPanel/AssignmentPanelOptions';
import AssignmentPanelTabs from './assignmentPanel/AssignmentPanelTabs';
import AssignmentPanelSaveButton from './assignmentPanel/AssignmentPanelSaveButton';
import AssignmentPanelErrorState from './assignmentPanel/AssignmentPanelErrorState';

function toggleSelectUser(selectedUsers, userId) {
  if (selectedUsers.includes(userId)) {
    return selectedUsers.remove(userId);
  }

  return selectedUsers.add(userId);
}

export var AssignmentPanelInstance = null;
var defaultState = {
  isOpen: false,
  isContentPermissionLoading: true,
  isContentPermissionError: false,
  ownerId: null,
  objectId: null,
  objectType: null,
  userSearch: '',
  initialSharingOption: EVERYONE,
  initialSelectedTeams: ImmutableSet(),
  initialSelectedUsers: ImmutableSet(),
  selectedTeams: ImmutableSet(),
  selectedUsers: ImmutableSet(),
  selectedTab: 'teams',
  sharingOption: EVERYONE
};

var AssignmentPanel = /*#__PURE__*/function (_Component) {
  _inherits(AssignmentPanel, _Component);

  function AssignmentPanel() {
    var _this;

    _classCallCheck(this, AssignmentPanel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AssignmentPanel).call(this));

    _this.open = function (_ref) {
      var objectId = _ref.objectId,
          objectType = _ref.objectType,
          ownerId = _ref.ownerId;

      _this.setState({
        objectId: objectId,
        objectType: objectType,
        ownerId: ownerId,
        isOpen: true
      });

      fetchPermissionsForContent({
        objectId: objectId,
        objectType: objectType
      }).then(function (permissionsData) {
        var selectedTeams = permissionsData.getIn(['permissions', 'TEAM']);
        var selectedUsers = permissionsData.getIn(['permissions', 'USER']);
        var sharingOption = permissionsData.get('visibleToAll') ? EVERYONE : permissionsData.get('private') ? PRIVATE : SPECIFIC;

        _this.setState({
          selectedTeams: selectedTeams,
          selectedUsers: selectedUsers,
          sharingOption: sharingOption,
          initialSelectedTeams: selectedTeams,
          initialSelectedUsers: selectedUsers,
          initialSharingOption: sharingOption,
          isContentPermissionLoading: false
        });
      }, function (err) {
        _this.setState({
          isContentPermissionError: true,
          isContentPermissionLoading: false
        });

        rethrowError(err);
      });
    };

    _this.close = function () {
      _this.setState(defaultState);
    };

    _this.handleUserSearch = function (query) {
      _this.setState({
        userSearch: query.toLowerCase()
      });
    };

    _this.handleTeamChange = function (_ref2) {
      var value = _ref2.target.value;
      var teamId = parseInt(value, 10);

      _this.setState(function (_ref3) {
        var selectedTeams = _ref3.selectedTeams,
            teams = _ref3.teams;
        return {
          selectedTeams: toggleSelectedTeam(selectedTeams, teams, teamId)
        };
      });
    };

    _this.handleUserChange = function (_ref4) {
      var value = _ref4.target.value;
      var userId = parseInt(value, 10);

      _this.setState(function (_ref5) {
        var selectedUsers = _ref5.selectedUsers;
        return {
          selectedUsers: toggleSelectUser(selectedUsers, userId)
        };
      });
    };

    _this.handleSharingOptionChange = function (_ref6) {
      var sharingOption = _ref6.target.value;
      var shouldUpdateSelectedUsers = sharingOption === SPECIFIC;

      _this.setState(function (_ref7) {
        var ownerId = _ref7.ownerId,
            selectedUsers = _ref7.selectedUsers;
        return {
          sharingOption: sharingOption,
          selectedUsers: shouldUpdateSelectedUsers ? selectedUsers.add(ownerId) : selectedUsers
        };
      });
    };

    _this.handleTabChange = function (selectedTab) {
      _this.setState({
        selectedTab: selectedTab
      });
    };

    _this.handleConfirm = function () {
      var _this$state = _this.state,
          objectId = _this$state.objectId,
          objectType = _this$state.objectType,
          sharingOption = _this$state.sharingOption,
          selectedTeams = _this$state.selectedTeams,
          selectedUsers = _this$state.selectedUsers;
      var afterSave = _this.props.afterSave;

      _this.setState({
        isContentPermissionLoading: true
      });

      var shareSpecific = sharingOption === SPECIFIC;
      saveContentPermissions({
        objectId: objectId,
        objectType: objectType,
        selectedTeams: shareSpecific ? selectedTeams : [],
        selectedUsers: shareSpecific ? selectedUsers : [],
        visibleToAll: sharingOption === EVERYONE,
        private: sharingOption === PRIVATE
      }).then(function () {
        FloatingAlertStore.addAlert({
          type: 'success',
          titleText: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "salesContentPartitioning.alerts.successTitle"
          })
        });

        _this.setState(defaultState);

        afterSave({
          sharingOption: sharingOption,
          selectedTeams: selectedTeams,
          selectedUsers: selectedUsers
        });
      }, function (err) {
        FloatingAlertStore.addAlert({
          type: 'danger',
          titleText: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "salesContentPartitioning.alerts.errorTitle"
          }),
          message: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "salesContentPartitioning.alerts.errorMessage"
          })
        });

        _this.setState({
          isContentPermissionLoading: false
        });

        rethrowError(err);
      });
    };

    _this.state = Object.assign({
      teams: null,
      usersForTeams: null
    }, defaultState);
    return _this;
  }

  _createClass(AssignmentPanel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      AssignmentPanelInstance = this;
      fetchUsersAndTeams(this.props.scopes).then(function (_ref8) {
        var _ref9 = _slicedToArray(_ref8, 2),
            teams = _ref9[0],
            usersForTeams = _ref9[1];

        _this2.setState({
          teams: teams,
          usersForTeams: usersForTeams
        });
      }, function (error) {
        _this2.setState({
          isContentPermissionLoading: false,
          isContentPermissionError: true
        });

        rethrowError(error);
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      AssignmentPanelInstance = null;
    }
  }, {
    key: "renderBody",
    value: function renderBody() {
      var _this$props = this.props,
          scopes = _this$props.scopes,
          showBulkWarning = _this$props.showBulkWarning;
      var _this$state2 = this.state,
          ownerId = _this$state2.ownerId,
          selectedTab = _this$state2.selectedTab,
          teams = _this$state2.teams,
          usersForTeams = _this$state2.usersForTeams,
          selectedUsers = _this$state2.selectedUsers,
          selectedTeams = _this$state2.selectedTeams,
          sharingOption = _this$state2.sharingOption,
          userSearch = _this$state2.userSearch,
          isContentPermissionLoading = _this$state2.isContentPermissionLoading,
          isContentPermissionError = _this$state2.isContentPermissionError,
          objectType = _this$state2.objectType;

      if (isContentPermissionError) {
        return /*#__PURE__*/_jsx(AssignmentPanelErrorState, {});
      }

      if (!teams || !usersForTeams || isContentPermissionLoading) {
        return /*#__PURE__*/_jsx(UILoadingSpinner, {
          grow: true
        });
      }

      var shouldShowTabs = sharingOption === SPECIFIC;
      return /*#__PURE__*/_jsxs(UIDialogBody, {
        children: [/*#__PURE__*/_jsx(AssignmentPanelBulkWarning, {
          showBulkWarning: showBulkWarning
        }), /*#__PURE__*/_jsx(AssignmentPanelOptions, {
          objectType: objectType,
          sharingOption: sharingOption,
          canAssignContent: canAssignContent(scopes),
          handleSharingOptionChange: this.handleSharingOptionChange
        }), shouldShowTabs && /*#__PURE__*/_jsx(AssignmentPanelTabs, {
          ownerId: ownerId,
          teams: teams,
          usersForTeams: usersForTeams,
          selectedTab: selectedTab,
          selectedTeams: selectedTeams,
          selectedUsers: selectedUsers,
          userSearch: userSearch,
          handleTeamChange: this.handleTeamChange,
          handleTabChange: this.handleTabChange,
          handleUserChange: this.handleUserChange,
          handleUserSearch: this.handleUserSearch,
          canAssignContent: canAssignContent(scopes)
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.state.isOpen) {
        return null;
      }

      return /*#__PURE__*/_jsxs(UIModalPanel, {
        className: "assign-teams-modal",
        children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: this.close
          }), /*#__PURE__*/_jsx(H2, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "salesContentPartitioning.assignmentPanel.title.manage"
            })
          })]
        }), this.renderBody(), /*#__PURE__*/_jsxs(UIDialogFooter, {
          children: [/*#__PURE__*/_jsx(AssignmentPanelSaveButton, {
            isContentPermissionError: this.state.isContentPermissionError,
            selectedTeams: this.state.selectedTeams,
            selectedUsers: this.state.selectedUsers,
            sharingOption: this.state.sharingOption,
            initialSelectedTeams: this.state.initialSelectedTeams,
            initialSelectedUsers: this.state.initialSelectedUsers,
            initialSharingOption: this.state.initialSharingOption,
            canAssignContent: canAssignContent(this.props.scopes),
            handleConfirm: this.handleConfirm
          }), /*#__PURE__*/_jsx(UIButton, {
            use: "secondary",
            onClick: this.close,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "salesContentPartitioning.assignmentPanel.footer.cancel"
            })
          })]
        })]
      });
    }
  }]);

  return AssignmentPanel;
}(Component);

AssignmentPanel.propTypes = {
  showBulkWarning: PropTypes.bool,
  afterSave: PropTypes.func,
  scopes: PropTypes.oneOfType([PropTypes.instanceOf(ImmutableMap), PropTypes.instanceOf(List), PropTypes.instanceOf(ImmutableSet)]).isRequired
};
AssignmentPanel.defaultProps = {
  showBulkWarning: false,
  afterSave: function afterSave() {},
  scopes: ImmutableMap()
};
export { AssignmentPanel as default };