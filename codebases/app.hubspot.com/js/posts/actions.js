'use es6';

import Broadcast from '../data/model/Broadcast';
import BroadcastManager from '../data/BroadcastManager';
import FileManager from '../data/FileManager';
import I18n from 'I18n';
import actionTypes from '../redux/actions/actionTypes';
import allSettled from 'hs-promise-utils/allSettled';
import http from 'hub-http/clients/apiClient';
import { List, OrderedMap } from 'immutable';
import { ACCOUNT_TYPES, PUBLISHING_TABLE_RESULTS_PER_PAGE } from '../lib/constants';
import { cloneBroadcasts } from '../redux/actions/broadcastGroup';
import { fetchStatusCounts } from '../redux/actions/broadcasts';
import { getChannelsForComposerPicker } from '../redux/selectors/channels';
import { getPostById, getPosts } from './selectors';
import { logError } from '../lib/utils';
import { parse } from 'hub-http/helpers/params';
import { getUser } from '../redux/selectors/user';
import { showNotification } from '../redux/actions/ui';
import { POSTS_FETCH_BEGAN, POSTS_FETCH_ERROR, POSTS_FETCH_SUCCESS, POSTS_UPDATE_CAMPAIGN_BEGAN, POSTS_UPDATE_CAMPAIGN_ERROR, POSTS_UPDATE_CAMPAIGN_SUCCESS, POST_BULK_CLONE_BEGAN, POST_BULK_CLONE_ERROR, POST_BULK_CLONE_SUCCESS, POST_DELETE_BEGAN, POST_DELETE_ERROR, POST_DELETE_SUCCESS } from './actionTypes';
import ReportingPostMetadata from '../data/model/ReportingPostMetadata';
import { ALL_TIME_PRESET, parseDateRangeValueFromURL, safeConvertStringToEndOfDayTimestamp, safeConvertStringToStartOfDayTimestamp } from '../lib/dateUtils';
var broadcastManager = BroadcastManager.getInstance();
var fileManager = FileManager.getInstance(); // for some of the stats, BE seems to accept different keys.

var SORT_BY_MAP = {
  clicksNetwork: 'stats.clicksNetwork',
  campaignName: 'campaignGuid',
  videoViews: 'stats.videoViews'
};

var getStartAndEndDate = function getStartAndEndDate(defaultDateRangePreset) {
  var dateRangeValue = parseDateRangeValueFromURL(location.search, defaultDateRangePreset);
  var startDate = dateRangeValue.startDate,
      endDate = dateRangeValue.endDate;
  return {
    startRange: safeConvertStringToStartOfDayTimestamp(startDate),
    endRange: safeConvertStringToEndOfDayTimestamp(endDate)
  };
};

export var fetchPosts = function fetchPosts() {
  var defaultSort = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'publishedAt';
  var defaultDateRangePreset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ALL_TIME_PRESET;
  return function (dispatch, getState) {
    dispatch({
      type: POSTS_FETCH_BEGAN
    });
    var state = getState();
    var queryStringParams = location.search.substring(1);
    var queryParams = parse(queryStringParams);
    var campaign = queryParams.campaign;
    var createdBy = queryParams.createdBy;
    var page = queryParams.page;
    var query = queryParams.q;
    var sortBy = SORT_BY_MAP[queryParams.sortBy] || queryParams.sortBy || defaultSort;
    var sortOrder = queryParams.sortOrder || 'desc';
    var publishedVia = queryParams.publishedVia;
    var hideAll = Boolean(queryParams.hideAll);

    if (hideAll) {
      dispatch({
        type: POSTS_FETCH_SUCCESS,
        payload: {
          results: new OrderedMap(),
          total: null
        }
      });
      return Promise.resolve();
    }

    var networks = queryParams.networks ? queryParams.networks.split(',') : [];
    var channelKeys = queryParams.accounts ? queryParams.accounts.split(',') : []; // if we're fetching data for all the channels, we need to provide all 5 networks in the request.
    // it's a workaround for BE returning posts for inactive channels.
    // Details https://git.hubteam.com/HubSpot/SocialMediaTeam/issues/447

    if (!channelKeys.length && !networks.length) {
      networks = [ACCOUNT_TYPES.facebook, ACCOUNT_TYPES.instagram, ACCOUNT_TYPES.linkedin, ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.youtube];
    }

    var campaignGuids = campaign ? [campaign] : null;

    var _getStartAndEndDate = getStartAndEndDate(defaultDateRangePreset),
        startRange = _getStartAndEndDate.startRange,
        endRange = _getStartAndEndDate.endRange;

    return http.get("/social-reporting/v1/search/posts", {
      query: {
        campaignGuids: campaignGuids ? campaignGuids.join(',') : null,
        channelKeys: channelKeys,
        count: PUBLISHING_TABLE_RESULTS_PER_PAGE,
        createdBy: createdBy,
        endRange: endRange,
        includeTargetLabels: true,
        locale: getUser(state).locale,
        networks: networks,
        offset: page ? (page - 1) * PUBLISHING_TABLE_RESULTS_PER_PAGE : null,
        query: query,
        sortBy: sortBy,
        sortOrder: sortOrder,
        startRange: startRange,
        publishedVia: publishedVia
      }
    }).then(function (payload) {
      dispatch({
        type: POSTS_FETCH_SUCCESS,
        payload: payload
      });
    }).catch(function (error) {
      dispatch({
        type: POSTS_FETCH_ERROR,
        error: error
      });
    }).finally(function () {
      dispatch(fetchStatusCounts());
    });
  };
};
export var updatePostsCampaign = function updatePostsCampaign(postIds, campaignGuid) {
  return function (dispatch, getState) {
    dispatch({
      type: POSTS_UPDATE_CAMPAIGN_BEGAN
    });
    var posts = getPosts(getState());
    var selectedPosts = posts.filter(function (p) {
      return postIds.includes(p.id);
    });
    return http.put("/social-reporting/v1/posts/campaigns/batch", {
      query: {
        includeTargetLabels: true,
        locale: getUser(getState()).locale
      },
      data: {
        campaignGuid: campaignGuid,
        postKeys: selectedPosts.toList().toJS().map(function (post) {
          return {
            channelType: post.channelType,
            channelId: post.channelId,
            foreignId: post.foreignId
          };
        })
      }
    }).then(function (payload) {
      dispatch({
        type: POSTS_UPDATE_CAMPAIGN_SUCCESS,
        payload: payload
      });
    }).catch(function (error) {
      dispatch({
        type: POSTS_UPDATE_CAMPAIGN_ERROR,
        error: error
      });
    });
  };
};
export var deletePost = function deletePost(post) {
  return function (dispatch) {
    dispatch({
      type: POST_DELETE_BEGAN
    });
    return broadcastManager.delete(post.broadcastGuid).then(function () {
      dispatch({
        type: POST_DELETE_SUCCESS
      });
    }).catch(function (error) {
      dispatch({
        type: POST_DELETE_ERROR,
        error: error
      });
    });
  };
};
export var deletePosts = function deletePosts(postsToDelete) {
  return function (dispatch) {
    return allSettled(postsToDelete.map(function (post) {
      return dispatch(deletePost(post));
    }));
  };
};
export var clonePost = function clonePost(postId) {
  return function (dispatch, getState) {
    var post = getPostById(getState(), {
      postId: postId
    });
    var channels = getChannelsForComposerPicker(getState());

    if (post.broadcastGuid) {
      // has broadcast
      return broadcastManager.getById(post.broadcastGuid).then(function (broadcastData) {
        return Broadcast.createFrom(broadcastData);
      });
    } else {
      // has no broadcast
      if (post.metadata.media.size > 0) {
        // need to upload the media
        return allSettled(post.metadata.media.map(function (media) {
          return fileManager.downloadFromUrl(media.url);
        })).then(function (res) {
          return Broadcast.createFromPost(channels, post, res.map(function (r) {
            return r.value;
          }));
        }) // if the API failed to retrive the image, we want to proceed cloning without the image.
        .catch(function () {
          return Broadcast.createFromPost(channels, post.set('metadata', new ReportingPostMetadata()).set('cloneFailed', true));
        });
      }

      try {
        return Broadcast.createFromPost(channels, post);
      } catch (error) {
        logError(error, {
          postId: postId
        });
        return new Error(error);
      }
    }
  };
};
export var clonePosts = function clonePosts() {
  var postIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return function (dispatch) {
    dispatch({
      type: POST_BULK_CLONE_BEGAN
    });
    allSettled(postIds.map(function (postId) {
      return dispatch(clonePost(postId));
    })).then(function (res) {
      dispatch({
        type: POST_BULK_CLONE_SUCCESS
      });
      return dispatch(cloneBroadcasts(List(res.map(function (r) {
        return r.value;
      }))));
    }).catch(function (error) {
      dispatch({
        type: POST_BULK_CLONE_ERROR,
        error: error
      });
      dispatch(showNotification({
        id: actionTypes.SHOW_NOTIFICATION,
        type: 'danger',
        titleText: I18n.text("sui.clonePosts.errorAlert.header"),
        message: I18n.text("sui.clonePosts.errorAlert.message", {
          count: postIds.length
        })
      }));
    });
  };
};