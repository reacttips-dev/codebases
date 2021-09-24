'use es6';

import Immutable from 'immutable';
import * as ActionTypes from '../actions/ActionTypes';
import { RequestStatus } from '../Constants';
var DEFAULT_STATE = Immutable.Map({
  updateMigrationStatusRequestStatus: RequestStatus.UNINITIALIZED,
  updatedUserStatus: null,
  fetchMigrationDataRequestStatus: RequestStatus.UNINITIALIZED,
  latestFetchedPortalStatus: null,
  latestFetchedUserStatus: null
});
export default function video2Migration() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STATE;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      latestFetchedPortalStatus = action.latestFetchedPortalStatus,
      latestFetchedUserStatus = action.latestFetchedUserStatus,
      updatedUserStatus = action.updatedUserStatus;

  switch (type) {
    case ActionTypes.VIDEO_MIGRATION_STATUS_UPDATE_ATTEMPTED:
      return state.merge({
        updateMigrationStatusRequestStatus: RequestStatus.PENDING,
        updatedUserStatus: updatedUserStatus
      });

    case ActionTypes.VIDEO_MIGRATION_STATUS_UPDATE_SUCCEEDED:
      return state.merge({
        updateMigrationStatusRequestStatus: RequestStatus.SUCCEEDED
      });

    case ActionTypes.VIDEO_MIGRATION_STATUS_UPDATE_FAILED:
      return state.merge({
        updateMigrationStatusRequestStatus: RequestStatus.FAILED
      });

    case ActionTypes.FETCH_VIDEO2_MIGRATION_DATA_ATTEMPTED:
      return state.merge({
        fetchMigrationDataRequestStatus: RequestStatus.PENDING
      });

    case ActionTypes.FETCH_VIDEO2_MIGRATION_DATA_SUCCEEDED:
      return state.merge({
        fetchMigrationDataRequestStatus: RequestStatus.SUCCEEDED,
        latestFetchedPortalStatus: latestFetchedPortalStatus,
        latestFetchedUserStatus: latestFetchedUserStatus
      });

    case ActionTypes.FETCH_VIDEO2_MIGRATION_DATA_FAILED:
      return state.merge({
        fetchMigrationDataRequestStatus: RequestStatus.FAILED
      });

    default:
      return state;
  }
}