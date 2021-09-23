'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import UIDashboardPage from 'UIComponents/page/UIDashboardPage';
import NotificationList from 'ReduxMessenger/components/NotificationList';
import { usageTrackerActions } from 'usage-tracker-redux';
import TrialsContextualPrompt from 'ui-addon-upgrades/_core/trial/prompts/ContextualTrialPromptContainer';
import { trackInteraction } from '../redux/actions/usage';
import { deleteAccount, fetchAccountsAndChannels } from '../redux/actions/accounts';
import { fetchBroadcasts } from '../redux/actions/broadcasts';
import { openComposerByQueryParams } from '../redux/actions/composer';
import { initBroadcastGroup } from '../redux/actions/broadcastGroup';
import { openProfile, openProfileByUsername } from '../redux/actions/people';
import { bulkScheduleMessages, bulkScheduleDone, executeBulkStatusChange } from '../redux/actions/bulkSchedule';
import { setRoute, updateUi } from '../redux/actions/ui';
import { getAccountsForDisplay, getAppSection, getCalendarEnabled, isRivalIqEnabled, isLoading, getNavItems, getStorage, getPortalId, getInbox, getIntel, getUi, getCampaigns, getChannels } from '../redux/selectors';
import { getUserIsAdmin, getUserId, getUserIsPublisher } from '../redux/selectors/user';
import { getUserAttributes } from '../redux/selectors/users';
import { appDidMount } from '../redux/actions/app';
import { getIsUngatedForManageBeta, getIsUngatedForCompareBeta, getGates } from '../redux/selectors/gates';
import { appSectionProp, campaignsProp, gatesProp, intelProp, listProp, orderedMapProp, uiProp, mapProp, hubSettingsProp } from '../lib/propTypes';
import { passPropsFor } from '../lib/utils';
import { APP_SECTIONS, getAppRoot } from '../lib/constants';
import ComposeContainerLauncher from './ComposeContainerLauncher';
import DetailsPanelLauncher from './DetailsPanelLauncher';
import ProfileContainer from './ProfileContainer';
import OAuthContainer from './OAuthContainer';
import MediaContainer from './MediaContainer';
import SettingsPage from 'settings-ui-nav/SettingsPage';
import Header from '../components/app/Header';
import BoostPanelContainer from './BoostPanelContainer';
import usageTracker from '../lib/usageTracker';
import FacebookEngagementModal from './FacebookEngagementModal';
import OneOffReconnectBanner from '../components/app/OneOffReconnectBanner';
import BulkScheduleOverlay from '../components/bulkSchedule/BulkScheduleOverlay';
var track = usageTrackerActions.track;

var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    accounts: getAccountsForDisplay(state),
    channels: getChannels(state),
    campaigns: getCampaigns(state),
    ui: getUi(state),
    navItems: getNavItems(state),
    intel: getIntel(state),
    inbox: getInbox(state),
    userId: getUserId(state),
    portalId: getPortalId(state),
    gates: getGates(state),
    appSection: getAppSection(ownProps),
    storage: getStorage(state),
    userAttributes: getUserAttributes(state),
    userIsAdmin: getUserIsAdmin(state),
    userIsPublisher: getUserIsPublisher(state),
    hubSettings: state.hubSettings,
    rivalIqEnabled: isRivalIqEnabled(state),
    calendarEnabled: getCalendarEnabled(state),
    isUngatedForManageBeta: getIsUngatedForManageBeta(state),
    isUngatedForCompareBeta: getIsUngatedForCompareBeta(state),
    channelsLoading: isLoading('channelsFetch')(state),
    broadcastCounts: state.broadcastCounts.get('byStatus'),
    bulkSchedule: state.bulkSchedule
  };
};

var mapDispatchToProps = {
  deleteAccount: deleteAccount,
  fetchBroadcasts: fetchBroadcasts,
  updateUi: updateUi,
  setRoute: setRoute,
  fetchAccountsAndChannels: fetchAccountsAndChannels,
  initBroadcastGroup: initBroadcastGroup,
  push: push,
  openProfile: openProfile,
  openProfileByUsername: openProfileByUsername,
  openComposerByQueryParams: openComposerByQueryParams,
  appDidMount: appDidMount,
  track: track,
  trackInteraction: trackInteraction,
  bulkScheduleMessages: bulkScheduleMessages,
  bulkScheduleDone: bulkScheduleDone,
  executeBulkStatusChange: executeBulkStatusChange
};

var BlankPage = function BlankPage(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/_jsx("div", {
    children: children
  });
};

var AppContainer = /*#__PURE__*/function (_Component) {
  _inherits(AppContainer, _Component);

  function AppContainer() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, AppContainer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(AppContainer)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onClickCompose = function () {
      _this.props.trackInteraction('create post');

      _this.props.initBroadcastGroup({
        createdBy: _this.props.userId,
        appSection: _this.props.appSection
      });
    };

    _this.isInternalSection = function (navItem) {
      return !navItem.has('externalRoute');
    };

    _this.closeScheduleBulkModal = function () {
      _this.props.updateUi({
        bulkScheduleModalIsOpen: false
      });

      _this.props.bulkScheduleDone();
    };

    _this.openBulkScheduleModal = function () {
      _this.props.updateUi({
        bulkScheduleModalIsOpen: true
      });

      _this.props.trackInteraction('open bulk schedule v2');
    };

    _this.getNavigatePath = function (navItem) {
      return navItem.get('route');
    };

    return _this;
  }

  _createClass(AppContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.appDidMount(this.props.location, this.props.routes, this.props.params);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.location !== this.props.location) {
        this.props.setRoute(this.props.routes, this.props.params);
      }
    }
  }, {
    key: "isBulkUploadDisabled",
    value: function isBulkUploadDisabled() {
      var _this$props = this.props,
          channels = _this$props.channels,
          channelsLoading = _this$props.channelsLoading,
          broadcastCounts = _this$props.broadcastCounts;
      var uploadedCount = broadcastCounts && broadcastCounts.get('uploaded');
      return Boolean(!channels || channelsLoading || channels.isEmpty() || uploadedCount > 0);
    }
  }, {
    key: "renderBulkScheduleDialog",
    value: function renderBulkScheduleDialog() {
      var _this$props2 = this.props,
          channels = _this$props2.channels,
          ui = _this$props2.ui,
          bulkSchedule = _this$props2.bulkSchedule,
          portalId = _this$props2.portalId;

      if (!channels || !ui.get('bulkScheduleModalIsOpen')) {
        return null;
      }

      return /*#__PURE__*/_jsx(BulkScheduleOverlay, {
        bulkScheduleMessages: this.props.bulkScheduleMessages,
        bulkSchedule: bulkSchedule,
        portalId: portalId,
        closeModal: this.closeScheduleBulkModal
      });
    }
  }, {
    key: "renderConnectFlow",
    value: function renderConnectFlow() {
      return /*#__PURE__*/_jsx(OAuthContainer, Object.assign({}, passPropsFor(this.props, OAuthContainer), {
        route: this.props.route,
        params: this.props.params,
        accountGuid: this.props.params.accountGuid
      }));
    }
  }, {
    key: "renderBoostPanel",
    value: function renderBoostPanel() {
      var broadcastId = this.props.ui.get('boostBroadcastGuid');
      var postId = this.props.ui.get('boostPostId');

      if (!this.props.channels || !broadcastId && !postId) {
        return null;
      }

      return /*#__PURE__*/_jsx(BoostPanelContainer, {
        broadcastGuid: broadcastId,
        postId: postId,
        params: this.props.params,
        onSuccess: this.handleBoostPostSuccess,
        onFailure: this.handleBoostPostFailure,
        onClose: this.closeBoostPanel
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          portalId = _this$props3.portalId,
          broadcastCounts = _this$props3.broadcastCounts,
          appSection = _this$props3.appSection;
      var PageComponent = UIDashboardPage;
      var className = 'app-container' + (this.props.ui.get('composerOpen') ? " composer-open" : "");
      var pageComponentProps = {
        className: className,
        pageLayout: 'full-width'
      };

      if (appSection === APP_SECTIONS.settings) {
        PageComponent = SettingsPage;
        pageComponentProps = Object.assign({}, pageComponentProps, {
          pathname: "/" + getAppRoot() + "/" + portalId + "/settings",
          settingsApp: 'SocialUI',
          track: usageTracker.track
        });
      } else if (appSection === APP_SECTIONS.compare) {
        PageComponent = BlankPage;
      } else {
        pageComponentProps.headerComponent = /*#__PURE__*/_jsx(Header, Object.assign({}, passPropsFor(this.props, Header), {
          onClickCompose: this.onClickCompose,
          isInternalSection: this.isInternalSection,
          getNavigatePath: this.getNavigatePath,
          isUngatedForManageBeta: this.props.isUngatedForManageBeta,
          isUngatedForCompareBeta: this.props.isUngatedForCompareBeta,
          isBulkUploadDisabled: this.isBulkUploadDisabled(),
          openBulkScheduleModal: this.openBulkScheduleModal,
          uploadedCount: broadcastCounts && broadcastCounts.get('uploaded'),
          portalId: portalId
        }));
      }

      if (this.props.appSection === APP_SECTIONS.manage) {
        pageComponentProps.pageLayout = 'full-width';
      } // children of PageComponent can count on only being mounted once, and not unmounted.
      // section containers (eg children passed in as children prop in a leaf route) can be mounted and unmounted multiple times, with back button etc


      return /*#__PURE__*/_jsxs("div", {
        className: "app-container",
        children: [this.renderBulkScheduleDialog(), /*#__PURE__*/_jsx(NotificationList, {
          className: 'notifications' + (this.props.ui.get('composerOpen') ? " composer-open" : "")
        }), /*#__PURE__*/_jsxs(PageComponent, Object.assign({}, pageComponentProps, {
          children: [this.props.appSection !== APP_SECTIONS.settings && /*#__PURE__*/_jsx(OneOffReconnectBanner, {}), this.props.children]
        })), /*#__PURE__*/_jsx(ComposeContainerLauncher, {}), /*#__PURE__*/_jsx(ProfileContainer, {
          params: this.props.params
        }), /*#__PURE__*/_jsx(MediaContainer, {}), /*#__PURE__*/_jsx(DetailsPanelLauncher, {
          location: this.props.location,
          params: this.props.params
        }), /*#__PURE__*/_jsx(FacebookEngagementModal, Object.assign({}, passPropsFor(this.props, FacebookEngagementModal))), this.renderConnectFlow(), this.renderBoostPanel(), /*#__PURE__*/_jsx(TrialsContextualPrompt, {
          app: "social"
        })]
      });
    }
  }]);

  return AppContainer;
}(Component);

AppContainer.propTypes = {
  children: PropTypes.node,
  ui: uiProp,
  navItems: PropTypes.object,
  accounts: listProp,
  channels: orderedMapProp,
  campaigns: campaignsProp,
  userId: PropTypes.number,
  appSection: appSectionProp,
  intel: intelProp,
  userIsAdmin: PropTypes.bool,
  userIsPublisher: PropTypes.bool,
  portalId: PropTypes.number,
  params: PropTypes.object,
  location: PropTypes.object,
  route: PropTypes.object.isRequired,
  routes: PropTypes.array,
  gates: gatesProp,
  storage: PropTypes.object,
  userAttributes: PropTypes.object,
  hasLinkedInAccounts: PropTypes.bool,
  hubSettings: hubSettingsProp,
  rivalIqEnabled: PropTypes.bool,
  calendarEnabled: PropTypes.bool,
  updateUi: PropTypes.func,
  fetchAccountsAndChannels: PropTypes.func,
  appDidMount: PropTypes.func,
  initBroadcastGroup: PropTypes.func,
  openProfile: PropTypes.func,
  openProfileByUsername: PropTypes.func,
  openComposerByQueryParams: PropTypes.func,
  push: PropTypes.func,
  setRoute: PropTypes.func,
  track: PropTypes.func,
  trackInteraction: PropTypes.func,
  isUngatedForManageBeta: PropTypes.bool,
  isUngatedForCompareBeta: PropTypes.bool,
  broadcastCounts: mapProp,
  channelsLoading: PropTypes.bool,
  bulkSchedule: PropTypes.object,
  bulkScheduleMessages: PropTypes.func,
  bulkScheduleDone: PropTypes.func,
  executeBulkStatusChange: PropTypes.func
};
export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);