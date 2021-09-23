'use es6';

import { createSelector } from 'reselect';
import * as Video2MigrationStatusTypes from '../enums/Video2MigrationStatusTypes';
import { VIDEO_MIGRATION_DUE_DATE } from '../Constants';
import { getIsUngatedForVideoAlertMigrationAlert } from './Auth';
export var getUpdateMigrationStatusRequestStatus = function getUpdateMigrationStatusRequestStatus(state) {
  return state.video2Migration.get('updateMigrationStatusRequestStatus');
};
export var getUpdatedUserStatus = function getUpdatedUserStatus(state) {
  return state.video2Migration.get('updatedUserStatus');
};
export var getLatestFetchedUserStatus = function getLatestFetchedUserStatus(state) {
  return state.video2Migration.get('latestFetchedUserStatus');
};
export var getLatestFetchedPortalStatus = function getLatestFetchedPortalStatus(state) {
  return state.video2Migration.get('latestFetchedPortalStatus');
};
export var getfetchVideo2MigrationDataRequestStatus = function getfetchVideo2MigrationDataRequestStatus(state) {
  return state.video2Migration.get('fetchMigrationDataRequestStatus');
};
export var getIsPortalMigrated = createSelector([getLatestFetchedPortalStatus], function (portalStatus) {
  if (portalStatus) {
    return portalStatus.get('status') === Video2MigrationStatusTypes.MIGRATED_TO_VIDEO_2 || portalStatus.get('status') === Video2MigrationStatusTypes.MIGRATED_TO_VIDYARD;
  }

  return false;
});
export var getIsVieoMigrationOverdue = createSelector([getIsPortalMigrated, getIsUngatedForVideoAlertMigrationAlert], function (isPortalMigrated, isUngatedForVideoMigrationAlert) {
  return isUngatedForVideoMigrationAlert && !isPortalMigrated && Date.now() >= VIDEO_MIGRATION_DUE_DATE;
});