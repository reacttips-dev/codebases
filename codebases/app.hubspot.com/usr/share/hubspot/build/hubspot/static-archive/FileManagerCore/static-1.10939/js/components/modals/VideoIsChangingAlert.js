'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getIsUngatedForVideoAlertMigrationAlert, getHasVideoIntegrationScope } from '../../selectors/Auth';
import { getLatestFetchedPortalStatus, getLatestFetchedUserStatus, getfetchVideo2MigrationDataRequestStatus } from '../../selectors/video2Migration';
import { getUserHasAccessToPaidVidyardAccount, getFetchUserAccessToPaidVidyardAccountRequestStatus } from '../../selectors/EmbedCode';
import * as VideoPlayersActions from '../../actions/VideoPlayers';
import * as trackingActions from '../../actions/tracking';
import * as Video2Migration from '../../actions/video2Migration';
import { RequestStatus } from '../../Constants';
import PaidVyAccountVideoIsChangingAlert from './video2MigrationAuxilaryAlerts/PaidVyAccountVideoIsChangingAlert';
import FreeVyAccountVideoIsChangingAlert from './video2MigrationAuxilaryAlerts/FreeVyAccountVideoIsChangingAlert';
import PortalLinedUpForManualMigrationAlert from './video2MigrationAuxilaryAlerts/PortalLinedUpForManualMigrationAlert';
import { UsageTrackingActions } from '../../enums/Video2MigrationUsageTrackingProps';
import * as Video2MigrationStatusTypes from '../../enums/Video2MigrationStatusTypes';
var SECONDS_IN_SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

var VideoIsChangingAlert = function VideoIsChangingAlert(_ref) {
  var fetchUserAccessToPaidVidyardAccountRequestStatus = _ref.fetchUserAccessToPaidVidyardAccountRequestStatus,
      fetchUserAccessToPaidVidyardAccountState = _ref.fetchUserAccessToPaidVidyardAccountState,
      isPaidAccount = _ref.userHasAccessToPaidVidyardAccount,
      isUngatedForVideoMigrationAlert = _ref.isUngatedForVideoMigrationAlert,
      hasVideoIntegrationScope = _ref.hasVideoIntegrationScope,
      wrapperClassName = _ref.wrapperClassName,
      trackInteraction = _ref.trackInteraction,
      trackOnce = _ref.trackOnce,
      remindMeLater = _ref.remindMeLater,
      fetchVideo2MigrationDataRequestStatus = _ref.fetchVideo2MigrationDataRequestStatus,
      permissionToManuallyMigrateToVidyard = _ref.permissionToManuallyMigrateToVidyard,
      fetchVideo2MigrationDataStatus = _ref.fetchVideo2MigrationDataStatus,
      latestFetchedPortalStatus = _ref.latestFetchedPortalStatus,
      latestFetchedUserStatus = _ref.latestFetchedUserStatus,
      isAlertAccessedWithDeepLink = _ref.isAlertAccessedWithDeepLink;

  var onTrackInteraction = function onTrackInteraction(action, meta) {
    return trackInteraction('fileManagerVideoMigrationAlert', action, meta);
  };

  useEffect(function () {
    if (!isUngatedForVideoMigrationAlert || !hasVideoIntegrationScope) {
      return;
    }

    if (fetchUserAccessToPaidVidyardAccountRequestStatus === RequestStatus.UNINITIALIZED) {
      fetchUserAccessToPaidVidyardAccountState();
    }

    if (fetchVideo2MigrationDataRequestStatus === RequestStatus.UNINITIALIZED || fetchVideo2MigrationDataRequestStatus === RequestStatus.FAILED) {
      fetchVideo2MigrationDataStatus();
    }
  }, [fetchUserAccessToPaidVidyardAccountRequestStatus, fetchUserAccessToPaidVidyardAccountState, fetchVideo2MigrationDataRequestStatus, fetchVideo2MigrationDataStatus, isUngatedForVideoMigrationAlert, hasVideoIntegrationScope]);

  if (!isUngatedForVideoMigrationAlert || !hasVideoIntegrationScope || fetchVideo2MigrationDataRequestStatus !== RequestStatus.SUCCEEDED) {
    return null;
  } // return null when:
  // user has signed up for a reminder and it not yet a week from their signing up
  // portal has been migrated
  // portal is being migrated
  // portal has opted into the manual migration
  // don't show a reminder if it has not been 7 days since they signed up for a reminder
  // don't show the reminder if the portal is being migrated or has been migrated


  if (!isAlertAccessedWithDeepLink && latestFetchedPortalStatus && (latestFetchedPortalStatus.get('status') === Video2MigrationStatusTypes.MIGRATION_TO_VIDYARD_STARTED || latestFetchedPortalStatus.get('status') === Video2MigrationStatusTypes.MIGRATION_TO_VIDEO_2_STARTED || latestFetchedPortalStatus.get('status') === Video2MigrationStatusTypes.MIGRATED_TO_VIDEO_2 || latestFetchedPortalStatus.get('status') === Video2MigrationStatusTypes.MIGRATED_TO_VIDYARD || latestFetchedPortalStatus.get('status') === Video2MigrationStatusTypes.PERMISSION_TO_MANUALLY_MIGRATE) || latestFetchedUserStatus && latestFetchedUserStatus.get('status') === Video2MigrationStatusTypes.REMIND_LATER && Date.now() <= new Date(latestFetchedUserStatus.get('timestamp') + SECONDS_IN_SEVEN_DAYS)) {
    return null;
  } // deep link show alert with your portal opted in already


  if (isAlertAccessedWithDeepLink && latestFetchedPortalStatus && (latestFetchedPortalStatus.get('status') === Video2MigrationStatusTypes.MIGRATION_TO_VIDYARD_STARTED || latestFetchedPortalStatus.get('status') === Video2MigrationStatusTypes.PERMISSION_TO_MANUALLY_MIGRATE)) {
    return /*#__PURE__*/_jsx(PortalLinedUpForManualMigrationAlert, {
      wrapperClassName: wrapperClassName,
      onTrackInteraction: onTrackInteraction
    });
  }

  if (isPaidAccount) {
    trackOnce('fileManagerVideoMigrationAlert', UsageTrackingActions.PAID_VY_USER_ALERT_VIEWED);
    return /*#__PURE__*/_jsx(PaidVyAccountVideoIsChangingAlert, Object.assign({}, {
      wrapperClassName: wrapperClassName,
      givePermissionToManuallyMigrate: permissionToManuallyMigrateToVidyard,
      setUpReminderInOneWeek: remindMeLater,
      onTrackInteraction: onTrackInteraction
    }));
  }

  trackOnce('fileManagerVideoMigrationAlert', UsageTrackingActions.FREE_VY_USER_ALERT_VIEWED);
  return /*#__PURE__*/_jsx(FreeVyAccountVideoIsChangingAlert, {
    onTrackInteraction: onTrackInteraction,
    wrapperClassName: wrapperClassName,
    optInHubSpotVideo2: function optInHubSpotVideo2() {}
  });
};

var reduxPropTypes = {
  isUngatedForVideoMigrationAlert: PropTypes.bool.isRequired,
  userHasAccessToPaidVidyardAccount: PropTypes.bool.isRequired,
  fetchUserAccessToPaidVidyardAccountState: PropTypes.func.isRequired,
  fetchUserAccessToPaidVidyardAccountRequestStatus: PropTypes.oneOf(Object.keys(RequestStatus)).isRequired,
  fetchVideo2MigrationDataStatus: PropTypes.func.isRequired,
  remindMeLater: PropTypes.func.isRequired,
  isAlertAccessedWithDeepLink: PropTypes.bool
};
VideoIsChangingAlert.propTypes = Object.assign({
  wrapperClassName: PropTypes.string
}, reduxPropTypes);

var mapStateToProps = function mapStateToProps(state) {
  return {
    fetchVideo2MigrationDataRequestStatus: getfetchVideo2MigrationDataRequestStatus(state),
    latestFetchedPortalStatus: getLatestFetchedPortalStatus(state),
    latestFetchedUserStatus: getLatestFetchedUserStatus(state),
    isUngatedForVideoMigrationAlert: getIsUngatedForVideoAlertMigrationAlert(state),
    userHasAccessToPaidVidyardAccount: getUserHasAccessToPaidVidyardAccount(state),
    fetchUserAccessToPaidVidyardAccountRequestStatus: getFetchUserAccessToPaidVidyardAccountRequestStatus(state),
    hasVideoIntegrationScope: getHasVideoIntegrationScope(state)
  };
};

VideoIsChangingAlert.defaultProps = {
  isAlertAccessedWithDeepLink: false
};
var mapDispatchToProps = {
  fetchVideo2MigrationDataStatus: Video2Migration.fetchVideo2MigrationDataStatus,
  permissionToManuallyMigrateToVidyard: Video2Migration.permissionToManuallyMigrateToVidyard,
  remindMeLater: Video2Migration.remindMeLater,
  trackInteraction: trackingActions.trackInteraction,
  trackOnce: trackingActions.trackOnce,
  fetchUserAccessToPaidVidyardAccountState: VideoPlayersActions.fetchUserAccessToPaidVidyardAccountState
};
export default connect(mapStateToProps, mapDispatchToProps)(VideoIsChangingAlert);