'use es6';

import * as Video2OptInOptOutApi from '../api/video2Migration';
import * as ActionTypes from './ActionTypes';
import * as Video2MigrationStatusTypes from '../enums/Video2MigrationStatusTypes';
export function fetchVideo2MigrationDataStatus() {
  return function (dispatch) {
    dispatch({
      type: ActionTypes.FETCH_VIDEO2_MIGRATION_DATA_ATTEMPTED
    });
    Video2OptInOptOutApi.fetchVideo2MigrationDataStatus().then(function (response) {
      dispatch({
        type: ActionTypes.FETCH_VIDEO2_MIGRATION_DATA_SUCCEEDED,
        latestFetchedPortalStatus: response.get('latestPortalStatus'),
        latestFetchedUserStatus: response.get('latestUserStatus')
      });
    }, function () {
      dispatch({
        type: ActionTypes.FETCH_VIDEO2_MIGRATION_DATA_FAILED
      });
    }).done();
  };
}

var getStatusUpdateSuccessActionType = function getStatusUpdateSuccessActionType() {
  return {
    type: ActionTypes.VIDEO_MIGRATION_STATUS_UPDATE_SUCCEEDED
  };
};

var getStatusUpdateFailureActionType = function getStatusUpdateFailureActionType() {
  return {
    type: ActionTypes.VIDEO_MIGRATION_STATUS_UPDATE_FAILED
  };
};

var getStatusUpdateAttemptActionType = function getStatusUpdateAttemptActionType(newUserMigrationStatus) {
  return {
    type: ActionTypes.VIDEO_MIGRATION_STATUS_UPDATE_ATTEMPTED,
    newUserMigrationStatus: newUserMigrationStatus
  };
};

export function remindMeLater() {
  return function (dispatch) {
    dispatch(getStatusUpdateAttemptActionType(Video2MigrationStatusTypes.REMIND_LATER));
    Video2OptInOptOutApi.updateVideoMigrationUserStatus(Video2MigrationStatusTypes.REMIND_LATER).then(function () {
      dispatch(getStatusUpdateSuccessActionType());
    }, function () {
      dispatch(getStatusUpdateFailureActionType());
    }).done();
  };
}
export function permissionToManuallyMigrateToVidyard() {
  return function (dispatch) {
    dispatch(getStatusUpdateAttemptActionType(Video2MigrationStatusTypes.PERMISSION_TO_MANUALLY_MIGRATE));
    Video2OptInOptOutApi.updateVideoMigrationUserStatus(Video2MigrationStatusTypes.PERMISSION_TO_MANUALLY_MIGRATE).then(function () {
      dispatch(getStatusUpdateSuccessActionType());
    }, function () {
      dispatch(getStatusUpdateFailureActionType());
    }).done();
  };
}