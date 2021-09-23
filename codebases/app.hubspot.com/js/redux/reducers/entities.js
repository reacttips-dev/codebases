'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions2, _handleActions3, _handleActions4, _handleActions9, _handleActions10, _handleActions12, _handleActions13, _handleActions14, _handleActions15, _handleActions17, _ImmutableMap, _handleActions18, _handleActions19, _handleActions22, _handleActions24;

import { OrderedMap, Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';
import I18n from 'I18n';
import { handleActions } from 'flux-actions';
import ActionMapper from '../../lib/legacyRequestActionMapper';
import { broadcastCores } from './broadcastCore';
import { bannerMessages } from './bannerMessages';
import actionTypes from '../actions/actionTypes';
import broadcast from './broadcast';
import broadcasts from './broadcasts';
import broadcastCounts from './broadcastCounts';
import broadcastGroup from './broadcastGroup';
import followMeLinks from './followMeLinks';
import schedule from './schedule';
import relationships from './relationships';
import ui from './ui';
import storage from './storage';
import dataFilter from './dataFilter';
import exportReducer from './export';
import bulkScheduleReducerV2 from './bulkSchedule';
import PagePreview from '../../data/model/PagePreview';
import CalendarBroadcasts from '../../data/model/CalendarBroadcasts';
import Intel from '../../data/model/Intel';
import Inbox from '../../data/model/Inbox';
import accountFilter from './accountFilter';
import landscapeConfig from './landscapeConfig';
import postTargeting from './postTargeting';
import { FEED_ACTION_TYPES, FEED_INTERACTION_TYPES, FORMAT_MONTH_CODE } from '../../lib/constants';
import { parse } from 'hub-http/helpers/params';
import Broadcast from '../../data/model/Broadcast';
import { logBreadcrumb, isNumeric } from '../../lib/utils';
var getParamsFromQuery = parse(window.location.search.substring(1));
var campaigns = handleActions(_defineProperty({}, ActionMapper.success(actionTypes.CAMPAIGNS_FETCH), function (state, action) {
  return action.data;
}), OrderedMap());
var emailSettings = handleActions((_handleActions2 = {}, _defineProperty(_handleActions2, ActionMapper.began(actionTypes.EMAIL_SETTINGS_FETCH), function () {
  return null;
}), _defineProperty(_handleActions2, ActionMapper.success(actionTypes.EMAIL_SETTINGS_FETCH), function (state, action) {
  return action.data;
}), _defineProperty(_handleActions2, actionTypes.EMAIL_SETTINGS_UPDATE, function (state, action) {
  return state.merge(action.payload);
}), _handleActions2));
var pagePreviews = handleActions((_handleActions3 = {}, _defineProperty(_handleActions3, ActionMapper.began(actionTypes.PAGE_PREVIEW_FETCH), function (state, action) {
  if (action.payload.channelType) {
    return state;
  }

  return state.set(action.payload.url, new PagePreview({
    loading: true
  }));
}), _defineProperty(_handleActions3, ActionMapper.success(actionTypes.PAGE_PREVIEW_FETCH), function (state, action) {
  return state.set(action.payload.url, action.data);
}), _defineProperty(_handleActions3, ActionMapper.began(actionTypes.FILE_MANAGER_INFO_FETCH), function (state, action) {
  if (!state.get(action.payload.url)) {
    return state;
  }

  if (state.get(action.payload.url).images.get(action.payload.imageUrl)) {
    state = state.mergeIn([action.payload.url, 'images', action.payload.imageUrl], {
      loading: true
    });
  }

  return state;
}), _defineProperty(_handleActions3, ActionMapper.success(actionTypes.FILE_MANAGER_INFO_FETCH), function (state, action) {
  if (!state.get(action.payload.url)) {
    return state;
  }

  if (state.get(action.payload.url).images.get(action.payload.imageUrl)) {
    state = state.setIn([action.payload.url, 'images', action.payload.imageUrl], action.data);
    action.payload.networks.forEach(function (network) {
      if (action.data.isValid(network, false)) {
        if (!state.get(action.payload.url).imageForNetworks.get(network)) {
          // if there's already one, don't overwrite
          state = state.setIn([action.payload.url, 'imageForNetworks', network], action.data);
        }
      }
    });
  }

  if (action.payload.isTwitterCard && state.get(action.payload.url)) {
    state = state.setIn([action.payload.url, 'twitterCard', 'image'], action.data);
  }

  return state;
}), _defineProperty(_handleActions3, actionTypes.FILE_MANAGER_BULK_INFO_FETCH, function (state, action) {
  action.payload.images.forEach(function (image) {
    state = state.setIn([action.payload.url, 'images', image.url], image);
  });
  return state;
}), _defineProperty(_handleActions3, actionTypes.BROADCAST_GROUP_BLUR, function (state) {
  return state.clear();
}), _handleActions3), ImmutableMap());
var blogs = handleActions((_handleActions4 = {}, _defineProperty(_handleActions4, ActionMapper.success(actionTypes.BLOGS_FETCH), function (state, action) {
  return action.data;
}), _defineProperty(_handleActions4, ActionMapper.error(actionTypes.BLOGS_FETCH), function () {
  return [];
}), _handleActions4));
var interactions = handleActions(_defineProperty({}, ActionMapper.success(actionTypes.INTERACTIONS_REPORT_FETCH), function (state, action) {
  return action.data;
}));
var users = handleActions(_defineProperty({}, actionTypes.USERS_FETCH_SUCCESS, function (state, action) {
  return action.data;
}), OrderedMap());
var appInstalls = handleActions(_defineProperty({}, ActionMapper.success(actionTypes.APP_INSTALLS_FETCH), function (state, action) {
  return action.data;
}));
var newUserAppInstall = handleActions(_defineProperty({}, actionTypes.NEW_USER_APP_INSTALL, function (state, action) {
  return action.payload;
}));
var calendarBroadcasts = handleActions((_handleActions9 = {}, _defineProperty(_handleActions9, ActionMapper.success(actionTypes.BROADCASTS_FETCH_IN_DATE_RANGE), function (state, action) {
  if (action.clearExisting && state._getMonth(action.month)) {
    var monthKey = action.month.format(FORMAT_MONTH_CODE);
    return state.clearMonth(monthKey).addBroadcasts(action.month, action.channelKeys, action.data);
  }

  return state.addBroadcasts(action.month, action.channelKeys, action.data);
}), _defineProperty(_handleActions9, actionTypes.CALENDAR_BROADCAST_UPDATE, function (state, action) {
  var attrs = action.payload.attrs;
  var existingTriggerAt = action.payload.date;
  var newTriggerAt = attrs.triggerAt && I18n.moment.utc(attrs.triggerAt).portalTz();

  if (newTriggerAt) {
    logBreadcrumb("Updating broadcast " + action.payload.broadcastGuid + " from " + existingTriggerAt.format() + " to " + newTriggerAt.format(), true);
  }

  var existing = state.getBroadcast(existingTriggerAt, action.payload.broadcastGuid);

  if (existing) {
    if (newTriggerAt && newTriggerAt.month() !== existingTriggerAt.month()) {
      logBreadcrumb("Moving broadcast " + action.payload.broadcastGuid + " from month " + existingTriggerAt.month() + " to " + newTriggerAt.month(), true);
      state = state.removeBroadcast(existingTriggerAt, action.payload.broadcastGuid);
      return state.setBroadcast(newTriggerAt, action.payload.broadcastGuid, existing.merge(action.payload.attrs));
    }
  }

  return state.updateBroadcast(action.payload.date, action.payload.broadcastGuid, action.payload.attrs);
}), _defineProperty(_handleActions9, ActionMapper.success(actionTypes.BROADCAST_GROUP_CREATE), function (state, action) {
  if (action.data) {
    var newBroadcasts = [];

    if (action.data.scheduled) {
      newBroadcasts = newBroadcasts.concat(action.data.scheduled);
    }

    if (action.data.drafts) {
      newBroadcasts = newBroadcasts.concat(action.data.drafts);
    }

    var upcoming = Broadcast.createFromArray(newBroadcasts);
    upcoming.forEach(function (b) {
      state = state.setBroadcast(I18n.moment.utc(b.triggerAt), b.broadcastGuid, b);
    });
  }

  return state;
}), _defineProperty(_handleActions9, ActionMapper.success(actionTypes.BROADCAST_GROUP_SAVE), function (state, action) {
  var _broadcast = Broadcast.createFrom(action.data);

  return state.setBroadcast(I18n.moment.utc(_broadcast.triggerAt), _broadcast.broadcastGuid, _broadcast);
}), _defineProperty(_handleActions9, actionTypes.CALENDAR_BROADCAST_CLEAR, function (state) {
  return state.clear();
}), _handleActions9), new CalendarBroadcasts());
var hubSettings = handleActions((_handleActions10 = {}, _defineProperty(_handleActions10, ActionMapper.success(actionTypes.HUB_SETTINGS_FETCH), function (state, action) {
  return action.data;
}), _defineProperty(_handleActions10, ActionMapper.success(actionTypes.HUB_SETTINGS_SAVE), function (state, action) {
  return state.set(action.key, action.value);
}), _handleActions10));
var unboxing = handleActions(_defineProperty({}, ActionMapper.success(actionTypes.UNBOXING_FETCH), function (state, action) {
  return action.data;
}));
var uploads = handleActions((_handleActions12 = {}, _defineProperty(_handleActions12, actionTypes.FILE_UPLOAD_PROGRESS, function (state, action) {
  return state.setIn([action.payload.name, 'progress'], action.payload.loaded / action.payload.total);
}), _defineProperty(_handleActions12, actionTypes.FILE_UPLOAD_INITIAL, function (state, action) {
  var payload = action.payload || {};
  return state.set(payload.name, ImmutableMap({
    sourceId: payload.sourceId,
    progress: 0.05,
    type: payload.type
  }));
}), _defineProperty(_handleActions12, ActionMapper.success(actionTypes.FILE_UPLOAD), function (state, action) {
  return state.delete(action.payload.name);
}), _defineProperty(_handleActions12, ActionMapper.error(actionTypes.FILE_UPLOAD), function (state, action) {
  return state.delete(action.payload.name);
}), _handleActions12), ImmutableMap()); // stores the create/update server response in a object meant to return to QuickCompose

var composerResponse = handleActions((_handleActions13 = {}, _defineProperty(_handleActions13, actionTypes.BROADCAST_GROUP_INIT, function () {
  return undefined;
}), _defineProperty(_handleActions13, actionTypes.BROADCAST_GROUP_POPULATE, function () {
  return undefined;
}), _defineProperty(_handleActions13, ActionMapper.success(actionTypes.BROADCAST_GROUP_CREATE), function (state, action) {
  if (action.data) {
    // signals for QuickCompose to call onPublish for updates
    return {
      published: true,
      result: action.data
    };
  }

  return action.data;
}), _defineProperty(_handleActions13, ActionMapper.success(actionTypes.BROADCAST_GROUP_SAVE), function (state, action) {
  if (action.data) {
    // signals for QuickCompose to call onPublish for updates
    return {
      published: true,
      result: action.data
    };
  }

  return action.data;
}), _defineProperty(_handleActions13, ActionMapper.success(actionTypes.BROADCAST_GROUP_BULK_SAVE), function (state, action) {
  if (action.data) {
    // signals for QuickCompose to call onPublish for updates
    return {
      published: true,
      result: action.data
    };
  }

  return action.data;
}), _handleActions13), ImmutableMap());
var feed = handleActions((_handleActions14 = {}, _defineProperty(_handleActions14, ActionMapper.success(actionTypes.FEED_FETCH), function (state, action) {
  var _feed = OrderedMap(action.data.items.map(function (fi) {
    return [fi.feedKey, fi];
  })); // replaceFeed handles to keep the items on the feed in case `show more` when its value is false, and cleans the feed up when it's true


  return state && !action.replaceFeed ? state.concat(_feed) : _feed;
}), _defineProperty(_handleActions14, ActionMapper.success(actionTypes.FEED_ITEM_FETCH), function (state, action) {
  if (action.data.items) {
    action.data.items.forEach(function (feedItem) {
      state = state.set(feedItem.feedKey, feedItem);
    });
  }

  return state;
}), _defineProperty(_handleActions14, actionTypes.FEED_ITEM_UPDATE, function (state, action) {
  if (action.payload.feedKey && state.get(action.payload.feedKey)) {
    return state.mergeIn([action.payload.feedKey], action.payload.attrs);
  }

  return state;
}), _defineProperty(_handleActions14, actionTypes.FEED_ITEM_REMOVE, function (state, action) {
  if (action.payload.feedKey && state.get(action.payload.feedKey)) {
    return state.delete(action.payload.feedKey);
  }

  return state;
}), _defineProperty(_handleActions14, ActionMapper.success(actionTypes.SOCIAL_ITEM_ACTIONS_FETCH), function (state, action) {
  if (action.payload.feedItem) {
    var mentionInteractions = action.data.filter(function (i) {
      return i.type === FEED_ACTION_TYPES.NEW_MESSAGE && i.remoteUserId === action.payload.feedItem.subject.remoteUserId;
    });

    if (action.payload.feedItem.feedKey && state.get(action.payload.feedItem.feedKey)) {
      return state.setIn([action.payload.feedItem.feedKey, 'socialItemActions'], mentionInteractions);
    }
  }

  return state;
}), _defineProperty(_handleActions14, ActionMapper.began(actionTypes.FOLLOW), function (state, action) {
  if (action.payload.feedKey && state.get(action.payload.feedKey)) {
    return state.setIn([action.payload.feedKey, 'isLoading'], true);
  }

  return state;
}), _defineProperty(_handleActions14, ActionMapper.success(actionTypes.FOLLOW), function (state, action) {
  if (action.payload.feedKey && state.get(action.payload.feedKey)) {
    return state.setIn([action.payload.feedKey, 'isLoading'], false);
  }

  return state;
}), _defineProperty(_handleActions14, ActionMapper.error(actionTypes.FOLLOW), function (state, action) {
  if (action.payload.feedKey && state.get(action.payload.feedKey)) {
    return state.setIn([action.payload.feedKey, 'isLoading'], false);
  }

  return state;
}), _defineProperty(_handleActions14, ActionMapper.began(actionTypes.UNFOLLOW), function (state, action) {
  if (action.payload.feedKey && state.get(action.payload.feedKey)) {
    return state.setIn([action.payload.feedKey, 'isLoading'], true);
  }

  return state;
}), _defineProperty(_handleActions14, ActionMapper.success(actionTypes.UNFOLLOW), function (state, action) {
  if (action.payload.feedKey && state.get(action.payload.feedKey)) {
    return state.setIn([action.payload.feedKey, 'isLoading'], false);
  }

  return state;
}), _defineProperty(_handleActions14, ActionMapper.error(actionTypes.UNFOLLOW), function (state, action) {
  if (action.payload.feedKey && state.get(action.payload.feedKey)) {
    return state.setIn([action.payload.feedKey, 'isLoading'], false);
  }

  return state;
}), _handleActions14), OrderedMap());
var intel = handleActions((_handleActions15 = {}, _defineProperty(_handleActions15, ActionMapper.success(actionTypes.FEED_FETCH), function (state, action) {
  return state.mergeDeepIn(['networks'], action.data.intel.networks);
}), _defineProperty(_handleActions15, ActionMapper.success(actionTypes.BROADCAST_FEED_FETCH), function (state, action) {
  return state.mergeDeepIn(['networks'], action.data.intel.networks);
}), _defineProperty(_handleActions15, ActionMapper.success(actionTypes.FEED_ITEM_FETCH), function (state, action) {
  return state.mergeDeepIn(['networks'], action.data.intel.networks);
}), _defineProperty(_handleActions15, ActionMapper.success(actionTypes.FULL_INTELLIGENCE_FETCH), function (state, action) {
  return state.mergeDeepIn(['networks'], action.data.networks);
}), _defineProperty(_handleActions15, ActionMapper.success(actionTypes.FULL_INTELLIGENCE_BATCH_FETCH), function (state, action) {
  return state.mergeDeepIn(['networks'], action.data.networks);
}), _handleActions15), new Intel());
var socialContacts = handleActions(_defineProperty({}, ActionMapper.success(actionTypes.SOCIAL_CONTACTS_BATCH_FETCH), function (state, action) {
  return state.mergeDeep({
    networks: action.data.networks
  });
}), new Intel());
var profile = handleActions((_handleActions17 = {}, _defineProperty(_handleActions17, actionTypes.PROFILE_OPEN, function (state, action) {
  return action.payload.feedUser;
}), _defineProperty(_handleActions17, actionTypes.PROFILE_CLOSE, function () {
  return undefined;
}), _defineProperty(_handleActions17, ActionMapper.success(actionTypes.TWITTER_PROFILE_FETCH), function (state, action) {
  if (!state) {
    return null;
  }

  state = state.merge({
    twitterProfile: action.data.get('profile'),
    tweets: action.data.get('tweets')
  }); // we could have fetched a profile by username, in which case set the id to the actual numeric one

  if (state.twitter_details && !isNumeric(state.twitter_details.get('id'))) {
    state = state.setIn(['twitter_details', 'id'], state.twitterProfile.get('id').toString());
  }

  return state;
}), _defineProperty(_handleActions17, ActionMapper.success(actionTypes.FACEBOOK_PROFILE_FETCH), function (state, action) {
  return state && state.merge({
    facebookProfile: action.data.first()
  });
}), _defineProperty(_handleActions17, ActionMapper.success(actionTypes.TWITTER_INTERACTIONS_FETCH), function (state, action) {
  return state && state.set('interactions', action.data);
}), _handleActions17));
var emptyCounts = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, FEED_INTERACTION_TYPES.CONVERSATIONS, 0), _defineProperty(_ImmutableMap, FEED_INTERACTION_TYPES.INTERACTIONS, 0), _defineProperty(_ImmutableMap, FEED_INTERACTION_TYPES.FOLLOWERS, 0), _ImmutableMap));
var inbox = handleActions((_handleActions18 = {}, _defineProperty(_handleActions18, actionTypes.INBOX_UPDATE, function (state, action) {
  return state.merge(action.payload);
}), _defineProperty(_handleActions18, actionTypes.PROFILE_OPEN, function (state, action) {
  if (action.payload.channel) {
    state = state.set('interactingAs', action.payload.channel.channelKey);
  }

  return state;
}), _defineProperty(_handleActions18, ActionMapper.success(actionTypes.FEED_FETCH), function (state, action) {
  state = state.merge({
    feedHasLoaded: true,
    lastFeedFetchCounts: state.inboxCounts,
    hasMore: action.data.items.size === state.get('pageSize')
  });

  if (!action.data.items.isEmpty()) {
    state = state.merge({
      startAt: action.data.items.last().updatedAt
    });
  }

  return state;
}), _defineProperty(_handleActions18, ActionMapper.success(actionTypes.FEED_ITEM_ARCHIVE), function (state, action) {
  if (state.inboxCounts && state.inboxCounts.get(action.payload.feedItem.interactionType)) {
    var lastFetchedCount = state.inboxCounts.get(action.payload.feedItem.interactionType);
    return state.set('unreadCount', state.unreadCount - 1).setIn(['inboxCounts', action.payload.feedItem.interactionType], lastFetchedCount - 1).setIn(['lastFeedFetchCounts', action.payload.feedItem.interactionType], lastFetchedCount - 1);
  }

  return state;
}), _defineProperty(_handleActions18, ActionMapper.success(actionTypes.FEED_ITEM_UNARCHIVE), function (state, action) {
  if (state.inboxCounts && state.inboxCounts.get(action.payload.feedItem.interactionType)) {
    var lastFetchedCount = state.inboxCounts.get(action.payload.feedItem.interactionType);
    return state.set('unreadCount', state.unreadCount + 1).setIn(['inboxCounts', action.payload.feedItem.interactionType], lastFetchedCount + 1).setIn(['lastFeedFetchCounts', action.payload.feedItem.interactionType], lastFetchedCount + 1);
  }

  return state;
}), _defineProperty(_handleActions18, ActionMapper.success(actionTypes.INBOX_UNREAD_COUNTS_FETCH), function (state, action) {
  action.data = emptyCounts.merge(action.data);
  var totalCount = action.data.get(FEED_INTERACTION_TYPES.CONVERSATIONS) + action.data.get(FEED_INTERACTION_TYPES.INTERACTIONS) + action.data.get(FEED_INTERACTION_TYPES.FOLLOWERS);
  state = state.set('inboxCounts', action.data).set('unreadCount', totalCount);

  if (!state.lastFeedFetchCounts) {
    state = state.set('lastFeedFetchCounts', action.data);
  }

  return state;
}), _handleActions18), Inbox.createFromQueryParams(Object.assign({}, getParamsFromQuery)));

function handleStreamItemAction(state, action) {
  if (!action) {
    return state;
  }

  var socialItemAction = action.data;
  var streamItem = action.payload.streamItem;
  var streamItemId = socialItemAction.socialItemId || streamItem.id;
  var actions = state.getIn([streamItem.streamGuid, 'items', streamItemId, 'actions']);

  if (!actions) {
    return state;
  }

  return state.setIn([streamItem.streamGuid, 'items', streamItemId, 'actions'], actions.push(socialItemAction));
}

var streams = handleActions((_handleActions19 = {}, _defineProperty(_handleActions19, ActionMapper.success(actionTypes.STREAMS_FETCH), function (state, action) {
  return action.data.map(function (s) {
    var existingStream = state.get(s.streamGuid);

    if (existingStream && !existingStream.items.isEmpty()) {
      return s.set('items', existingStream.items).set('itemsHaveLoaded', existingStream.itemsHaveLoaded);
    }

    return s;
  });
}), _defineProperty(_handleActions19, ActionMapper.success(actionTypes.STREAM_FETCH), function (state, action) {
  return state.set(action.data.streamGuid, action.data);
}), _defineProperty(_handleActions19, ActionMapper.success(actionTypes.STREAM_DELETE), function (state, action) {
  return state.delete(action.payload.streamGuid);
}), _defineProperty(_handleActions19, ActionMapper.success(actionTypes.STREAM_ITEM_FAVORITE), handleStreamItemAction), _defineProperty(_handleActions19, ActionMapper.success(actionTypes.STREAM_ITEM_UNFAVORITE), handleStreamItemAction), _defineProperty(_handleActions19, ActionMapper.success(actionTypes.STREAM_ITEM_RETWEET), handleStreamItemAction), _defineProperty(_handleActions19, ActionMapper.success(actionTypes.STREAM_ITEM_UNRETWEET), handleStreamItemAction), _defineProperty(_handleActions19, ActionMapper.success(actionTypes.STREAM_ITEM_REPLY), handleStreamItemAction), _defineProperty(_handleActions19, ActionMapper.success(actionTypes.STREAM_ITEM_QUOTE), handleStreamItemAction), _defineProperty(_handleActions19, ActionMapper.success(actionTypes.STREAM_ITEM_ANCESTORS_FETCH), function (state, action) {
  var streamItem = action.payload.streamItem;

  if (streamItem && state.get(streamItem.streamGuid) && state.get(streamItem.streamGuid).items.get(streamItem.id)) {
    return state.mergeIn([streamItem.streamGuid, 'items', streamItem.id], {
      ancestors: action.data,
      ancestorsLoaded: true
    });
  }

  return state;
}), _handleActions19), OrderedMap());
export var streamItems = handleActions(_defineProperty({}, ActionMapper.success(actionTypes.STREAM_ITEM_FETCH), function (state, action) {
  return state.set(action.data.id, action.data);
}), OrderedMap());
export var streamPreview = handleActions(_defineProperty({}, ActionMapper.success(actionTypes.STREAM_PREVIEW_FETCH), function (state, action) {
  return action.data;
}));
var landscape = handleActions((_handleActions22 = {}, _defineProperty(_handleActions22, ActionMapper.success(actionTypes.LANDSCAPE_CREATE), function (state, action) {
  return action.data;
}), _defineProperty(_handleActions22, ActionMapper.success(actionTypes.LANDSCAPE_FETCH), function (state, action) {
  return action.data;
}), _defineProperty(_handleActions22, ActionMapper.success(actionTypes.LANDSCAPE_FETCH_SOCIAL_POSTS), function (state, action) {
  return state.set('posts', fromJS(action.data));
}), _handleActions22));
var uploadedErrors = handleActions(_defineProperty({}, ActionMapper.success(actionTypes.BROADCASTS_FETCH), function (state, action) {
  return action.data.uploadedErrors;
}), ImmutableMap());
export var media = handleActions((_handleActions24 = {}, _defineProperty(_handleActions24, actionTypes.MEDIA_OPEN, function (state, action) {
  return action.payload;
}), _defineProperty(_handleActions24, actionTypes.MEDIA_CLOSE, function () {
  return undefined;
}), _handleActions24));
var boostedPosts = handleActions(_defineProperty({}, ActionMapper.success(actionTypes.BOOSTED_POSTS_FETCH), function (state, action) {
  return state.merge(ImmutableList(action.data).groupBy(function (post) {
    return post.postId;
  }));
}), ImmutableMap());
export default (function (state, action) {
  return {
    campaigns: campaigns(state.campaigns, action),
    ui: ui(state.ui, action),
    storage: storage(state.storage, action),
    dataFilter: dataFilter(state.dataFilter, action),
    broadcast: broadcast(state.broadcast, action),
    broadcasts: broadcasts(state.broadcasts, action),
    broadcastCores: broadcastCores(state.broadcastCores, action),
    broadcastCounts: broadcastCounts(state.broadcastCounts, action),
    calendarBroadcasts: calendarBroadcasts(state.calendarBroadcasts, action),
    broadcastGroup: broadcastGroup(state.broadcastGroup, action),
    composerResponse: composerResponse(state.composerResponse, action),
    pagePreviews: pagePreviews(state.pagePreviews, action),
    feed: feed(state.feed, action),
    intel: intel(state.intel, action),
    socialContacts: socialContacts(state.socialContacts, action),
    profile: profile(state.profile, action),
    media: media(state.media, action),
    inbox: inbox(state.inbox, action),
    streams: streams(state.streams, action),
    streamItems: streamItems(state.streamItems, action),
    streamPreview: streamPreview(state.streamPreview, action),
    relationships: relationships(state.relationships, action),
    followMeLinks: followMeLinks(state.followMeLinks, action),
    uploadedErrors: uploadedErrors(state.uploadedErrors, action),
    blogs: blogs(state.blogs, action),
    export: exportReducer(state.export, action),
    uploads: uploads(state.uploads, action),
    interactions: interactions(state.interactions, action),
    bulkSchedule: bulkScheduleReducerV2(state.bulkSchedule, action),
    users: users(state.users, action),
    appInstalls: appInstalls(state.appInstalls, action),
    newUserAppInstall: newUserAppInstall(state.newUserAppInstall, action),
    unboxing: unboxing(state.unboxing, action),
    hubSettings: hubSettings(state.hubSettings, action),
    emailSettings: emailSettings(state.emailSettings, action),
    schedule: schedule(state.schedule, action),
    accountFilter: accountFilter(state.accountFilter, action),
    landscape: landscape(state.landscape, action),
    landscapeConfig: landscapeConfig(state.landscapeConfig, action),
    boostedPosts: boostedPosts(state.boostedPosts, action),
    bannerMessages: bannerMessages(state.bannerMessages, action),
    postTargeting: postTargeting(state.postTargeting, action)
  };
});