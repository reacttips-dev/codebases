'use es6';

import Raven from 'Raven';
import { Map as ImmutableMap } from 'immutable';
import actionTypes from './actionTypes';
import { updateHubSetting } from './users';
import { ALL_RIVAL_IQ_CHANNELS, LANDSCAPE_SETTING } from '../../lib/constants';
import StreamManager from '../../data/StreamManager';
import TweetManager from '../../data/TweetManager';
import Landscape from '../../data/model/Landscape';
import { isRivalIqEnabled } from '../selectors';
var streamManager = StreamManager.getInstance();
var tweetManager = TweetManager.getInstance();

var toHubSettings = function toHubSettings(landscape) {
  var clone = Object.assign({}, landscape);
  delete clone.posts;
  clone.companies.forEach(function (c) {
    delete c.posts;
  });
  return ImmutableMap(clone);
};

export var createLandscape = function createLandscape() {
  return function (dispatch) {
    dispatch({
      type: actionTypes.LANDSCAPE_CREATE,
      apiRequest: function apiRequest() {
        return streamManager.createRivalIqLandscape().then(function (landscape) {
          dispatch(updateHubSetting(LANDSCAPE_SETTING, toHubSettings(landscape)));
          return Landscape.createFrom(landscape);
        });
      }
    });
  };
};
export var fetchSocialPosts = function fetchSocialPosts(landscapeId) {
  return function (dispatch, getState) {
    var _getState = getState(),
        config = _getState.landscapeConfig;

    var opts = {
      orderBy: config.orderBy,
      direction: config.direction,
      limit: 100
    };

    if (config.network) {
      opts.channel = config.network;

      if (opts.channel === 'all') {
        opts.channel = ALL_RIVAL_IQ_CHANNELS.join();
      }
    }

    if (config.timePeriod) {
      opts.timePeriod = config.timePeriod;
    }

    if (config.companyId) {
      opts.companyId = config.companyId;
    }

    if (config.landscapeSearch) {
      opts.searchTerm = config.landscapeSearch;
    }

    return dispatch({
      type: actionTypes.LANDSCAPE_FETCH_SOCIAL_POSTS,
      apiRequest: function apiRequest() {
        return streamManager.fetchRivalIqPosts(landscapeId, opts).then(function (_ref) {
          var rivalIqPosts = _ref.socialPosts;
          var twitterPosts = rivalIqPosts.filter(function (p) {
            return p.channel === 'twitter';
          });

          if (!twitterPosts.length) {
            return rivalIqPosts;
          } else {
            var twitterStatusIds = twitterPosts.map(function (p) {
              return p.postNativeId;
            });
            return tweetManager.bulkStatusLookup(twitterStatusIds).then(function (twitterStatuses) {
              return rivalIqPosts.map(function (rivalIqPost) {
                if (rivalIqPost.channel !== 'twitter') {
                  return rivalIqPost;
                }

                var status = twitterStatuses.find(function (s) {
                  return s.idString === rivalIqPost.postNativeId;
                });

                if (!status) {
                  return rivalIqPost;
                }

                return Object.assign({}, rivalIqPost, {
                  message: status.text,
                  postLink: "https://twitter.com/" + status.user.name + "/status/" + status.idString,
                  publishedAt: status.createdAt
                });
              }).filter(function (post) {
                return post.postLink;
              });
            });
          }
        });
      }
    });
  };
};
export var fetchLandscape = function fetchLandscape(landscapeId) {
  return function (dispatch, getState) {
    if (!isRivalIqEnabled(getState())) {
      throw new Error('no access to landscape');
    }

    return dispatch({
      type: actionTypes.LANDSCAPE_FETCH,
      apiRequest: function apiRequest() {
        return streamManager.fetchRivalIqLandscape(landscapeId).then(function (landscape) {
          dispatch(updateHubSetting(LANDSCAPE_SETTING, toHubSettings(landscape)));
          dispatch(fetchSocialPosts(landscapeId));
          return Landscape.createFrom(landscape);
        });
      }
    });
  };
};

var fetchPendingOperationStatus = function fetchPendingOperationStatus(token, landscapeId) {
  var retries = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 40;
  return function (dispatch) {
    dispatch({
      type: actionTypes.LANDSCAPE_FETCH_PENDING_OPERATION_STATUS,
      apiRequest: function apiRequest() {
        return streamManager.fetchPendingOperationStatus(token).then(function (status) {
          if (retries === 0) {
            Raven.captureBreadcrumb('[Landscape fetch] pending operation max retries exceeded');
          } // this works because we only allow following one company at a time


          var url = Object.keys(status.urls)[0];

          switch (status.urls[url].status) {
            case 1:
              return setTimeout(function () {
                dispatch(fetchPendingOperationStatus(token, landscapeId, retries - 1));
              }, 500);

            case 2:
              return dispatch(fetchLandscape(landscapeId));

            case 3:
              Raven.captureBreadcrumb("[Landscape fetch] Unable to follow url: " + url);
              break;

            default:
              Raven.captureBreadcrumb('[Landscape fetch] Unrecognized status code');
              break;
          }

          return null;
        });
      }
    });
  };
};

export var followCompany = function followCompany(company) {
  var retries = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
  return function (dispatch, getState) {
    if (retries === 0) {
      throw new Error('no landscape found');
    }

    var _getState2 = getState(),
        landscape = _getState2.landscape;

    if (landscape) {
      var landscapeId = landscape.id;
      dispatch({
        type: actionTypes.LANDSCAPE_FOLLOW_COMPANY,
        apiRequest: function apiRequest() {
          return streamManager.followRivalIqCompany(landscapeId, company).then(function (pendingOperation) {
            dispatch(fetchPendingOperationStatus(pendingOperation.token, landscapeId));
          });
        }
      });
    } else {
      setTimeout(function () {
        return dispatch(followCompany(company, retries - 1));
      }, 200);
    }
  };
};
export var unfollowCompany = function unfollowCompany(landscapeId, companyId) {
  return function (dispatch) {
    dispatch({
      type: actionTypes.LANDSCAPE_UNFOLLOW_COMPANY,
      apiRequest: function apiRequest() {
        return streamManager.unfollowRivalIqCompany(landscapeId, companyId).then(function () {
          dispatch(fetchLandscape(landscapeId));
        });
      }
    });
  };
};