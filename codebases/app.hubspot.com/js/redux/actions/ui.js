'use es6';

import { createAction } from 'flux-actions';
import { identity } from 'underscore';
import I18n from 'I18n';
import { fromJS } from 'immutable';
import PortalIdParser from 'PortalIdParser';
import http from 'hub-http/clients/apiClient';
import ViewTypes from 'ui-addon-calendars/constants/CalendarViewTypes';
import { trackInteraction } from './usage';
import actionTypes from './actionTypes';
import { updateDataFilter } from './dataFilter';
import { getDataFilter } from '../selectors';
export var updateUi = createAction(actionTypes.UI_UPDATE, identity);
export var setRoute = createAction(actionTypes.SET_ROUTE, function (routes, params) {
  return {
    routes: routes,
    params: params
  };
});
export var updateStorage = createAction(actionTypes.STORAGE_UPDATE, identity);
export var updateRequest = createAction(actionTypes.REQUEST_UPDATE, function (requestName, status) {
  return {
    requestName: requestName,
    status: status
  };
});
export var setConnectStep = createAction(actionTypes.SET_CONNECT_STEP, identity);
export var setConnectingAccountGuid = createAction(actionTypes.SET_CONNECTING_ACCOUNT_GUID, identity);
export var setConnectingNetwork = createAction(actionTypes.SET_CONNECTING_NETWORK, identity);
export var openMedia = function openMedia(media) {
  return function (dispatch) {
    dispatch({
      type: actionTypes.MEDIA_OPEN,
      payload: media
    });
    dispatch(trackInteraction('open media panel'));
  };
};
export var closeMedia = function closeMedia() {
  return function (dispatch) {
    dispatch({
      type: actionTypes.MEDIA_CLOSE
    });
    dispatch(trackInteraction('close media panel'));
  };
};
export var showNotification = function showNotification(notification) {
  return {
    type: actionTypes.SHOW_NOTIFICATION,
    meta: {
      notification: notification
    }
  };
};
export var fetchUnboxing = function fetchUnboxing() {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.UNBOXING_FETCH,
      apiRequest: function apiRequest() {
        return http.get("broadcast/v1/unboxsettings/" + PortalIdParser.get()).then(fromJS);
      }
    });
  };
};
export var fetchLinkShorteningDomains = function fetchLinkShorteningDomains() {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.LINK_SHORTENING_DOMAINS_FETCH,
      apiRequest: function apiRequest() {
        return http.get('/broadcast/v1/shortlink/config').then(fromJS);
      }
    });
  };
};
export var saveUnboxing = function saveUnboxing(name) {
  return function (dispatch, getState) {
    var setting = {
      name: name,
      userId: getState().user.user_id,
      portalId: PortalIdParser.get(),
      timestamp: I18n.moment().portalTz().valueOf()
    };
    dispatch({
      type: actionTypes.UNBOXING_SAVE,
      apiRequest: function apiRequest() {
        return http.post('broadcast/v1/unboxsettings', {
          data: setting
        }).then(fromJS);
      }
    });
  };
};
export var setCalendarViewType = function setCalendarViewType(calendarViewType) {
  return function (dispatch) {
    dispatch(updateDataFilter({
      calendarViewType: calendarViewType
    }, {
      isCalendarMode: true
    }));
  };
};
export var moveCalendarToNextPeriod = function moveCalendarToNextPeriod() {
  return function (dispatch, getState) {
    var dataFilter = getDataFilter(getState());
    var calendarDate = dataFilter.calendarDate.clone().add(1, dataFilter.calendarViewType);

    if (dataFilter.calendarViewType === ViewTypes.MONTH) {
      // so if we move to next month and then change to week/day mode, we are at the first one
      calendarDate = calendarDate.startOf('month');
    }

    dispatch(updateDataFilter({
      calendarDate: calendarDate
    }, {
      isCalendarMode: true
    }));
  };
};
export var moveCalendarToPreviousPeriod = function moveCalendarToPreviousPeriod() {
  return function (dispatch, getState) {
    var dataFilter = getDataFilter(getState());
    var calendarDate = dataFilter.calendarDate.clone().subtract(1, dataFilter.calendarViewType);
    dispatch(updateDataFilter({
      calendarDate: calendarDate
    }, {
      isCalendarMode: true
    }));
  };
};
export var moveCalendarToNow = function moveCalendarToNow() {
  return function (dispatch) {
    var calendarDate = I18n.moment().portalTz();
    dispatch(updateDataFilter({
      calendarDate: calendarDate
    }, {
      isCalendarMode: true
    }));
  };
};
export var updateComposerHostContext = createAction(actionTypes.COMPOSER_HOST_CONTEXT_UPDATE, identity);