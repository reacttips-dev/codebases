'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { createAction } from 'flux-actions';
import { replace } from 'react-router-redux';
import { identity } from 'underscore';
import { isNumeric } from '../../lib/utils';
import { List, Map as ImmutableMap, OrderedSet, Set as ImmutableSet, fromJS } from 'immutable';
import actionTypes from './actionTypes';
import { ACCOUNT_TYPES, SOCIAL_USER_LOOKUP_TYPES } from '../../lib/constants';
import { fetchRelationshipsForChannels } from './relationships';
import { currentLocation, getSocialContactsEnabled } from '../selectors';
import { getPublishableChannels } from '../selectors/channels';
import FeedManager from '../../data/FeedManager';
import ProfileManager from '../../data/ProfileManager';
import Interaction from '../../data/model/Interaction';
import Intel from '../../data/model/Intel';
import FeedUser from '../../data/model/FeedUser';
import UserLookup from '../../data/model/UserLookup';
import SourcesManager from '../../data/SourcesManager';
import Assist from '../../data/model/Assist';
var sourcesManager = SourcesManager.getInstance();
var feedManager = FeedManager.getInstance();
var profileManager = ProfileManager.getInstance();
var profileOpenAction = createAction(actionTypes.PROFILE_OPEN, function (feedUser, channel) {
  return {
    feedUser: feedUser,
    channel: channel
  };
});
var profileCloseAction = createAction(actionTypes.PROFILE_CLOSE, identity);

var fetchTwitterProfile = function fetchTwitterProfile(userId) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.TWITTER_PROFILE_FETCH,
      apiRequest: function apiRequest() {
        return profileManager.fetchTwitterProfile(userId).then(fromJS);
      }
    });
  };
};

var fetchTwitterProfileByUsername = function fetchTwitterProfileByUsername(username) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.TWITTER_PROFILE_FETCH,
      apiRequest: function apiRequest() {
        return profileManager.fetchTwitterProfileByUsername(username).then(fromJS);
      }
    });
  };
};

var fetchFacebookProfile = function fetchFacebookProfile(userId) {
  return function (dispatch) {
    userId = userId.replace('Page:', '');
    return dispatch({
      type: actionTypes.FACEBOOK_PROFILE_FETCH,
      apiRequest: function apiRequest() {
        return profileManager.fetchFacebookProfile(userId).then(fromJS);
      }
    });
  };
};

export var fetchSocialContactsBatch = function fetchSocialContactsBatch(users) {
  return function (dispatch) {
    if (users.isEmpty()) {
      return null;
    }

    return dispatch({
      type: actionTypes.SOCIAL_CONTACTS_BATCH_FETCH,
      apiRequest: function apiRequest() {
        return profileManager.fetchSocialContactsBatch(users).then(function (data) {
          return Intel.parseFromSocialContactsBatch(data);
        });
      }
    });
  };
};
export var fetchSocialItemActionsAsInteractions = function fetchSocialItemActionsAsInteractions(userId, network) {
  return function (dispatch, getState) {
    var networkIntel = getState().intel.getNetwork(network);
    return dispatch({
      type: actionTypes.TWITTER_INTERACTIONS_FETCH,
      apiRequest: function apiRequest(state) {
        return feedManager.fetchSocialItemActions(userId, network).then(function (_data) {
          return List(_data.map(function (data) {
            return Interaction.createFromMonitoringInteraction(data, network, networkIntel, getPublishableChannels(state));
          }).filter(function (i) {
            return i;
          })).sortBy(function (i) {
            return -i.timestamp;
          });
        });
      }
    });
  };
};

var fetchTwitterExtraInfo = function fetchTwitterExtraInfo(dispatch, userId) {
  dispatch(fetchSocialItemActionsAsInteractions(userId, ACCOUNT_TYPES.twitter));
  dispatch(fetchRelationshipsForChannels(ImmutableSet.of(userId)));
};

export var openProfile = function openProfile(feedUser, channel) {
  return function (dispatch, getState) {
    if (!feedUser) {
      return;
    }

    if (!feedUser.getUserId() && !feedUser.getUsername()) {
      return;
    }

    var currentPath = currentLocation(getState());
    var socialContactsEnabled = getSocialContactsEnabled(getState());
    dispatch(profileOpenAction(feedUser, channel));

    if (feedUser.network !== 'email') {
      // still not sure if we should support contact vid/email permalinks
      dispatch(replace(currentPath.pathname + "?profile=" + feedUser.getUrlKey()));
    }

    if (feedUser.network === ACCOUNT_TYPES.twitter) {
      if (isNumeric(feedUser.getUserId())) {
        dispatch(fetchTwitterProfile(feedUser.getUserId()));
        fetchTwitterExtraInfo(dispatch, feedUser.getUserId());

        if (socialContactsEnabled) {
          var userLookups = ImmutableSet.of(new UserLookup({
            id: feedUser.getUserId(),
            network: feedUser.network,
            username: feedUser.getUsername()
          }));
          dispatch(fetchSocialContactsBatch(userLookups, feedUser.network));
        }
      } else {
        dispatch(fetchTwitterProfileByUsername(feedUser.getUserId())).then(function (data) {
          fetchTwitterExtraInfo(dispatch, data.get('profile').get('id'));
        });
      }
    } else if (feedUser.network === SOCIAL_USER_LOOKUP_TYPES.email && !feedUser.contact) {
      if (feedUser.contact && feedUser.contact.properties.get('twitterhandle')) dispatch(fetchTwitterProfileByUsername(feedUser.contact.properties.get('twitterhandle'))).then(function (data) {
        fetchTwitterExtraInfo(dispatch, data.get('profile').get('id'));
      });
    } else if (feedUser.network === ACCOUNT_TYPES.facebook) {
      dispatch(fetchFacebookProfile(feedUser.getUserId()));
      dispatch(fetchSocialItemActionsAsInteractions(feedUser.getUserId(), ACCOUNT_TYPES.facebook));
    }
  };
};
export var openProfileByStreamItem = function openProfileByStreamItem(streamItem) {
  return function (dispatch, getState) {
    var currentPath = currentLocation(getState());
    var feedUser = streamItem.toFeedUser();
    dispatch(profileOpenAction(feedUser));
    dispatch(replace(currentPath.pathname + "?profile=" + feedUser.getUrlKey()));
    dispatch(fetchTwitterProfile(feedUser.getUserId()));
    dispatch(fetchSocialItemActionsAsInteractions(feedUser.getUserId(), ACCOUNT_TYPES.twitter));
  };
}; // only supports twitter for now

export var openProfileByUsername = function openProfileByUsername(network, username) {
  return function (dispatch, getState) {
    var currentPath = currentLocation(getState());
    return dispatch(fetchTwitterProfileByUsername(username)).then(function (data) {
      var twitterProfile = data.get('profile');
      var feedUser = new FeedUser({
        network: ACCOUNT_TYPES.twitter,
        twitterProfile: twitterProfile
      });
      dispatch(replace(currentPath.pathname + "?profile=" + feedUser.getUrlKey()));
      dispatch(profileOpenAction(feedUser));
      var lookup = new UserLookup({
        id: 'TWITTER_USERNAME',
        username: username
      });
      fetchSocialContactsBatch(OrderedSet.of(lookup));
      fetchTwitterExtraInfo(dispatch, feedUser.getUserId());
    });
  };
};
export var openProfileById = function openProfileById(network, userId, twitterProfile) {
  return function (dispatch, getState) {
    var socialContactsEnabled = getSocialContactsEnabled(getState());
    var currentPath = currentLocation(getState());
    var feedUser = new FeedUser(_defineProperty({
      network: network
    }, network + "_details", ImmutableMap({
      id: userId,
      twitterProfile: twitterProfile
    })));
    dispatch(profileOpenAction(feedUser));

    if (network !== 'email') {
      // still not sure if we should support contact vid/email permalinks
      dispatch(replace(currentPath.pathname + "?profile=" + network + ":" + userId));
    }

    if (network === ACCOUNT_TYPES.twitter) {
      if (isNumeric(userId)) {
        dispatch(fetchTwitterProfile(userId));
        fetchTwitterExtraInfo(dispatch, userId);

        if (socialContactsEnabled) {
          var userLookups = ImmutableSet.of(new UserLookup({
            id: userId,
            network: network,
            username: twitterProfile && twitterProfile.get('screenName')
          }));
          dispatch(fetchSocialContactsBatch(userLookups));
        }
      } else {
        dispatch(fetchTwitterProfileByUsername(userId)).then(function (data) {
          fetchTwitterExtraInfo(dispatch, data.get('profile').get('id'));
        });
      }
    } else if (network === ACCOUNT_TYPES.facebook) {
      dispatch(fetchFacebookProfile(userId));
      dispatch(fetchSocialItemActionsAsInteractions(userId, ACCOUNT_TYPES.facebook));
    }
  };
};
export var closeProfile = function closeProfile() {
  return function (dispatch, getState) {
    var currentPath = currentLocation(getState());
    dispatch(replace(currentPath.pathname));
    dispatch(profileCloseAction());
  };
};
export var fetchSocialAssistsCore = function fetchSocialAssistsCore(broadcastGuid) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.BROADCAST_SOCIAL_ASSISTS_FETCH,
      payload: {
        broadcastGuid: broadcastGuid
      },
      apiRequest: function apiRequest() {
        return sourcesManager.fetchSocialAssists(broadcastGuid).then(function (data) {
          return Assist.createFromArray(data.people);
        });
      }
    });
  };
};