'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _INTERACTION_CATEGORY;

import { List, fromJS } from 'immutable';
import { ACCOUNT_TYPES, FILE_FROM_URL_ID, INTERACTION_CATEGORIES, INTERACTION_TYPE_TO_CATEGORY } from '../../lib/constants';
import actionTypes from './actionTypes';
import { fetchFileManagerFile } from './content';
import ReportingPost from '../../data/model/ReportingPost';
import BroadcastManager from '../../data/BroadcastManager';
import BroadcastInteractionManager from '../../data/BroadcastInteractionManager';
import ReportManager from '../../data/ReportManager';
import ReportingPostManager from '../../data/ReportingPostManager';
import AdManager from '../../data/AdManager';
import Interaction from '../../data/model/Interaction';
import { fetchSocialAssistsCore } from './people';
import { getBroadcastCoreReportingPost } from '../selectors/broadcastCore';
import { getParamsForBroadcastTarget } from '../selectors/postTargeting';
import { getInsightStatsEnabled } from '../selectors/gates';
import { getUserCanBoostPosts } from '../selectors';
import Broadcast from '../../data/model/Broadcast';
var broadcastManager = BroadcastManager.getInstance();
var broadcastInteractionManager = BroadcastInteractionManager.getInstance();
var reportManager = ReportManager.getInstance();
var reportingPostManager = ReportingPostManager.getInstance();
var adManager = AdManager.getInstance();
var INTERACTION_CATEGORY_TO_FETCH_MAP = (_INTERACTION_CATEGORY = {}, _defineProperty(_INTERACTION_CATEGORY, INTERACTION_CATEGORIES.comment, function () {
  return broadcastInteractionManager.fetchComments.apply(broadcastInteractionManager, arguments);
}), _defineProperty(_INTERACTION_CATEGORY, INTERACTION_CATEGORIES.reaction, function () {
  return broadcastInteractionManager.fetchReactions.apply(broadcastInteractionManager, arguments);
}), _defineProperty(_INTERACTION_CATEGORY, INTERACTION_CATEGORIES.like, function () {
  return broadcastInteractionManager.fetchReactions.apply(broadcastInteractionManager, arguments);
}), _INTERACTION_CATEGORY);
export var deleteBroadcastCore = function deleteBroadcastCore(id) {
  return function (dispatch) {
    dispatch({
      type: actionTypes.BROADCAST_CORE_DELETE,
      apiRequest: function apiRequest() {
        return broadcastManager.delete(id);
      }
    });
  };
};
export var fetchBroadcastCore = function fetchBroadcastCore(id) {
  return function (dispatch, getState) {
    return dispatch({
      type: actionTypes.BROADCAST_CORE_FETCH,
      apiRequest: function apiRequest() {
        return broadcastManager.getById(id, getParamsForBroadcastTarget(getState())).then(Broadcast.createFrom);
      }
    });
  };
};
export var fetchBroadcastCoreInteractions = function fetchBroadcastCoreInteractions(broadcast) {
  var interactionType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'all';
  var bustCache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return function (dispatch) {
    return dispatch({
      type: actionTypes.BROADCAST_INTERACTIONS_FETCH,
      payload: {
        broadcastGuid: broadcast.broadcastGuid
      },
      apiRequest: function apiRequest() {
        var liveFetchingEnabled = broadcast.getNetwork() === ACCOUNT_TYPES.facebook;

        if (!liveFetchingEnabled) {
          return broadcastManager.getInteractions(broadcast.broadcastGuid).then(function (data) {
            var interactions = data.interactions;
            var interactionTotals = fromJS(data.interactionCountsByType).groupBy(function (total, type) {
              return INTERACTION_TYPE_TO_CATEGORY[type];
            }).map(function (types) {
              return types.reduce(function (memo, num) {
                return memo + num;
              });
            }, 0);
            return {
              interactions: Interaction.createFromArray(interactions),
              interactionTotals: interactionTotals
            };
          });
        }

        var fetchInteractions = INTERACTION_CATEGORY_TO_FETCH_MAP[interactionType] || broadcastInteractionManager.fetchAllInteractions;
        return fetchInteractions(broadcast, bustCache).then(function (interactions) {
          return {
            interactions: Interaction.createFromArray(interactions)
          };
        });
      }
    });
  };
};
export var fetchSocialPostsForBroadcast = function fetchSocialPostsForBroadcast(broadcast) {
  var expectedCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return function (dispatch) {
    dispatch({
      type: actionTypes.REPORTING_POST_FETCH_BEGAN
    });
    return reportingPostManager.fetchForBroadcast(broadcast, expectedCount).then(function (data) {
      dispatch({
        type: actionTypes.REPORTING_POST_FETCH_SUCCESS,
        data: data && ReportingPost.createFrom(data)
      });
    }).catch(function (error) {
      dispatch({
        type: actionTypes.REPORTING_POST_FETCH_ERROR,
        error: error
      });
    });
  };
};
export var fetchSocialPostsByBroadcastGuids = function fetchSocialPostsByBroadcastGuids(broadcastGuids, channelIds) {
  return function (dispatch) {
    dispatch({
      type: actionTypes.REPORTING_POSTS_FETCH_BEGAN
    });
    return reportingPostManager.fetchForBroadcastGuids(broadcastGuids, channelIds).then(function (data) {
      data.results = ReportingPost.createFromArray(data.results).filter(function (p) {
        return p.mediaType;
      });
      dispatch({
        type: actionTypes.REPORTING_POSTS_FETCH_SUCCESS,
        data: data
      });
      return data;
    }).catch(function (error) {
      dispatch({
        type: actionTypes.REPORTING_POSTS_FETCH_ERROR,
        error: error
      });
    });
  };
};
export var fetchVideoInsights = function fetchVideoInsights(broadcastGuid) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.BROADCAST_VIDEO_INSIGHTS_FETCH,
      payload: {
        broadcastGuid: broadcastGuid
      },
      apiRequest: function apiRequest() {
        return broadcastManager.fetchVideoInsights(broadcastGuid).then(fromJS);
      }
    });
  };
}; // Ads BE will eventually provide an endpoint that takes a specific id.
// For now this endpoint will suffice to surface whether a post has been boosted.

export var fetchBroadcastBoostedPosts = function fetchBroadcastBoostedPosts(broadcastGuid, foreignId) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.BROADCAST_BOOSTED_POSTS_FETCH,
      payload: {
        broadcastGuid: broadcastGuid,
        foreignId: foreignId
      },
      apiRequest: function apiRequest() {
        return adManager.fetchBoostedPosts([foreignId]).then(function (boostedPosts) {
          return boostedPosts.filter(function (post) {
            return post.postId === foreignId;
          });
        });
      }
    });
  };
};
export var fetchAdCampaigns = function fetchAdCampaigns(broadcastGuid, boostedPosts) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.BROADCAST_AD_CAMPAIGNS_FETCH,
      payload: {
        broadcastGuid: broadcastGuid
      },
      apiRequest: function apiRequest() {
        var facebookAccountIds = boostedPosts.map(function (boostedPost) {
          return boostedPost.accountId;
        });
        var facebookCampaignIds = boostedPosts.map(function (boostedPost) {
          return boostedPost.campaignId;
        });
        return adManager.fetchCampaigns({
          facebookAccountIds: facebookAccountIds
        }).then(function (campaigns) {
          var filteredCampaigns = campaigns.reports.filter(function (campaign) {
            return facebookCampaignIds.includes(campaign.entity.id);
          });
          return List(filteredCampaigns);
        });
      }
    });
  };
};
export var fetchBoostedPosts = function fetchBoostedPosts(foreignIds) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.BOOSTED_POSTS_FETCH,
      apiRequest: function apiRequest() {
        return adManager.fetchBoostedPosts(foreignIds);
      }
    });
  };
};
export var fetchSessionReport = function fetchSessionReport(broadcast) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.BROADCAST_SESSION_REPORT_FETCH,
      payload: {
        broadcastGuid: broadcast.broadcastGuid
      },
      apiRequest: function apiRequest() {
        return reportManager.fetchSessionReport(broadcast.getSourcesChannelId(), broadcast.broadcastGuid).then(fromJS);
      }
    });
  };
};
export var fetchClicksReport = function fetchClicksReport(broadcast) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.BROADCAST_CLICKS_REPORT_FETCH,
      payload: {
        broadcastGuid: broadcast.broadcastGuid
      },
      apiRequest: function apiRequest() {
        return reportManager.fetchClicksReport(broadcast.channelKey, broadcast.broadcastGuid).then(fromJS);
      }
    });
  };
}; // not yet used but researching and comparing with social-assists

export var fetchNewContactsReport = function fetchNewContactsReport(broadcast) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.BROADCAST_NEW_CONTACTS_FETCH,
      payload: {
        broadcastGuid: broadcast.broadcastGuid
      },
      apiRequest: function apiRequest() {
        return reportManager.fetchNewContactsReport(broadcast.getSourcesChannelId(), broadcast.broadcastGuid).then(fromJS);
      }
    });
  };
};
export var fetchBroadcastCoreDetails = function fetchBroadcastCoreDetails(broadcast) {
  return function (dispatch, getState) {
    var broadcastGuid = broadcast.broadcastGuid,
        foreignId = broadcast.foreignId;
    var insightsEnabled = getInsightStatsEnabled(getState());
    var fileId = broadcast.content.get('fileId');

    if (fileId && fileId !== FILE_FROM_URL_ID) {
      dispatch(fetchFileManagerFile(fileId, {
        broadcastGuid: broadcastGuid
      }));
    }

    if (broadcast.supportsVideoInsights()) {
      dispatch(fetchVideoInsights(broadcastGuid));
    }

    if (broadcast.supportsAssists()) {
      dispatch(fetchSocialAssistsCore(broadcastGuid));
    }

    if (insightsEnabled && broadcast.supportsClicks()) {
      dispatch(fetchSessionReport(broadcast));
      dispatch(fetchNewContactsReport(broadcast));
      dispatch(fetchClicksReport(broadcast));
    }

    if (getUserCanBoostPosts(getState()) && broadcast.getNetwork() === ACCOUNT_TYPES.facebook) {
      dispatch(fetchBroadcastBoostedPosts(broadcastGuid, foreignId)).then(function (boostedPosts) {
        return dispatch(fetchAdCampaigns(broadcastGuid, boostedPosts));
      });
    }

    if (broadcast.isPublished()) {
      if (!getBroadcastCoreReportingPost(getState(), {
        broadcastGuid: broadcastGuid
      })) {
        dispatch(fetchSocialPostsForBroadcast(broadcast));
      }
    }
  };
};
export var patchBroadcastCore = function patchBroadcastCore(broadcastGuid) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch) {
    return dispatch({
      type: actionTypes.BROADCAST_CORE_PATCH,
      payload: {
        broadcastGuid: broadcastGuid
      },
      apiRequest: function apiRequest() {
        return broadcastManager.patch(broadcastGuid, attrs).then(Broadcast.createFrom);
      }
    });
  };
};
export var updateBroadcastCore = function updateBroadcastCore(id, attrs) {
  return {
    type: actionTypes.BROADCAST_CORE_UPDATE,
    payload: {
      id: id,
      attrs: attrs
    }
  };
};