'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _DEFAULT_SORT_FOR_POS;

import BroadcastManager from '../data/BroadcastManager';
import allSettled from 'hs-promise-utils/allSettled';
import http from 'hub-http/clients/apiClient';
import { PUBLISHING_TABLE_RESULTS_PER_PAGE, BROADCAST_STATUS_TYPE } from '../lib/constants';
import { activeChannels } from '../redux/selectors/channels';
import { fetchStatusCounts } from '../redux/actions/broadcasts';
import { parse } from 'hub-http/helpers/params';
import { BROADCAST_POSTS_FETCH_BEGAN, BROADCAST_POSTS_FETCH_ERROR, BROADCAST_POSTS_FETCH_SUCCESS, BROADCAST_POST_DELETE_BEGAN, BROADCAST_POST_DELETE_ERROR, BROADCAST_POST_DELETE_SUCCESS } from './actionTypes';
import { getDefaultSortOrder } from '../lib/utils';
var broadcastManager = BroadcastManager.getInstance();
export var DEFAULT_SORT_FOR_POST_TYPES = (_DEFAULT_SORT_FOR_POS = {}, _defineProperty(_DEFAULT_SORT_FOR_POS, BROADCAST_STATUS_TYPE.scheduled, 'scheduledFor'), _defineProperty(_DEFAULT_SORT_FOR_POS, BROADCAST_STATUS_TYPE.uploaded, 'scheduledFor'), _defineProperty(_DEFAULT_SORT_FOR_POS, BROADCAST_STATUS_TYPE.failed, 'scheduledFor'), _defineProperty(_DEFAULT_SORT_FOR_POS, BROADCAST_STATUS_TYPE.draft, 'scheduledFor'), _defineProperty(_DEFAULT_SORT_FOR_POS, BROADCAST_STATUS_TYPE.pending, 'scheduledFor'), _DEFAULT_SORT_FOR_POS);
export var fetchBroadcastPosts = function fetchBroadcastPosts(_ref) {
  var statusType = _ref.statusType;
  return function (dispatch, getState) {
    dispatch({
      type: BROADCAST_POSTS_FETCH_BEGAN
    });
    var queryStringParams = location.search.substring(1);
    var queryParams = parse(queryStringParams);
    var accounts = queryParams.accounts;
    var campaign = queryParams.campaign;
    var createdBy = queryParams.createdBy;
    var networks = queryParams.networks ? queryParams.networks.split(',') : null;
    var page = queryParams.page;
    var query = queryParams.q; // If no other sort mechanism is provided,
    // scheduled posts should sort by the date that they are scheduled for

    var defaultSortBy = DEFAULT_SORT_FOR_POST_TYPES[statusType.toLowerCase()] || 'userUpdatedAt';
    var sortBy = queryParams.sortBy || defaultSortBy; // If sorting posts by the date that they are scheduled for, show posts
    // that are closest to the current date on top of the list

    var sortOrder = queryParams.sortOrder || getDefaultSortOrder(sortBy);
    var channelKeys = accounts ? accounts.split(',') : [];

    if (networks) {
      var channelKeysForSelectedNetworks = activeChannels(getState()).filter(function (channel) {
        return networks.includes(channel.accountSlug);
      }).toList().map(function (c) {
        return c.channelKey;
      }).toJS();
      channelKeys.push.apply(channelKeys, _toConsumableArray(channelKeysForSelectedNetworks));
    }

    return http.post('/broadcast/v2/broadcasts/fetch-broadcasts', {
      data: {
        c: channelKeys.length ? channelKeys : null,
        campaignGuid: campaign || null,
        count: PUBLISHING_TABLE_RESULTS_PER_PAGE,
        createdBy: createdBy,
        includeTotal: true,
        offset: page ? (page - 1) * PUBLISHING_TABLE_RESULTS_PER_PAGE : null,
        query: query,
        sortBy: sortBy,
        sortOrder: sortOrder,
        type: statusType
      }
    }).then(function (payload) {
      dispatch({
        type: BROADCAST_POSTS_FETCH_SUCCESS,
        payload: payload
      });
    }).catch(function (error) {
      dispatch({
        type: BROADCAST_POSTS_FETCH_ERROR,
        error: error
      });
    }).finally(function () {
      dispatch(fetchStatusCounts());
    });
  };
};

var deleteBroadcastPost = function deleteBroadcastPost(broadcastGuid) {
  return function (dispatch) {
    dispatch({
      type: BROADCAST_POST_DELETE_BEGAN
    });
    return broadcastManager.delete(broadcastGuid).then(function (payload) {
      dispatch({
        type: BROADCAST_POST_DELETE_SUCCESS,
        payload: payload
      });
    }).catch(function (error) {
      dispatch({
        type: BROADCAST_POST_DELETE_ERROR,
        error: error
      });
    });
  };
};

export var deleteBroadcastPosts = function deleteBroadcastPosts(broadcastsToDelete) {
  return function (dispatch) {
    return allSettled(broadcastsToDelete.map(function (broadcastGuid) {
      return dispatch(deleteBroadcastPost(broadcastGuid));
    }));
  };
};