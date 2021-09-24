'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as ActionTypes from './ActionTypes';
import * as FileManagerPortalDataApi from '../api/PortalMeta';
import I18n from 'I18n';
import { reportError } from '../utils/logging';
import { DiscoverabilityPopupDismissed, ShutterstockTosValues, TRACK_EVENT, VidyardTosStatus } from '../Constants';
import PortalMetaCategoryIds from '../enums/PortalMetaCategoryIds';
export function fetchFileManagerPortalData() {
  return function (dispatch) {
    return FileManagerPortalDataApi.fetchFileManagerPortalData().then(function (response) {
      var portalDataList = response.get('objects');
      dispatch({
        type: ActionTypes.FETCH_PORTAL_META_SUCCEEDED,
        portalDataList: portalDataList
      });
      return portalDataList;
    }).catch(function (err) {
      reportError(err, {
        action: ActionTypes.FETCH_PORTAL_META_FAILED
      });
      dispatch({
        type: ActionTypes.FETCH_PORTAL_META_FAILED
      });
      throw err;
    });
  };
}
export function getUpdateVidyardTosStatusSucceededAction(vidyardTosStatus) {
  return {
    type: ActionTypes.UPDATE_VIDYARD_TOS_STATUS_SUCCEEDED,
    vidyardTosStatus: vidyardTosStatus,
    meta: Object.assign({}, vidyardTosStatus === VidyardTosStatus.ACCEPTED && {
      notification: {
        type: 'success',
        titleText: I18n.text('FileManagerCore.notifications.updateVidyardToS.success.title'),
        message: I18n.text('FileManagerCore.notifications.updateVidyardToS.success.message')
      }
    })
  };
}
export function getUpdateVidyardTosStatusFailedAction() {
  return {
    type: ActionTypes.UPDATE_VIDYARD_TOS_STATUS_FAILED,
    meta: {
      notification: {
        type: 'danger',
        titleText: I18n.text('FileManagerCore.notifications.updateVidyardToS.error.title'),
        message: I18n.text('FileManagerCore.notifications.updateVidyardToS.error.message')
      }
    }
  };
}
export function getUpdateVidyardTosStatusAttemptedAction() {
  return {
    type: ActionTypes.UPDATE_VIDYARD_TOS_STATUS_ATTEMPTED
  };
}
export function getUpdateVidyardTosStatus(newVidyardTosStatus) {
  return function (dispatch) {
    dispatch(getUpdateVidyardTosStatusAttemptedAction());
    FileManagerPortalDataApi.updateVidyardTosStatus(newVidyardTosStatus).then(function () {
      dispatch(getUpdateVidyardTosStatusSucceededAction(newVidyardTosStatus));
    }, function () {
      dispatch(getUpdateVidyardTosStatusFailedAction());
    });
  };
}
export var updatePortalMeta = function updatePortalMeta(category, apiValue) {
  var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (dispatch) {
    dispatch({
      type: ActionTypes.UPDATE_PORTAL_META_ATTEMPTED
    });
    FileManagerPortalDataApi.updatePortalMeta({
      category: category,
      category_value: apiValue
    }).then(function () {
      return dispatch({
        type: ActionTypes.UPDATE_PORTAL_META_SUCCEEDED,
        category: category,
        apiValue: apiValue,
        meta: meta
      });
    }).catch(function (err) {
      reportError(err, {
        type: ActionTypes.UPDATE_PORTAL_META_FAILED
      });
      dispatch({
        type: ActionTypes.UPDATE_PORTAL_META_FAILED
      });
    });
  };
};
export var dismissAdvancedSearchDashboardPopup = function dismissAdvancedSearchDashboardPopup() {
  return function (dispatch) {
    return dispatch(updatePortalMeta(PortalMetaCategoryIds.DASHBOARD_ADVANCED_SEARCH_POPUP, DiscoverabilityPopupDismissed, _defineProperty({}, TRACK_EVENT, {
      eventKey: 'fileManagerExploreFiles',
      action: 'advanced-search-dismiss'
    })));
  };
};
export var dismissAdvancedSearchPickerPopup = function dismissAdvancedSearchPickerPopup() {
  return function (dispatch) {
    return dispatch(updatePortalMeta(PortalMetaCategoryIds.PICKER_ADVANCED_SEARCH_POPUP, DiscoverabilityPopupDismissed, _defineProperty({}, TRACK_EVENT, {
      eventKey: 'fileManagerExploreFiles',
      action: 'advanced-search-dismiss'
    })));
  };
};
export var dismissFilesTrashPopup = function dismissFilesTrashPopup() {
  return function (dispatch) {
    return dispatch(updatePortalMeta(PortalMetaCategoryIds.FILES_TRASH_POPUP, DiscoverabilityPopupDismissed, _defineProperty({}, TRACK_EVENT, {
      eventKey: 'fileManagerExploreFiles',
      action: 'files-trash-dismiss-popover'
    })));
  };
};
export var acceptShutterstockTos = function acceptShutterstockTos() {
  return function (dispatch) {
    return dispatch(updatePortalMeta(PortalMetaCategoryIds.SHUTTERSTOCK_TOS, ShutterstockTosValues.ACCEPTED));
  };
};
export var setShutterstockFolderId = function setShutterstockFolderId(folderId) {
  return function (dispatch) {
    return dispatch(updatePortalMeta(PortalMetaCategoryIds.SHUTTERSTOCK_FOLDER_ID, folderId));
  };
};