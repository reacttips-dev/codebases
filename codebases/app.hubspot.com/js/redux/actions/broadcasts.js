'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { createAction } from 'flux-actions';
import enviro from 'enviro';
import { Map as ImmutableMap, Set as ImmutableSet, fromJS, OrderedMap, List as ImmutableList } from 'immutable';
import I18n from 'I18n';
import actionTypes from './actionTypes';
import { logDebug } from '../../lib/utils';
import { getCalendarBroadcasts, getRoute } from '../selectors';
import { getPublishableChannels } from '../selectors/channels';
import { showNotification, updateRequest } from './ui';
import { BROADCAST_STATUS_TYPE, APP_SECTIONS, BROADCAST_VALIDATION_ERRORS, REQUEST_STATUS } from '../../lib/constants';
import { getParamsForBroadcastTarget } from '../selectors/postTargeting';
import { trackInteraction } from './usage';
import { quickFetchResponse } from '../../lib/quickFetch';
import BroadcastManager from '../../data/BroadcastManager';
import { getIsUngatedForManageBeta } from '../selectors/gates';
import { fetchBroadcastPosts } from '../../broadcasts/actions';
import { getBroadcastPost } from '../../broadcasts/selectors';
import { fetchPosts } from '../../posts/actions';
import Broadcast from '../../data/model/Broadcast';
import { cloneBroadcast, cloneBroadcasts } from './broadcastGroup';
import allSettled from 'hs-promise-utils/allSettled';
import { POST_BULK_CLONE_BEGAN, POST_BULK_CLONE_ERROR, POST_BULK_CLONE_SUCCESS } from './../../posts/actionTypes';
var broadcastManager = BroadcastManager.getInstance();
var BROADCASTS_REFRESH_DELAY = 10000;
var BROADCASTS_REFRESH_COUNT_CUTOFF = 5000; // do not refresh when there are than this number of broadcasts

var MAX_CHANNEL_KEYS_FOR_QUICK_FETCH = 100; // keep inline with same constant in quickFetch.js, we are hesitant to put more than this number of channelKeys in query string until we prove its safe

export var updateBroadcast = createAction(actionTypes.BROADCAST_UPDATE, function (id, attrs) {
  return {
    id: id,
    attrs: attrs
  };
});
export var updateCalendarBroadcast = createAction(actionTypes.CALENDAR_BROADCAST_UPDATE, function (date, broadcastGuid, attrs) {
  return {
    date: date,
    broadcastGuid: broadcastGuid,
    attrs: attrs
  };
});
export var fetchBroadcast = function fetchBroadcast(id) {
  return function (dispatch, getState) {
    return dispatch({
      type: actionTypes.BROADCAST_FETCH,
      apiRequest: function apiRequest() {
        return broadcastManager.getById(id, getParamsForBroadcastTarget(getState())).then(Broadcast.createFrom);
      }
    });
  };
};
var hasLoadedBroadcastsOnce = false;
export var fetchBroadcasts = function fetchBroadcasts(polling) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.BROADCASTS_FETCH,
      payload: {
        polling: polling
      },
      apiRequest: function apiRequest(state) {
        var makeApiCall = function makeApiCall() {
          var dataFilter = state.dataFilter;
          var isUngatedForManageDash = getIsUngatedForManageBeta(state);
          var params = broadcastManager.getParamsFromDataFilter(dataFilter, isUngatedForManageDash);
          return (dataFilter.requestedStatusType === BROADCAST_STATUS_TYPE.uploaded ? broadcastManager.fetchUploaded() : broadcastManager.fetch(params, polling)).then(function (data) {
            data.broadcasts = Broadcast.createFromArray(data.broadcasts);
            data.broadcastStatusType = dataFilter.requestedStatusType;

            if (data.uploadedErrors) {
              data.uploadedErrors = ImmutableMap(data.uploadedErrors).map(ImmutableSet);
            }

            return data;
          }).catch(function (err) {
            if (polling) {
              // prevent floating notification when this fails
              err.handled = true;
            }

            throw err;
          });
        };

        var quickFetchedBroadcastsPromise = quickFetchResponse('published-broadcasts');

        if (!hasLoadedBroadcastsOnce && quickFetchedBroadcastsPromise) {
          return quickFetchedBroadcastsPromise.then(function (_data) {
            hasLoadedBroadcastsOnce = true;
            return {
              broadcasts: Broadcast.createFromArray(_data),
              broadcastStatusType: window._publishingQuickFetchStatus
            };
          }).catch(makeApiCall);
        }

        return makeApiCall();
      }
    });
  };
};
export var fetchCalendarBroadcasts = function fetchCalendarBroadcasts(month) {
  var channelKeys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableSet();
  var ignoreExisting = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var statusTypes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [BROADCAST_STATUS_TYPE.scheduled];
  var clearExisting = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  return function (dispatch, getState) {
    var state = getState();
    var calendarBroadcasts = getCalendarBroadcasts(state); // only actually request channelKeys from the API we don't yet have broadcasts for

    var existingChannelKeys = calendarBroadcasts.getChannelKeysForDate(month);

    if (!ignoreExisting && existingChannelKeys) {
      channelKeys = channelKeys.subtract(existingChannelKeys);

      if (channelKeys.isEmpty()) {
        return null;
      }
    }

    dispatch(updateRequest('broadcastsFetch', REQUEST_STATUS.loading));
    var promises = statusTypes.map(function (type, index) {
      return dispatch({
        type: actionTypes.BROADCASTS_FETCH_IN_DATE_RANGE,
        channelKeys: channelKeys,
        month: month,
        clearExisting: clearExisting && index === 0,
        // only clear existing for first fetch
        apiRequest: function apiRequest() {
          return broadcastManager.fetchInDateRange(month, channelKeys.toJS(), type, getParamsForBroadcastTarget(state)).then(Broadcast.createFromArray);
        }
      });
    });
    return Promise.all(promises).then(function () {
      dispatch(updateRequest('broadcastsFetch', REQUEST_STATUS.success));
    }).catch(function () {
      dispatch(updateRequest('broadcastsFetch', null));
    });
  };
};
export var fetchStatusCounts = function fetchStatusCounts(polling) {
  return function (dispatch, getState) {
    var isUngatedForManageBeta = getIsUngatedForManageBeta(getState());
    var channels = getPublishableChannels(getState());

    if (channels.isEmpty()) {
      return null;
    }

    var channelKeys = channels.map(function (c) {
      return c.channelKey;
    }).toSet();
    var fetchMethod = broadcastManager.fetchStatusCounts;

    if (channelKeys.size <= MAX_CHANNEL_KEYS_FOR_QUICK_FETCH || window._publishingQuickFetchAttempted) {
      fetchMethod = broadcastManager.fetchStatusCountsWithPublished;
    }

    return dispatch({
      type: actionTypes.BROADCAST_COUNT_FETCH,
      apiRequest: function apiRequest() {
        return fetchMethod.call(broadcastManager, polling, channelKeys.toJS(), !isUngatedForManageBeta).catch(function (err) {
          if (polling) {
            // prevent floating notification when this fails
            err.handled = true;
          }

          throw err;
        });
      }
    });
  };
};
var timeout;

var doPollBroadcasts = function doPollBroadcasts() {
  return function (dispatch, getState) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    var state = getState();
    var dataFilter = state.dataFilter,
        ui = state.ui,
        bulkSchedule = state.bulkSchedule,
        broadcastCounts = state.broadcastCounts;
    var route = getRoute(state);
    var uploadCount = bulkSchedule.get('uploadCount');
    var statusCounts = broadcastCounts.get('byStatus');

    if (route && ![APP_SECTIONS.publishing, APP_SECTIONS.details].includes(route.id)) {
      // PublishingContainer will call again if it re-mounts
      return;
    }

    var pollingUploaded = ui.get('isPollingUploaded');
    var tabIsFocused = document.hasFocus && document.hasFocus();
    var hasClickedRecently = window.app.lastClickedAt ? window.app.lastClickedAt > I18n.moment().subtract(1, 'minute').valueOf() : true;

    if (dataFilter.total > BROADCASTS_REFRESH_COUNT_CUTOFF || dataFilter.shouldPollBroadcasts === false) {
      logDebug("[poll] Not polling due to too many broadcasts");
      return;
    }

    var delay = pollingUploaded ? 1000 : BROADCASTS_REFRESH_DELAY;

    var enqueue = function enqueue() {
      logDebug("[poll] enqueuing for " + delay + "ms later");
      timeout = setTimeout(function () {
        dispatch(doPollBroadcasts());
      }, delay);
    };

    if (pollingUploaded && (statusCounts.get(BROADCAST_STATUS_TYPE.uploaded) >= uploadCount || dataFilter.broadcastStatusType !== BROADCAST_STATUS_TYPE.uploaded)) {
      logDebug("[poll] detected completion of bulk upload polling");
      dispatch({
        type: actionTypes.BROADCASTS_UPLOADED_POLL_DONE
      });
      delay = BROADCASTS_REFRESH_DELAY;
    }

    if (!hasClickedRecently) {
      logDebug("[poll] skipping cycle because user has not clicked recently, last click: " + I18n.moment(window.app.lastClickedAt).format());
      enqueue();
      return;
    } // requiring focus to be on document prevents debugging (since focusing on dev tools blurs focus from app)
    // this specific debug flag will remove that requirement, only use when actually debugging polling


    if (enviro.debug('social_polling') || tabIsFocused) {
      var shouldUpdateBroadcasts = true;

      if (!pollingUploaded && I18n.moment(dataFilter.broadcastsLastRequested).isAfter(I18n.moment().subtract(BROADCASTS_REFRESH_DELAY / 2, 'ms'))) {
        logDebug("[poll] skipping cycle because we have requested broadcasts recently, at: " + I18n.moment(dataFilter.broadcastsLastRequested).format());
        shouldUpdateBroadcasts = false;
      }

      if (shouldUpdateBroadcasts) {
        /*
        We don't want to show loading indicator while doing a regular poll
        We do want to show it when the uploaded broadcasts from a just-uploaded
        bulk upload are being fetched.
         */
        if (pollingUploaded) {
          document.querySelector('html').classList.remove('auto-refreshing');
        } else {
          logDebug('[poll] adding auto-refreshing class to mask loading');
          document.querySelector('html').classList.add('auto-refreshing');
        }

        dispatch(fetchBroadcasts(true)).then(function () {
          logDebug('[poll] done refreshing broadcasts');
        });
      }

      var statusPromise = dispatch(fetchStatusCounts(true));

      if (statusPromise) {
        statusPromise.then(function () {
          enqueue();
        }).catch(function (err) {
          logDebug("[poll] canceled polling due to failure", err);
          throw err;
        });
        return;
      }
    }

    enqueue();
  };
};

export var startPollingBroadcasts = function startPollingBroadcasts() {
  return function (dispatch, getState) {
    var pollingUploaded = getState().ui.get('isPollingUploaded');
    var delay = pollingUploaded ? 1000 : BROADCASTS_REFRESH_DELAY;

    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    var enqueue = function enqueue() {
      logDebug("[poll] enqueuing for " + delay + "ms later");
      timeout = setTimeout(function () {
        dispatch(doPollBroadcasts());
      }, delay);
    };

    var statusPromise = dispatch(fetchStatusCounts());

    if (statusPromise) {
      statusPromise.then(function () {
        enqueue();
      }).catch(function (err) {
        logDebug("[poll] not started due to failure", err);
        throw err;
      });
      return;
    }

    enqueue();
  };
};

var refreshTable = function refreshTable() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      statusType = _ref.statusType;

  return function (dispatch, getState) {
    dispatch(trackInteraction('refresh table'));
    var state = getState();
    var route = getRoute(state);
    var isUngatedForManageBeta = getIsUngatedForManageBeta(state);
    var isInManageDash = window.location.pathname.indexOf(APP_SECTIONS.manage) !== -1;

    if (!statusType && route) {
      var params = route.params;
      statusType = params.statusType;
    }

    if (isUngatedForManageBeta && isInManageDash) {
      if (statusType === BROADCAST_STATUS_TYPE.published) {
        dispatch(fetchPosts());
      } else {
        dispatch(fetchBroadcastPosts({
          statusType: statusType
        }));
      }
    } else {
      dispatch(fetchBroadcasts());
      dispatch(fetchStatusCounts());
    }
  };
};

var actionErrorHandler = function actionErrorHandler(action) {
  return function (dispatch) {
    dispatch(showNotification({
      id: actionTypes.SHOW_NOTIFICATION,
      type: 'danger',
      titleText: I18n.text("sui." + action + ".errorAlert.header"),
      message: I18n.text("sui." + action + ".errorAlert.message")
    }));
    dispatch(refreshTable());
  };
};

var bulkActionErrorHandler = function bulkActionErrorHandler(resps, ids, action) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return function (dispatch) {
    var errorsByGuid = OrderedMap(resps.filter(function (r) {
      return r.status === 'rejected';
    }).map(function (r, i) {
      return [ids[i], r];
    }));
    errorsByGuid = errorsByGuid.map(function (r) {
      var err = r.reason;

      if (err.responseJSON && err.responseJSON.errors && err.responseJSON.errors.length > 0) {
        return ImmutableSet(err.responseJSON.errors);
      }

      return ImmutableSet.of(BROADCAST_VALIDATION_ERRORS.UNKNOWN_API_ERROR);
    });
    var successfulByGuid = OrderedMap(resps.filter(function (r) {
      return r.status === 'fulfilled';
    }).map(function (r) {
      return [r.value.broadcastGuid, fromJS(r)];
    }));

    if (!errorsByGuid.isEmpty()) {
      dispatch(showNotification({
        id: actionTypes.SHOW_NOTIFICATION,
        type: 'danger',
        titleText: I18n.text("sui." + action + ".errorAlert.header"),
        message: I18n.text("sui." + action + ".errorAlert.message", {
          count: errorsByGuid.size
        })
      }));
    }

    dispatch(refreshTable(options));
    return {
      successfulByGuid: successfulByGuid,
      errorsByGuid: errorsByGuid
    };
  };
};

export var patchBroadcast = function patchBroadcast(broadcastGuid) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch) {
    dispatch(trackInteraction('patch broadcast'));
    return dispatch({
      type: actionTypes.BROADCAST_PATCH,
      payload: {
        broadcastGuid: broadcastGuid
      },
      apiRequest: function apiRequest() {
        return broadcastManager.patch(broadcastGuid, attrs).then(Broadcast.createFrom);
      }
    });
  };
};
export var patchBroadcasts = function patchBroadcasts(ids, attrs) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (dispatch) {
    dispatch({
      type: actionTypes.BROADCASTS_PATCH,
      apiRequest: function apiRequest() {
        return allSettled(ids.map(function (id) {
          return broadcastManager.patch(id, attrs);
        })).then(function (resps) {
          return dispatch(bulkActionErrorHandler(resps, ids, 'bulkEditCampaign', options));
        }).then(function () {
          // ignore response and apply updated attrs to broadcasts if request succeeds
          dispatch({
            type: actionTypes.BROADCASTS_UPDATE,
            payload: {
              ids: ids,
              attrs: attrs
            }
          });
        }).finally(function () {
          return dispatch(fetchStatusCounts());
        });
      }
    });
  };
};
export var makeDraft = function makeDraft(id) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch) {
    dispatch(trackInteraction('make draft'));
    return dispatch({
      type: actionTypes.BROADCASTS_MAKE_DRAFT,
      apiRequest: function apiRequest() {
        return broadcastManager.makeDraft(id).catch(function () {
          return dispatch(actionErrorHandler('makeDraft'));
        }).finally(function () {
          return dispatch(refreshTable(options));
        });
      }
    });
  };
};
export var makeDrafts = function makeDrafts(ids) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch) {
    dispatch({
      type: actionTypes.BROADCASTS_MAKE_DRAFT_BULK,
      apiRequest: function apiRequest() {
        return allSettled(ids.map(function (id) {
          return broadcastManager.makeDraft(id);
        })).then(function (resps) {
          return dispatch(bulkActionErrorHandler(resps, ids, 'bulkMakeDraft', options));
        });
      }
    });
  };
};
export var deleteBroadcast = function deleteBroadcast(id) {
  return function (dispatch) {
    dispatch(trackInteraction('delete broadcast'));
    return dispatch({
      type: actionTypes.BROADCAST_DELETE,
      apiRequest: function apiRequest() {
        return broadcastManager.delete(id).catch(function () {
          return dispatch(actionErrorHandler('deleteBroadcast'));
        }).finally(function () {
          return dispatch(refreshTable());
        });
      }
    });
  };
};
export var deleteBroadcasts = function deleteBroadcasts(ids) {
  return function (dispatch) {
    dispatch({
      type: actionTypes.BROADCAST_DELETE_BULK,
      apiRequest: function apiRequest() {
        return allSettled(ids.map(function (id) {
          return broadcastManager.delete(id);
        })).then(function (resps) {
          return dispatch(bulkActionErrorHandler(resps, ids, 'bulkDelete'));
        });
      }
    });
  };
};
export var exportDone = createAction(actionTypes.EXPORT_DONE);
export var exportBroadcasts = function exportBroadcasts(email, type) {
  return function (dispatch) {
    dispatch(trackInteraction('export broadcasts'));
    dispatch({
      type: actionTypes.BROADCASTS_EXPORT,
      apiRequest: function apiRequest() {
        return broadcastManager.exportBroadcasts(email, type.toUpperCase());
      }
    });
  };
};
export var moveCalendarBroadcast = function moveCalendarBroadcast(broadcast, triggerAt) {
  return function (dispatch) {
    var broadcastMoment = I18n.moment.utc(broadcast.triggerAt).portalTz();

    if (broadcast.isPublished()) {
      return dispatch(cloneBroadcast(broadcast, broadcast.getNetwork(), {
        triggerAt: triggerAt.valueOf()
      }));
    }

    dispatch(updateCalendarBroadcast(broadcastMoment, broadcast.broadcastGuid, {
      isSaving: true
    }));
    return dispatch(patchBroadcast(broadcast.broadcastGuid, {
      campaignGuid: broadcast.campaignGuid,
      triggerAt: triggerAt.valueOf()
    })).then(function () {
      return dispatch(updateCalendarBroadcast(broadcastMoment, broadcast.broadcastGuid, {
        triggerAt: triggerAt.valueOf(),
        isSaving: false
      }));
    });
  };
};
export var bulkCloneBroadcasts = function bulkCloneBroadcasts() {
  var broadcastGuids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return function (dispatch, getState) {
    dispatch({
      type: POST_BULK_CLONE_BEGAN
    }); // Stop if no broadcasts were passed to this function (at least one is necessary)

    if (!broadcastGuids || !broadcastGuids.length) {
      dispatch({
        type: POST_BULK_CLONE_ERROR,
        error: 'No broadcasts could be found to clone'
      });
      dispatch(showNotification({
        id: actionTypes.SHOW_NOTIFICATION,
        type: 'danger',
        titleText: I18n.text("sui.clonePosts.errorAlert.header"),
        message: I18n.text("sui.clonePosts.errorAlert.message", {
          count: broadcastGuids.length
        })
      }));
      return;
    }

    var state = getState();
    var selectedBroadcasts = broadcastGuids.map(function (broadcastGuid) {
      return getBroadcastPost(state, {
        broadcastGuid: broadcastGuid
      });
    });
    dispatch(cloneBroadcasts(ImmutableList.of.apply(ImmutableList, _toConsumableArray(selectedBroadcasts))));
    dispatch({
      type: POST_BULK_CLONE_SUCCESS
    });
  };
};