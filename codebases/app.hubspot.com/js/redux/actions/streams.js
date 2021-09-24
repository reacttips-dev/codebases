'use es6';

import { OrderedMap, OrderedSet, fromJS } from 'immutable';
import actionTypes from './actionTypes';
import StreamManager from '../../data/StreamManager';
import FeedManager from '../../data/FeedManager';
import Stream from '../../data/model/Stream';
import StreamItem from '../../data/model/StreamItem';
import SocialItemAction from '../../data/model/SocialItemAction';
import { getActorForChannel } from './feed';
import { fetchSocialContactsBatch } from './people';
import { getSocialContactsEnabled } from '../selectors';
import { getUserId } from '../selectors/user';
import { interactingAsChannel, getTwitterChannelsAvailableForStreams } from '../selectors/channels';
import { ACCOUNT_TYPES, STREAM_ITEM_PAGE_SIZE, STREAM_TYPES } from '../../lib/constants';
import { fetchRelationships } from './relationships';
var streamManager = StreamManager.getInstance();
var feedManager = FeedManager.getInstance();

var fetchRelationshipsForStream = function fetchRelationshipsForStream(streamItems, channels) {
  return function (dispatch) {
    var fromIds = channels.filter(function (c) {
      return c.accountSlug === ACCOUNT_TYPES.twitter;
    }).map(function (c) {
      return c.channelKey.split(':')[1];
    }).toSet();
    var toIds = streamItems.map(function (i) {
      return i.userIdString;
    }).toSet();
    dispatch(fetchRelationships(fromIds, toIds));
  };
};

export var getEmptyStream = function getEmptyStream(portalId, createdBy) {
  return function (dispatch, getState) {
    var channelsForStreams = getTwitterChannelsAvailableForStreams(getState());

    if (channelsForStreams.isEmpty()) {
      return null;
    }

    var channel = channelsForStreams.first();
    return Stream.createFrom({
      definition: {
        accountGuid: channel.accountGuids.first(),
        twitterUserId: channel.channelId,
        twitterUsername: channel.username,
        includeRetweets: true
      },
      notificationSetting: {
        mobileUserIds: [],
        userIds: []
      },
      portalId: portalId,
      streamType: STREAM_TYPES.TWITTER_SEARCH,
      streamPriority: 'REGULAR',
      createdBy: createdBy
    });
  };
};
export var fetchStreams = function fetchStreams() {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.STREAMS_FETCH,
      apiRequest: function apiRequest() {
        return streamManager.fetchStreams().then(function (data) {
          return Stream.createFromArray(data).filter(function (s) {
            return s.state === 'ACTIVE';
          });
        });
      }
    });
  };
};
export var fetchStreamItemAncestors = function fetchStreamItemAncestors(streamItem, channelKey) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.STREAM_ITEM_ANCESTORS_FETCH,
      payload: {
        streamItem: streamItem
      },
      apiRequest: function apiRequest() {
        return streamManager.fetchStreamItemAncestors(channelKey, streamItem.resourceId).then(function (data) {
          return StreamItem.createFromArray(data).sortBy(function (i) {
            return i.createdAt;
          });
        });
      }
    });
  };
};

function loadStreamRelationships(dispatch, streamItems, channelKey, channels) {
  var opts = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  if (streamItems.isEmpty()) {
    return streamItems;
  }

  var users = streamItems.reduce(function (acc, item) {
    return acc.concat(item.getUserLookups());
  }, OrderedSet());

  if (opts.socialContactsEnabled) {
    dispatch(fetchSocialContactsBatch(users));
  }

  dispatch(fetchRelationshipsForStream(streamItems, channels));
  streamItems.filter(function (i) {
    return i.isReply;
  }).forEach(function (i) {
    dispatch(fetchStreamItemAncestors(i, channelKey, i));
  });
  return streamItems;
}

export var fetchStream = function fetchStream(streamGuid, searchText, lastItemAt) {
  var replace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  return function (dispatch, getState) {
    var state = getState();
    var streams = state.streams;
    var channel = interactingAsChannel(state);
    var socialContactsEnabled = getSocialContactsEnabled(state);
    var streamItems = streams.get(streamGuid) ? streams.get(streamGuid).items : OrderedMap();
    return dispatch({
      type: actionTypes.STREAM_FETCH,
      apiRequest: function apiRequest(resultState) {
        return streamManager.fetchStream(streamGuid, searchText, lastItemAt).then(function (data) {
          var stream = Stream.createFrom(data.stream);
          var items = StreamItem.createFromArray(data.items, streamGuid);
          stream = stream.set('items', replace ? items : streamItems.concat(items)).merge({
            itemsHaveLoaded: true,
            hasMoreItems: items.size === STREAM_ITEM_PAGE_SIZE
          });

          if (channel) {
            loadStreamRelationships(dispatch, stream.items, channel.channelKey, resultState.logicalChannels, {
              socialContactsEnabled: socialContactsEnabled
            });
          }

          return stream;
        });
      }
    });
  };
};
export var createStream = function createStream(stream) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.STREAM_CREATE,
      apiRequest: function apiRequest() {
        return streamManager.createStream(stream).then(function (data) {
          return Stream.createFrom(data);
        });
      }
    });
  };
};
export var saveStream = function saveStream(stream) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.STREAM_SAVE,
      apiRequest: function apiRequest() {
        return streamManager.saveStream(stream).then(function () {
          return stream;
        });
      }
    });
  };
};
export var deleteStream = function deleteStream(streamGuid) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.STREAM_DELETE,
      payload: {
        streamGuid: streamGuid
      },
      apiRequest: function apiRequest() {
        return streamManager.deleteStream(streamGuid);
      }
    });
  };
};
export var markStreamRead = function markStreamRead(streamGuid) {
  return function (dispatch, getState) {
    var userId = getState().user.user_id;
    return dispatch({
      type: actionTypes.STREAM_MARK_READ,
      apiRequest: function apiRequest() {
        return streamManager.markStreamRead(streamGuid, userId);
      }
    });
  };
};
export var fetchPreviewStream = function fetchPreviewStream(stream) {
  return function (dispatch) {
    if (!stream.canPreview()) {
      return dispatch({
        type: actionTypes.STREAM_PREVIEW_FETCH + "_SUCCESS",
        data: stream
      });
    }

    return dispatch({
      type: actionTypes.STREAM_PREVIEW_FETCH,
      apiRequest: function apiRequest() {
        return streamManager.fetchStreamPreview(stream).then(function (data) {
          return Stream.createFrom(data.stream).set('items', StreamItem.createFromArray(data.items)).set('itemsHaveLoaded', true);
        });
      }
    });
  };
};
export var fetchStreamItem = function fetchStreamItem(streamGuid, id) {
  return function (dispatch, getState) {
    var channelKey = interactingAsChannel(getState()).channelKey;
    var socialContactsEnabled = getSocialContactsEnabled(getState());
    return dispatch({
      type: actionTypes.STREAM_ITEM_FETCH,
      payload: {
        streamGuid: streamGuid
      },
      apiRequest: function apiRequest(state) {
        return streamManager.fetchStreamItem(streamGuid, id).then(function (data) {
          return StreamItem.createFromArray([data], streamGuid);
        }).then(function (streamItems) {
          loadStreamRelationships(dispatch, streamItems, channelKey, state.logicalChannels, {
            socialContactsEnabled: socialContactsEnabled
          });
          return streamItems.toList().first();
        });
      }
    });
  };
};

function getParamsForItemAction(channel, streamItem) {
  return {
    parentId: streamItem.resourceId,
    remoteUserIdOfActedUpon: streamItem.userIdString,
    remoteUserIdOfActor: getActorForChannel(channel)
  };
}

export var favoriteStreamItem = function favoriteStreamItem(channel, streamItem) {
  return function (dispatch, getState) {
    var params = Object.assign({}, getParamsForItemAction(channel, streamItem), {
      userId: getUserId(getState())
    });
    return dispatch({
      type: actionTypes.STREAM_ITEM_FAVORITE,
      payload: {
        streamItem: streamItem
      },
      apiRequest: function apiRequest() {
        return feedManager.favoriteItem(channel.accountSlug, channel.channelKey, streamItem.resourceId, params).then(SocialItemAction.createFrom);
      }
    });
  };
};
export var unfavoriteStreamItem = function unfavoriteStreamItem(channel, streamItem) {
  return function (dispatch, getState) {
    var params = Object.assign({}, getParamsForItemAction(channel, streamItem), {
      userId: getUserId(getState())
    });
    return dispatch({
      type: actionTypes.STREAM_ITEM_UNFAVORITE,
      payload: {
        streamItem: streamItem
      },
      apiRequest: function apiRequest() {
        return feedManager.unfavoriteItem(channel.accountSlug, channel.channelKey, streamItem.resourceId, params).then(SocialItemAction.createFrom);
      }
    });
  };
};
export var retweetStreamItem = function retweetStreamItem(channel, streamItem) {
  return function (dispatch, getState) {
    var params = Object.assign({}, getParamsForItemAction(channel, streamItem), {
      userId: getUserId(getState())
    });
    return dispatch({
      type: actionTypes.STREAM_ITEM_RETWEET,
      payload: {
        streamItem: streamItem
      },
      apiRequest: function apiRequest() {
        return feedManager.retweetItem(channel.accountSlug, channel.channelKey, streamItem.resourceId, params).then(SocialItemAction.createFrom);
      }
    });
  };
};
export var unretweetStreamItem = function unretweetStreamItem(channel, streamItem) {
  return function (dispatch, getState) {
    var params = Object.assign({}, getParamsForItemAction(channel, streamItem), {
      userId: getUserId(getState())
    });
    return dispatch({
      type: actionTypes.STREAM_ITEM_UNRETWEET,
      payload: {
        streamItem: streamItem
      },
      apiRequest: function apiRequest() {
        return feedManager.unretweetItem(channel.accountSlug, channel.channelKey, streamItem.resourceId, params).then(SocialItemAction.createFrom);
      }
    });
  };
};
export var replyToStreamItem = function replyToStreamItem(channel, streamItem, text) {
  return function (dispatch, getState) {
    var params = Object.assign({
      text: text
    }, getParamsForItemAction(channel, streamItem), {
      userId: getUserId(getState())
    });
    return dispatch({
      type: actionTypes.STREAM_ITEM_REPLY,
      payload: {
        streamItem: streamItem
      },
      apiRequest: function apiRequest() {
        return feedManager.replyToItem(channel.accountSlug, channel.channelKey, streamItem.resourceId, params).then(SocialItemAction.createFrom);
      }
    });
  };
};
export var createQuoteTweet = function createQuoteTweet(channel, streamItem, remoteUserIdOfActedUpon, broadcastGuid, text, createdAt) {
  return function (dispatch, getState) {
    var params = {
      parentId: streamItem.resourceId,
      remoteUserIdOfActedUpon: remoteUserIdOfActedUpon,
      remoteUserIdOfActor: getActorForChannel(channel),
      text: text,
      createdAt: createdAt,
      childForeignId: broadcastGuid,
      userId: getUserId(getState())
    };
    return dispatch({
      type: actionTypes.STREAM_ITEM_QUOTE,
      payload: {
        streamItem: streamItem
      },
      apiRequest: function apiRequest() {
        return feedManager.quoteItem(channel.accountSlug, channel.channelKey, streamItem.resourceId, params).then(SocialItemAction.createFrom);
      }
    });
  };
};
export var fetchContactList = function fetchContactList(listId) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.CONTACT_LIST_FETCH,
      apiRequest: function apiRequest() {
        return streamManager.fetchContactList(listId).then(fromJS);
      }
    });
  };
};
export var fetchContactLists = function fetchContactLists(query) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.CONTACT_LISTS_FETCH,
      apiRequest: function apiRequest() {
        return streamManager.fetchContactLists(query);
      }
    });
  };
};
export var fetchTwitterLists = function fetchTwitterLists(channelKey) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.TWITTER_LISTS_FETCH,
      apiRequest: function apiRequest() {
        return streamManager.fetchTwitterLists(channelKey);
      }
    });
  };
};