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
import { push, replace } from 'react-router-redux';
import { List } from 'immutable';
import I18n from 'I18n';
import { fetchBoostedPosts } from '../redux/actions/broadcastCore';
import { goToManageUrl } from '../manage/actions';
import { onDismissBanner, getDismissedBanners } from '../redux/actions/users';
import { bulkScheduleMessages, bulkScheduleDone, executeBulkStatusChange } from '../redux/actions/bulkSchedule';
import { fetchBroadcasts, fetchStatusCounts, patchBroadcasts, makeDrafts, exportBroadcasts, exportDone, startPollingBroadcasts, deleteBroadcast, deleteBroadcasts, makeDraft } from '../redux/actions/broadcasts';
import { cloneBroadcasts, openBroadcast, initApproveBroadcasts } from '../redux/actions/broadcastGroup';
import { updateDataFilter, updateSelectedNetwork } from '../redux/actions/dataFilter';
import { setConnectStep, updateUi } from '../redux/actions/ui';
import { isLoading, isFailed, getInstagramCommentsEnabled, getCalendarEnabled, bulkApprovalEnabled, getBoostedPosts, getFacebookEngagementModalVisible, getUserCanBoostPosts } from '../redux/selectors';
import { getBroadcastPage, getBroadcastsTotal } from '../redux/selectors/broadcasts';
import { getCampaignsEnabled, getCampaignsWriteEnabled, getUserIsPublisher, getAdCreationEnabled } from '../redux/selectors/user';
import { getPublishingTableStepsSeen } from '../redux/selectors/users';
import { getChannelTypesForClone, getPublishableChannels, getExpiredChannels } from '../redux/selectors/channels';
import UIAlert from 'UIComponents/alert/UIAlert';
import UIGrid from 'UIComponents/grid/UIGrid';
import UIGridItem from 'UIComponents/grid/UIGridItem';
import AMPLITUDE_EVENTS from '../lib/usageEvents';
import { trackScreen, trackInteraction } from '../redux/actions/usage';
import { mapProp, abstractChannelsProp, dataFilterProp, uiProp, orderedMapProp, listProp } from '../lib/propTypes';
import { BROADCAST_STATUS_TYPE, BROADCAST_STATUS_TYPE_TO_DATE_ATTRIBUTE, BROADCAST_STATUS_TYPE_TO_SORT_ORDER, APP_SECTIONS } from '../lib/constants';
import { passPropsFor } from '../lib/utils';
import PublishingSidebar from '../components/app/PublishingSidebar';
import Filters from '../components/filter/Filters';
import ExportOverlay from '../components/export/ExportOverlay';
import { makeGetManagePath } from '../manage/selectors';
import PublishingModalButtons from '../components/publishing/PublishingModalButtons';
import BroadcastTable from '../components/broadcast/BroadcastTable';
import ZeroState from './ZeroStateContainer';
import AccountsStatusBanner from '../manage/AccountsStatusBanner';
import { NavMarker } from 'react-rhumb';
import { getIsUngatedForManageBeta } from '../redux/selectors/gates';
import { activateWootricSurvey } from '../lib/wootric';

var mapStateToProps = function mapStateToProps(state) {
  return {
    broadcasts: getBroadcastPage(state),
    broadcastCounts: state.broadcastCounts.get('byStatus'),
    dataFilter: state.dataFilter,
    bulkSchedule: state.bulkSchedule,
    channels: getPublishableChannels(state),
    channelTypesForClone: getChannelTypesForClone(state),
    expiredChannels: getExpiredChannels(state),
    users: state.users,
    ui: state.ui,
    export: state.export,
    user: state.user,
    portalId: state.portal.portal_id,
    channelsLoading: isLoading('channelsFetch')(state),
    broadcastsLoading: isLoading('broadcastsFetch')(state),
    previousRoute: state.route.previous,
    isFailed: isFailed('broadcastsFetch', 'channelsV2Fetch')(state),
    isExporting: isLoading('broadcastsExport')(state),
    hasCampaignsReadAccess: getCampaignsEnabled(state),
    hasCampaignsWriteAccess: getCampaignsWriteEnabled(state),
    instagramCommentsEnabled: getInstagramCommentsEnabled(state),
    calendarEnabled: getCalendarEnabled(state),
    uploadedErrors: state.uploadedErrors,
    broadcastsTotal: getBroadcastsTotal(state),
    getManagePath: makeGetManagePath(state),
    userIsPublisher: getUserIsPublisher(state),
    bulkApprovalEnabled: bulkApprovalEnabled(state),
    adCreationEnabled: getAdCreationEnabled(state),
    boostedPosts: getBoostedPosts(state),
    dismissedBanners: getDismissedBanners(state),
    userCanBoostPosts: getUserCanBoostPosts(state),
    publishingTableStepsSeen: getPublishingTableStepsSeen(state),
    isFacebookEngagementModalVisible: getFacebookEngagementModalVisible(state),
    isUngatedForManageBeta: getIsUngatedForManageBeta(state)
  };
};

var mapDispatchToProps = {
  push: push,
  replace: replace,
  updateUi: updateUi,
  exportBroadcasts: exportBroadcasts,
  exportDone: exportDone,
  bulkScheduleMessages: bulkScheduleMessages,
  bulkScheduleDone: bulkScheduleDone,
  fetchBroadcasts: fetchBroadcasts,
  fetchStatusCounts: fetchStatusCounts,
  startPollingBroadcasts: startPollingBroadcasts,
  updateDataFilter: updateDataFilter,
  updateSelectedNetwork: updateSelectedNetwork,
  patchBroadcasts: patchBroadcasts,
  cloneBroadcasts: cloneBroadcasts,
  makeDrafts: makeDrafts,
  openBroadcast: openBroadcast,
  setConnectStep: setConnectStep,
  executeBulkStatusChange: executeBulkStatusChange,
  initApproveBroadcasts: initApproveBroadcasts,
  deleteBroadcast: deleteBroadcast,
  goToManageUrl: goToManageUrl,
  deleteBroadcasts: deleteBroadcasts,
  fetchBoostedPosts: fetchBoostedPosts,
  makeDraft: makeDraft,
  onDismissBanner: onDismissBanner,
  trackScreen: trackScreen,
  trackInteraction: trackInteraction
};

var PublishingContainer = /*#__PURE__*/function (_Component) {
  _inherits(PublishingContainer, _Component);

  function PublishingContainer() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, PublishingContainer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PublishingContainer)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.closeExportModal = function () {
      _this.props.updateUi({
        exportModalIsOpen: false
      });
    };

    _this.openExportModal = function () {
      _this.props.exportDone();

      _this.props.updateUi({
        exportModalIsOpen: true
      });

      _this.props.trackInteraction('open export modal');
    };

    _this.openBulkActionModal = function (actionType) {
      _this.props.updateUi({
        bulkActionDialogIsOpen: true,
        bulkActionType: actionType
      });
    };

    _this.closeBulkActionModal = function () {
      _this.props.updateUi({
        bulkActionDialogIsOpen: false,
        bulkActionType: null
      });
    };

    _this.openScheduleBulkModal = function () {
      _this.props.updateUi({
        bulkScheduleModalIsOpen: true
      });

      _this.props.trackInteraction('open bulk schedule v2');
    };

    _this.handleCloneBroadcast = function (broadcast) {
      _this.props.trackInteraction('clone broadcast');

      _this.props.cloneBroadcasts(List.of(broadcast));
    };

    _this.handleDeleteBroadcast = function (broadcast) {
      _this.props.trackInteraction('delete broadcast');

      _this.props.deleteBroadcast(broadcast.broadcastGuid);
    };

    _this.handleMakeDraft = function (broadcast) {
      _this.props.trackInteraction('move broadcast to draft');

      _this.props.makeDraft(broadcast.broadcastGuid);
    };

    return _this;
  }

  _createClass(PublishingContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.trackScreen(AMPLITUDE_EVENTS.publishing);

      if (this.props.channels) {
        this.loadBroadcasts();
        this.props.startPollingBroadcasts();
      }

      if (this.props.userCanBoostPosts) {
        this.props.fetchBoostedPosts();
      }

      activateWootricSurvey();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.channels && !prevProps.channels) {
        this.loadBroadcasts();
        this.props.startPollingBroadcasts();
        return;
      }

      if (this.props.params.status !== prevProps.params.status) {
        this.loadBroadcasts();
      }
    }
  }, {
    key: "loadBroadcasts",
    value: function loadBroadcasts() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var status = BROADCAST_STATUS_TYPE[props.params.status] || BROADCAST_STATUS_TYPE.published;
      var dataFilterUpdateAttrs = this.getDefaultDataFilterAttrs(status);
      this.props.updateDataFilter(dataFilterUpdateAttrs);
    }
  }, {
    key: "getDefaultDataFilterAttrs",
    value: function getDefaultDataFilterAttrs() {
      var broadcastStatusType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : BROADCAST_STATUS_TYPE.published;
      return {
        requestedStatusType: broadcastStatusType,
        sortBy: BROADCAST_STATUS_TYPE_TO_DATE_ATTRIBUTE[broadcastStatusType],
        page: 1,
        sortOrder: BROADCAST_STATUS_TYPE_TO_SORT_ORDER[broadcastStatusType]
      };
    }
  }, {
    key: "isBulkUploadDisabled",
    value: function isBulkUploadDisabled(uploadedCount) {
      var channels = this.props.channels;
      return Boolean(!channels || this.props.channelsLoading || channels.isEmpty() || uploadedCount > 0);
    }
  }, {
    key: "getStatusType",
    value: function getStatusType() {
      return this.props.dataFilter.broadcastStatusType || this.props.params.status || BROADCAST_STATUS_TYPE.published;
    }
  }, {
    key: "getIsDetailsPanelOpen",
    value: function getIsDetailsPanelOpen() {
      return Boolean(this.props.params.id);
    }
  }, {
    key: "renderExportDialog",
    value: function renderExportDialog() {
      if (this.props.ui.get('exportModalIsOpen')) {
        return /*#__PURE__*/_jsx(ExportOverlay, Object.assign({}, passPropsFor(this.props, ExportOverlay), {
          exportType: this.props.dataFilter.broadcastStatusType,
          closeModal: this.closeExportModal
        }));
      }

      return null;
    }
  }, {
    key: "renderMainContent",
    value: function renderMainContent() {
      if (this.props.isFailed) {
        return /*#__PURE__*/_jsx(NavMarker, {
          name: "PUBLISHING_CONTAINER_FAILED",
          children: /*#__PURE__*/_jsx(UIGridItem, {
            size: 10,
            children: /*#__PURE__*/_jsx(UIAlert, {
              type: "danger",
              children: I18n.text('sui.publishing.genericFailure')
            })
          })
        });
      }

      var uploadedCount = this.props.broadcastCounts && this.props.broadcastCounts.get('uploaded'); // make action buttons split onto second line for uploaded section, filters take up too much room

      var topControlsClassname = "top-controls display-flex justify-between" + (this.props.params.status === BROADCAST_STATUS_TYPE.uploaded ? " flex-column" : "");
      return /*#__PURE__*/_jsxs(UIGridItem, {
        size: 10,
        children: [/*#__PURE__*/_jsxs("div", {
          className: topControlsClassname,
          children: [/*#__PURE__*/_jsx(Filters, Object.assign({}, passPropsFor(this.props, Filters))), /*#__PURE__*/_jsx(PublishingModalButtons, Object.assign({}, passPropsFor(this.props, PublishingModalButtons), {
            openExportModal: this.openExportModal,
            openBulkScheduleModal: this.openScheduleBulkModal,
            openBulkActionModal: this.openBulkActionModal,
            closeBulkActionModal: this.closeBulkActionModal,
            isBulkUploadDisabled: this.isBulkUploadDisabled(uploadedCount),
            isExportDisabled: !this.props.broadcasts || this.props.broadcasts.isEmpty(),
            broadcastStatusType: this.getStatusType(),
            uploadedCount: uploadedCount,
            bulkAction: this.props.ui.get('bulkActionType'),
            showBulkActionDialog: this.props.ui.get('bulkActionDialogIsOpen'),
            moveToScheduledDisabled: Boolean(!this.props.uploadedErrors || !this.props.uploadedErrors.isEmpty()),
            isBulkActionLoading: this.props.ui.get('isBulkActionLoading'),
            isComposerOpen: this.props.ui.get('composerOpen'),
            isDetailsPanelOpen: this.getIsDetailsPanelOpen()
          }))]
        }), this.renderExportDialog(), /*#__PURE__*/_jsx(BroadcastTable, Object.assign({}, passPropsFor(this.props, BroadcastTable), {
          broadcastStatusType: this.getStatusType(),
          isLoading: this.props.broadcastsLoading || this.props.params.status === BROADCAST_STATUS_TYPE.uploaded && this.props.ui.get('isPollingUploaded'),
          onCloneBroadcast: this.handleCloneBroadcast,
          onDeleteBroadcast: this.handleDeleteBroadcast,
          onMakeDraft: this.handleMakeDraft
        }))]
      });
    }
  }, {
    key: "renderBody",
    value: function renderBody() {
      if (this.props.channels && this.props.channels.isEmpty()) {
        return /*#__PURE__*/_jsx(ZeroState, {});
      }

      return /*#__PURE__*/_jsxs(UIGrid, {
        children: [/*#__PURE__*/_jsx(UIGridItem, {
          size: 2,
          children: /*#__PURE__*/_jsx(PublishingSidebar, {
            activeItem: this.props.dataFilter.broadcastStatusType,
            broadcastCounts: this.props.broadcastCounts,
            getManagePath: this.props.getManagePath,
            isDetailsPanelOpen: this.getIsDetailsPanelOpen(),
            portalId: this.props.portalId,
            publishingTableStepsSeen: this.props.publishingTableStepsSeen,
            showCalendarSwitcher: this.props.calendarEnabled
          })
        }), this.renderMainContent()]
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.isUngatedForManageBeta) {
        this.props.goToManageUrl(this.props.params.status, this.props.params.id);
        return null;
      }

      return /*#__PURE__*/_jsx(NavMarker, {
        name: "PUBLISHING_CONTAINER_LOADED",
        children: /*#__PURE__*/_jsxs("div", {
          className: 'publishing-container' + (this.props.isFailed ? " failed" : ""),
          children: [/*#__PURE__*/_jsx(AccountsStatusBanner, {
            section: APP_SECTIONS.publishing
          }), this.renderBody()]
        })
      });
    }
  }]);

  return PublishingContainer;
}(Component);

PublishingContainer.propTypes = {
  children: PropTypes.node,
  broadcasts: orderedMapProp,
  channels: abstractChannelsProp,
  expiredChannels: mapProp,
  dataFilter: dataFilterProp,
  export: PropTypes.object,
  broadcastCounts: mapProp,
  bulkSchedule: PropTypes.object,
  user: PropTypes.object,
  portalId: PropTypes.number.isRequired,
  currentLocation: PropTypes.object,
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  broadcastsLoading: PropTypes.bool,
  channelsLoading: PropTypes.bool,
  isFailed: PropTypes.bool,
  isUngatedForManageBeta: PropTypes.bool,
  ui: uiProp,
  push: PropTypes.func,
  getManagePath: PropTypes.func,
  replace: PropTypes.func,
  previousRoute: PropTypes.object,
  updateUi: PropTypes.func,
  exportBroadcasts: PropTypes.func,
  exportDone: PropTypes.func,
  bulkScheduleMessages: PropTypes.func,
  bulkScheduleDone: PropTypes.func,
  calendarEnabled: PropTypes.bool,
  fetchBroadcasts: PropTypes.func,
  startPollingBroadcasts: PropTypes.func,
  fetchStatusCounts: PropTypes.func,
  updateDataFilter: PropTypes.func,
  patchBroadcasts: PropTypes.func,
  cloneBroadcasts: PropTypes.func,
  goToManageUrl: PropTypes.func,
  openBroadcast: PropTypes.func,
  broadcastsFailed: PropTypes.bool,
  instagramCommentsEnabled: PropTypes.bool,
  executeBulkStatusChange: PropTypes.func,
  updateSelectedNetwork: PropTypes.func,
  uploadedErrors: mapProp,
  broadcastsTotal: PropTypes.number,
  userIsPublisher: PropTypes.bool,
  initApproveBroadcasts: PropTypes.func,
  adCreationEnabled: PropTypes.bool.isRequired,
  deleteBroadcast: PropTypes.func.isRequired,
  deleteBroadcasts: PropTypes.func.isRequired,
  fetchBoostedPosts: PropTypes.func.isRequired,
  boostedPosts: mapProp,
  makeDraft: PropTypes.func,
  onDismissBanner: PropTypes.func.isRequired,
  trackScreen: PropTypes.func.isRequired,
  trackInteraction: PropTypes.func.isRequired,
  dismissedMessages: listProp,
  userCanBoostPosts: PropTypes.bool.isRequired,
  publishingTableStepsSeen: PropTypes.object,
  isFacebookEngagementModalVisible: PropTypes.bool.isRequired,
  hasCampaignsReadAccess: PropTypes.bool.isRequired,
  hasCampaignsWriteAccess: PropTypes.bool.isRequired
};
export default connect(mapStateToProps, mapDispatchToProps)(PublishingContainer);