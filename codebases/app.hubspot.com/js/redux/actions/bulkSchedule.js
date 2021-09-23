'use es6';

import I18n from 'I18n';
import { Set as ImmutableSet } from 'immutable';
import { createAction } from 'flux-actions';
import http from 'hub-http/clients/apiClient';
import keyMirror from 'react-utils/keyMirror';
import PortalIdParser from 'PortalIdParser';
import actionTypes from './actionTypes';
import { fetchStatusCounts, fetchBroadcasts, startPollingBroadcasts } from './broadcasts';
import { BROADCAST_STATUS_TYPE } from '../../lib/constants';
import BroadcastManager from '../../data/BroadcastManager';
import { showNotification } from './ui';
import { goToManageUrl } from '../../manage/actions';
import { trackInteraction } from './usage';
import { logDebug } from '../../lib/utils';
var broadcastManager = BroadcastManager.getInstance();
var portalId = PortalIdParser.get();

var handleBulkScheduleSuccess = function handleBulkScheduleSuccess(uploadCount, dispatch) {
  var notification = {
    id: actionTypes.SHOW_NOTIFICATION,
    type: 'success',
    titleText: I18n.text('sui.bulkScheduleModal.success.header', {
      count: uploadCount
    }),
    message: I18n.text('sui.bulkScheduleModal.success.note_V2', {
      count: uploadCount
    })
  };
  logDebug('[poll] switching into upload polling mode');
  dispatch({
    type: actionTypes.BROADCASTS_UPLOADED_POLL_BEGAN
  });
  dispatch(goToManageUrl('uploaded'));
  dispatch(showNotification(notification));
};

export var bulkScheduleMessages = function bulkScheduleMessages(file) {
  return function (dispatch) {
    var formData = new FormData();
    formData.append('file', file);
    var options = {
      query: {
        portalId: portalId
      },
      data: formData,
      headers: {
        'content-type': false
      },
      timeout: 30000
    };
    dispatch({
      type: actionTypes.BULK_SCHEDULE_UPLOAD,
      apiRequest: function apiRequest() {
        return http.post('broadcast/v2/bulk/upload', options).then(function (data) {
          dispatch(trackInteraction('bulk schedule v2 success'));
          handleBulkScheduleSuccess(data.uploadCount, dispatch);
          dispatch(startPollingBroadcasts());
          return data;
        }).catch(function (error) {
          var errorData = ['internal error'];

          if (error && error.responseJSON) {
            if (error.responseJSON.errors) {
              var errorMessageSet = new ImmutableSet(error.responseJSON.errors.map(function (e) {
                return e.message;
              }));
              errorData = errorMessageSet.toArray();
            } else if (error.responseJSON.errorTokens) {
              var _errorMessageSet = new ImmutableSet(error.responseJSON.errorTokens.bulkError);

              errorData = _errorMessageSet.toArray();
            }
          }

          dispatch(trackInteraction('bulk schedule v2 failure', {
            errors: errorData
          }));
          throw error;
        });
      }
    });
  };
};

var handleBulkActionSuccess = function handleBulkActionSuccess(bulkActionType, dispatch) {
  var notification = {
    id: actionTypes.SHOW_NOTIFICATION,
    type: 'success',
    titleText: I18n.text('sui.broadcasts.bulkActions.success.header'),
    message: I18n.text("sui.broadcasts.bulkActions.success." + bulkActionType)
  };
  dispatch(showNotification(notification));

  if (bulkActionType === 'deleteAll') {
    dispatch(goToManageUrl());
  } else {
    var sidebarTab = bulkActionType === 'moveToDrafts' ? BROADCAST_STATUS_TYPE.draft : BROADCAST_STATUS_TYPE.scheduled;
    dispatch(goToManageUrl(sidebarTab));
  }
};

var BULK_STATUS_CHANGE_ERRORS = keyMirror({
  INVALID_BULK_SCHEDULE_TRIGGER_AT: null
});
export var executeBulkStatusChange = function executeBulkStatusChange(bulkAction) {
  return function (dispatch) {
    dispatch({
      type: actionTypes.BULK_UPLOAD_STATUS_CHANGE,
      apiRequest: function apiRequest() {
        return broadcastManager.moveBulkMessages(bulkAction).then(function (data) {
          dispatch(fetchBroadcasts());
          dispatch(fetchStatusCounts());
          dispatch(trackInteraction("bulk status change success - " + bulkAction));
          handleBulkActionSuccess(bulkAction, dispatch);
          return data;
        }).catch(function (error) {
          var errorSet = ImmutableSet(error.responseJSON.errors);

          if (errorSet.contains(BULK_STATUS_CHANGE_ERRORS.INVALID_BULK_SCHEDULE_TRIGGER_AT)) {
            error.messageCode = "bulk_upload_status_change." + BULK_STATUS_CHANGE_ERRORS.INVALID_BULK_SCHEDULE_TRIGGER_AT.toLowerCase();
          }

          dispatch(trackInteraction("bulk status change failure - " + bulkAction));
          throw error;
        });
      }
    });
  };
};
export var bulkScheduleDone = createAction(actionTypes.BULK_SCHEDULE_UPLOAD_DONE);