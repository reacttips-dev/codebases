'use es6';

import { identity, pick } from 'underscore';
import { createAction } from 'flux-actions';
import I18n from 'I18n';
import actionTypes from './actionTypes';
import { Map as ImmutableMap, List } from 'immutable';
import { replace } from 'react-router-redux';
import { ACCOUNT_TYPES, CHANNEL_TYPES, FEED_INTERACTION_TYPES, APP_SECTIONS, WHO_TRUNCATE_LIMIT, INTERACTION_TYPE_TO_CATEGORY, INTERACTION_CATEGORIES, DRILLDOWN_KEY_TO_FEED_INTERACTION_TYPE, BROADCAST_MEDIA_TYPE, NETWORKS_TO_IDS, DEFERRED_CHANNEL_NETWORKS } from '../../lib/constants';
import { fetchBroadcastCoreInteractions, fetchSocialPostsByBroadcastGuids } from './broadcastCore';
import { fetchFileManagerFile } from './content';
import { fetchLandscape } from './landscape';
import { fetchSocialContactsBatch } from './people';
import { fetchRelationships } from './relationships';
import { getSocialContactsEnabled, currentLocation, getAppSection } from '../selectors';
import { inboxChannels, getPublishableChannels } from '../../redux/selectors/channels';
import FeedManager from '../../data/FeedManager';
import BroadcastFeedItem from '../../data/model/BroadcastFeedItem';
import FeedItem from '../../data/model/FeedItem';
import Intel from '../../data/model/Intel';
import SocialItemAction from '../../data/model/SocialItemAction';
import Interaction from '../../data/model/Interaction';
import UserLookup from '../../data/model/UserLookup';
import { getUserId } from '../selectors/user';
var INTERACTION_FETCH_FEED_ITEM_TYPES = [FEED_INTERACTION_TYPES.INTERACTIONS, FEED_INTERACTION_TYPES.CONVERSATIONS];
var INBOX_FEED_REFRESH_DELAY = 10000;
var feedManager = FeedManager.getInstance();
var inboxUpdateAction = createAction(actionTypes.INBOX_UPDATE, identity);
var feedItemUpdateAction = createAction(actionTypes.FEED_ITEM_UPDATE, identity);
var feedItemRemoveAction = createAction(actionTypes.FEED_ITEM_REMOVE, identity);
export function getActorForChannel(channel) {
  if (channel.channelSlug === CHANNEL_TYPES.facebookpage) {
    return "Page:" + channel.channelId;
  } else if (channel.accountSlug === ACCOUNT_TYPES.linkedin) {
    return channel.channelKey.split(':')[1];
  }

  return channel.channelId;
}

function attachChannelToFeedItem(feedItem, channels) {
  if (feedItem.channelKeyList.isEmpty() && feedItem.subject.remoteUserId) {
    var remoteUserId = feedItem.subject.remoteUserId.replace('Page:', '');
    var channel = channels.find(function (c) {
      return c.channelId === remoteUserId || c.channelKey.split(':')[1] === remoteUserId;
    });

    if (channel) {
      feedItem = feedItem.set('channelKeyList', List.of(channel.channelKey));
    }
  }

  return feedItem;
}

export var fetchInteractionsForFeedItem = function fetchInteractionsForFeedItem(feedItem, intel) {
  return function (dispatch, getState) {
    var channels = getPublishableChannels(getState());
    var networkIntel = intel.getNetwork(feedItem.network);

    if (INTERACTION_FETCH_FEED_ITEM_TYPES.includes(feedItem.interactionType) && feedItem.subject.broadcastGuid) {
      return dispatch(fetchBroadcastCoreInteractions(feedItem.subject.broadcast, INTERACTION_TYPE_TO_CATEGORY[feedItem.subject.type])).then(function (_ref) {
        var interactions = _ref.interactions,
            interactionTotals = _ref.interactionTotals;
        var interactionsByType = interactions.groupBy(function (i) {
          return INTERACTION_TYPE_TO_CATEGORY[i.interactionType];
        });

        if (feedItem.interactionType === FEED_INTERACTION_TYPES.CONVERSATIONS) {
          interactions = interactionsByType.get(INTERACTION_CATEGORIES.comment) || List();
        } else if (feedItem.interactionType === FEED_INTERACTION_TYPES.INTERACTIONS) {
          interactions = interactionsByType.delete(INTERACTION_CATEGORIES.comment).valueSeq().reduce(function (acc, _interactions) {
            return acc.concat(_interactions);
          }, List());
        } // don't care about interactions of types not relevant to this FeedItem
        // its possible for Linkedin interactions to lack a 'user' (means out of network), suppress these in Inbox


        interactions = interactions.filter(function (i) {
          return i.user && (i.interactionType.startsWith('FACEBOOK_REACT') || i.interactionType === feedItem.getType());
        }).map(function (i) {
          i = i.set('feedUser', networkIntel.get(i.user.get('networkUserId') || networkIntel.get("Page:" + i.user.get('networkUserId'))));
          var channel = channels.find(function (c) {
            return c.channelId === i.user.get('networkUserId');
          });

          if (channel) {
            i = i.mergeIn(['user'], {
              username: channel.username,
              name: channel.name,
              avatarUrl: channel.avatarUrl
            });
          }

          return i;
        });
        dispatch(feedItemUpdateAction({
          feedKey: feedItem.feedKey,
          attrs: {
            interactions: interactions,
            interactionTotals: interactionTotals
          }
        }));
        return {
          interactions: interactions,
          interactionTotals: interactionTotals
        };
      });
    }

    return null;
  };
};
export var fetchSocialItemActions = function fetchSocialItemActions(userId, network, feedItem) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.SOCIAL_ITEM_ACTIONS_FETCH,
      payload: {
        feedItem: feedItem
      },
      apiRequest: function apiRequest() {
        return feedManager.fetchSocialItemActions(userId, network).then(function (data) {
          return SocialItemAction.createFromArray(data.filter(function (i) {
            return i.childForeignId;
          }));
        });
      }
    });
  };
};

function fetchRelationshipsForFeedItems(dispatch, feedItems, channels) {
  var fromIds = channels.filter(function (c) {
    return c.accountSlug === ACCOUNT_TYPES.twitter;
  }).map(function (c) {
    return c.channelKey.split(':')[1];
  }).toSet();
  var toIds = feedItems.filter(function (i) {
    return i.network === ACCOUNT_TYPES.twitter && i.events.size;
  }).map(function (i) {
    return i.events.first().remoteUserId;
  }).toSet();
  dispatch(fetchRelationships(fromIds, toIds));
}

function fetchSocialItemActionsForFeedItems(dispatch, feedItems) {
  // fetch list of socialItemActions for follower items that have any, to show previous "hello mentions"
  var followersWithInteractions = feedItems.filter(function (item) {
    return item.interactionType === FEED_INTERACTION_TYPES.FOLLOWERS;
  });
  return followersWithInteractions.map(function (item) {
    return dispatch(fetchSocialItemActions(item.events.first().remoteUserId, ACCOUNT_TYPES.twitter, item));
  });
}

var handleFetchedFeedItem = function handleFetchedFeedItem(data, channels) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (dispatch) {
    if (opts.fetchSocialContacts) {
      // remove intel contacts if SC is enabled, just keep twitter details
      Object.values(data.intelMap.TWITTER_ID || {}).forEach(function (u) {
        delete u.contact;
      });
    }

    var intel = Intel.parseFrom(data.intelMap);
    var items = List(data.items.map(function (attrs) {
      attrs.hasTruncatedWhos = attrs.whoCount > WHO_TRUNCATE_LIMIT;
      attrs.socialItemActions.forEach(function (a) {
        var channel = channels.find(function (c) {
          return c.channelId === a.remoteUserIdOfActor;
        });

        if (channel) {
          a.channel = channel;
        }
      });
      return FeedItem.createFrom(attrs, intel, channels);
    }));
    fetchSocialItemActionsForFeedItems(dispatch, items);

    if (opts.fetchRelationships) {
      fetchRelationshipsForFeedItems(dispatch, items, channels);
    }

    if (opts.fetchSocialContacts) {
      var userLookups = UserLookup.createForFeedItems(items);
      dispatch(fetchSocialContactsBatch(userLookups));
    }

    items = items.map(function (i) {
      return attachChannelToFeedItem(i, channels);
    }).map(function (i) {
      return i.set('interactions', opts.interactions);
    }); // fetch interactions for each item we don't already have them for

    items.forEach(function (item) {
      if (!opts.interactions && !DEFERRED_CHANNEL_NETWORKS.includes(item.network)) {
        var interactionsPromise = dispatch(fetchInteractionsForFeedItem(item, intel));

        if (interactionsPromise) {
          interactionsPromise.done();
        }
      }

      if (item.subject.broadcastMediaType === BROADCAST_MEDIA_TYPE.VIDEO && item.subject.fileId) {
        dispatch(fetchFileManagerFile(item.subject.fileId)).then(function (file) {
          if (file) {
            dispatch(feedItemUpdateAction({
              feedKey: item.feedKey,
              attrs: {
                file: file
              }
            }));
          }
        });
      }
    });

    if (!items.isEmpty()) {
      var broadcastGuids = items.map(function (elem) {
        return elem.subject.broadcastGuid;
      }).filter(identity).toArray();
      var channelIds = items.filter(function (i) {
        return i.subject.remoteUserId;
      }).map(function (i) {
        return i.subject.remoteUserId.split(':')[1];
      }).filter(identity).toSet().toArray();

      if (broadcastGuids.length > 0 && channelIds.length > 0) {
        dispatch(fetchSocialPostsByBroadcastGuids(broadcastGuids, channelIds));
      }
    }

    return {
      items: items,
      intel: intel
    };
  };
};

export var fetchBroadcastCoreSocialItemActions = function fetchBroadcastCoreSocialItemActions(id, channel, panelKey) {
  return function (dispatch) {
    // there are 2 types of Inbox feedItems applicable to the comments/interactions drilldown, CONVERSATIONS for replies and INTERACTIONS for likes/reactions/retweets
    // For Details panel, we really just want SocialItemActions as a record of what actions users have performed in HS, however we still have big issues with this coupling https://git.hubteam.com/HubSpot/Social/issues/4388
    var interactionCategory = DRILLDOWN_KEY_TO_FEED_INTERACTION_TYPE[panelKey] || FEED_INTERACTION_TYPES.CONVERSATIONS;
    dispatch({
      type: actionTypes.BROADCAST_CORE_FEED_FETCH,
      payload: {
        broadcastGuid: id
      },
      apiRequest: function apiRequest() {
        return feedManager.fetchBroadcastFeed(id).then(function (data) {
          var oldFeedItem = data.items.find(function (i) {
            return i.interactionType === interactionCategory;
          });

          if (!oldFeedItem) {
            return null;
          }

          var broadcastFeedItem = BroadcastFeedItem.createFrom({
            feedKey: oldFeedItem.feedKey,
            network: oldFeedItem.network,
            socialItemActions: oldFeedItem.socialItemActions,
            subject: {
              foreignId: oldFeedItem.item.what.foreignId,
              remoteUserId: channel.accountSlug === ACCOUNT_TYPES.twitter ? oldFeedItem.item.whos[0].remoteUserId : getActorForChannel(channel)
            }
          });
          var interactions = broadcastFeedItem.socialItemActions.map(function (sia) {
            return sia.set('channel', channel).toInteraction();
          }).filter(function (i) {
            return i.interactionType;
          }).sortBy(function (i) {
            return i.interactionDate;
          }).toList();
          return {
            broadcastFeedItem: broadcastFeedItem,
            interactions: interactions
          };
        });
      }
    });
  };
};
export var fetchFeed = function fetchFeed() {
  var replaceFeed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  return function (dispatch, getState) {
    var _getState = getState(),
        inbox = _getState.inbox,
        dataFilter = _getState.dataFilter;

    var channels = inboxChannels(getState());
    var socialContactsEnabled = getSocialContactsEnabled(getState());
    var options = pick(inbox.toJS(), 'interactionType', 'startAt', 'archivedStatus');

    if (replaceFeed) {
      options.startAt = I18n.moment().utc().valueOf();
    }

    options.channelKeys = dataFilter.getSelectedChannelKeys(channels.map(function (c) {
      return c.channelKey;
    }).toSet());

    if (options.channelKeys.isEmpty()) {
      return Promise.reject();
    }

    var opts = {
      fetchRelationships: true,
      fetchSocialContacts: socialContactsEnabled
    };
    return dispatch({
      type: actionTypes.FEED_FETCH,
      replaceFeed: replaceFeed,
      apiRequest: function apiRequest() {
        return feedManager.fetchFeed(options).then(function (data) {
          return dispatch(handleFetchedFeedItem(data, channels, opts));
        });
      }
    });
  };
};
export var fetchFeedItem = function fetchFeedItem(feedKey) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch, getState) {
    var _getState2 = getState(),
        logicalChannels = _getState2.logicalChannels,
        feed = _getState2.feed;

    if (feed.get(feedKey.toUpperCase()) && feed.get(feedKey.toUpperCase()).interactions) {
      opts.interactions = feed.get(feedKey.toUpperCase()).interactions;
    }

    dispatch({
      type: actionTypes.FEED_ITEM_FETCH,
      apiRequest: function apiRequest() {
        return feedManager.fetchFeedItem(feedKey).then(function (data) {
          return dispatch(handleFetchedFeedItem(data, logicalChannels, opts));
        });
      }
    });
  };
};
export var updateInbox = function updateInbox(attrs) {
  var reloadFeed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var reloadLandscapeId = arguments.length > 2 ? arguments[2] : undefined;
  return function (dispatch, getState) {
    var _getState3 = getState(),
        inbox = _getState3.inbox;

    inbox = inbox.merge(attrs);
    dispatch(inboxUpdateAction(attrs));
    var currentPath = currentLocation(getState());

    if (reloadFeed) {
      var replaceFeed = Boolean(attrs.interactionType || attrs.archivedStatus || attrs.feedKey);

      if (replaceFeed) {
        attrs.startAt = I18n.moment().utc().valueOf();
      }

      dispatch(replace(inbox.getUrlParams(currentPath)));
      var channels = inboxChannels(getState());

      if (channels) {
        if (attrs.feedKey) {
          dispatch(fetchFeedItem(attrs.feedKey));
        } else {
          dispatch(fetchFeed(replaceFeed));
        }
      }
    } else {
      dispatch(replace(inbox.getUrlParams(currentPath)));
    }

    if (reloadLandscapeId) {
      dispatch(fetchLandscape(reloadLandscapeId));
    }
  };
};
export var archiveFeedItem = function archiveFeedItem(feedItem, thenHide) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.FEED_ITEM_ARCHIVE,
      payload: {
        feedItem: feedItem
      },
      apiRequest: function apiRequest() {
        return feedManager.archiveFeedItem(feedItem.feedKey);
      }
    }).then(function () {
      dispatch(feedItemUpdateAction({
        feedKey: feedItem.feedKey,
        attrs: {
          readAt: I18n.moment().valueOf()
        }
      }));

      if (thenHide) {
        setTimeout(function () {
          return dispatch(feedItemRemoveAction({
            feedKey: feedItem.feedKey
          }));
        }, 2000);
      }
    });
  };
};
export var unarchiveFeedItem = function unarchiveFeedItem(feedItem, thenHide) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.FEED_ITEM_UNARCHIVE,
      payload: {
        feedItem: feedItem
      },
      apiRequest: function apiRequest() {
        return feedManager.unarchiveFeedItem(feedItem.feedKey);
      }
    }).then(function () {
      dispatch(feedItemUpdateAction({
        feedKey: feedItem.feedKey,
        attrs: {
          readAt: 0
        }
      }));

      if (thenHide) {
        setTimeout(function () {
          return dispatch(feedItemRemoveAction({
            feedKey: feedItem.feedKey
          }));
        }, 2000);
      }
    });
  };
};
export var fetchUnreadCounts = function fetchUnreadCounts() {
  return function (dispatch, getState) {
    var channels = inboxChannels(getState());

    if (!channels) {
      return;
    }

    var channelKeys = channels.map(function (c) {
      return c.channelKey;
    }).toArray();
    dispatch({
      type: actionTypes.INBOX_UNREAD_COUNTS_FETCH,
      apiRequest: function apiRequest() {
        return feedManager.fetchInboxCountsV2(channelKeys).then(ImmutableMap);
      }
    });
  };
};
export var archiveFeedItemsBulk = function archiveFeedItemsBulk() {
  return function (dispatch, getState) {
    var channelKeys = getPublishableChannels(getState()).toList().map(function (c) {
      return c.channelKey;
    });
    var interactionType = getState().inbox.interactionType;
    return dispatch({
      type: actionTypes.FEED_ITEM_ARCHIVE_BULK,
      apiRequest: function apiRequest() {
        return feedManager.archiveBulk(channelKeys, interactionType);
      }
    }).then(function () {
      dispatch(fetchFeed());
      dispatch(fetchUnreadCounts());
    });
  };
};
export var pollInboxUnreadCount = function pollInboxUnreadCount() {
  return function (dispatch, getState) {
    var maybePollInboxCounts = function maybePollInboxCounts() {
      var appSection = getAppSection(getState());

      if ([APP_SECTIONS.monitoring, APP_SECTIONS.inbox].includes(appSection)) {
        dispatch(fetchUnreadCounts());
      }
    };

    setInterval(function () {
      if (document.hasFocus && !document.hasFocus()) {
        return;
      }

      maybePollInboxCounts();
    }, INBOX_FEED_REFRESH_DELAY);
    maybePollInboxCounts();
  };
}; // remoteUserIdOfActor: foreignId of the channel performing the action
// itemsRemoteUserId: the user who owns the interaction being liked or replied to
// remoteUserIdOfActedUpon: alias of itemsRemoteUserId

function getParamsForItemAction(channel, event) {
  if (event instanceof Interaction) {
    return {
      parentId: event.foreignId,
      remoteUserIdOfActor: getActorForChannel(channel),
      remoteUserIdOfActedUpon: event.getUserId(),
      itemsRemoteUserId: event.getUserId()
    };
  }

  return {
    parentId: event.childForeignId,
    remoteUserIdOfActor: getActorForChannel(channel),
    remoteUserIdOfActedUpon: event.remoteUserId,
    itemsRemoteUserId: event.remoteUserId
  };
}

export var favoriteItem = function favoriteItem(channel, feedItem, event) {
  return function (dispatch, getState) {
    var params = getParamsForItemAction(channel, event);
    params.userId = getUserId(getState());
    return dispatch({
      type: actionTypes.FEED_ITEM_FAVORITE,
      apiRequest: function apiRequest() {
        return feedManager.favoriteItem(channel.accountSlug, channel.channelKey, event.parentId || feedItem.subject.foreignId, params);
      }
    }).then(function () {
      return dispatch(fetchFeedItem(feedItem.feedKey, {
        interactions: feedItem.interactions
      }));
    });
  };
};
export var unfavoriteItem = function unfavoriteItem(channel, feedItem, event) {
  return function (dispatch, getState) {
    var params = getParamsForItemAction(channel, event);
    params.userId = getUserId(getState());
    return dispatch({
      type: actionTypes.FEED_ITEM_UNFAVORITE,
      apiRequest: function apiRequest() {
        return feedManager.unfavoriteItem(channel.accountSlug, channel.channelKey, event.parentId || feedItem.subject.foreignId, params);
      }
    }).then(function () {
      return dispatch(fetchFeedItem(feedItem.feedKey, {
        interactions: feedItem.interactions
      }));
    });
  };
};
export var retweetItem = function retweetItem(channel, feedItem, event) {
  return function (dispatch, getState) {
    var params = Object.assign({}, getParamsForItemAction(channel, event), {
      userId: getUserId(getState())
    });
    return dispatch({
      type: actionTypes.FEED_ITEM_RETWEET,
      apiRequest: function apiRequest() {
        return feedManager.retweetItem(channel.accountSlug, channel.channelKey, event.parentId || feedItem.subject.foreignId, params);
      }
    }).then(function () {
      return dispatch(fetchFeedItem(feedItem.feedKey));
    });
  };
};
export var unretweetItem = function unretweetItem(channel, feedItem, event) {
  return function (dispatch, getState) {
    var params = Object.assign({}, getParamsForItemAction(channel, event), {
      userId: getUserId(getState())
    });
    return dispatch({
      type: actionTypes.FEED_ITEM_UNRETWEET,
      apiRequest: function apiRequest() {
        return feedManager.unretweetItem(channel.accountSlug, channel.channelKey, event.parentId || feedItem.subject.foreignId, params);
      }
    }).then(function () {
      return dispatch(fetchFeedItem(feedItem.feedKey));
    });
  };
}; // means replying to the thread and general VS an individual reply item (so everything but twitter)

export var replyToBroadcast = function replyToBroadcast(channel, feedItem, text) {
  return function (dispatch, getState) {
    var params = {
      text: text,
      childForeignId: feedItem.subject.foreignId,
      remoteUserIdOfActor: getActorForChannel(channel),
      remoteUserIdOfActedUpon: feedItem.subject.remoteUserId,
      itemsRemoteUserId: getActorForChannel(channel),
      userId: getUserId(getState()),
      networkId: NETWORKS_TO_IDS.indexOf(feedItem.network)
    };

    if (channel.accountSlug === ACCOUNT_TYPES.twitter && feedItem.events) {
      params.remoteUserIdOfActedUpon = feedItem.events.first().remoteUserId;
      params.itemsRemoteUserId = params.remoteUserIdOfActedUpon;
    } else if (channel.accountSlug === ACCOUNT_TYPES.instagram) {
      params.parentId = feedItem.subject.foreignId;
    }

    dispatch(feedItemUpdateAction({
      feedKey: feedItem.feedKey,
      attrs: {
        isLoading: true
      }
    }));
    return dispatch({
      type: actionTypes.FEED_ITEM_REPLY,
      apiRequest: function apiRequest() {
        return feedManager.replyToItem(channel.accountSlug, channel.channelKey, feedItem.subject.foreignId, params);
      }
    }).then(function () {
      return dispatch(fetchFeedItem(feedItem.feedKey, {
        interactions: feedItem.interactions
      }));
    });
  };
};
export var replyToItem = function replyToItem(channel, feedKey, feedEvent, text) {
  return function (dispatch, getState) {
    var feedKeyParts = feedKey.split('-');
    var foreignId = feedKeyParts[feedKeyParts.length - 1];
    var params = Object.assign({}, getParamsForItemAction(channel, feedEvent), {
      childForeignId: foreignId,
      text: text,
      userId: getUserId(getState())
    });
    return dispatch({
      type: actionTypes.FEED_ITEM_REPLY,
      apiRequest: function apiRequest() {
        return feedManager.replyToItem(channel.accountSlug, channel.channelKey, foreignId, params);
      }
    }).then(function () {
      return dispatch(fetchFeedItem(feedKey));
    });
  };
};
export var createMention = function createMention(channel, feedItem, text) {
  return function (dispatch, getState) {
    var params = {
      text: text,
      remoteUserIdOfActor: getActorForChannel(channel),
      userId: getUserId(getState())
    };

    if (feedItem.subject.userDetails) {
      params.remoteUserIdOfActedUpon = feedItem.subject.userDetails.get('idString');
    } else {
      // todo remove when Social:IntelEnrichmentTwitter is ungated
      params.remoteUserIdOfActedUpon = feedItem.getUsers().first().getUserId();
    }

    return dispatch({
      type: actionTypes.FEED_ITEM_MENTION,
      payload: {
        feedItem: feedItem
      },
      apiRequest: function apiRequest() {
        return feedManager.mentionItem(channel.accountSlug, channel.channelKey, params.remoteUserIdOfActedUpon, params).then(SocialItemAction.createFrom);
      }
    });
  };
};