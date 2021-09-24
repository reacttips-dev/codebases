'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toArray from "@babel/runtime/helpers/esm/toArray";
import { createSelector } from 'reselect';
import { getPostsState } from '../redux/selectors';
import { getCampaigns } from '../redux/selectors/campaigns';
import { getChannelsForDisplay, getChannelsForComposerPicker } from '../redux/selectors/channels';
import { getUsers } from '../redux/selectors/users';
import { CHANNEL_VALIDATION, POST_ACTION_TYPES, ACCOUNT_TYPES, MAX_ALLOWED_IMAGES_COMPOSER } from '../lib/constants';
export var attachCampaignMetaToPostOrBroadcast = function attachCampaignMetaToPostOrBroadcast(element, campaigns) {
  if (element.campaignGuid && campaigns) {
    var campaign = campaigns.get(element.campaignGuid);

    if (campaign) {
      element = element.set('campaignName', campaign.display_name);
      element = element.set('campaignHexColor', campaign.colorHex);
    }
  }

  return element;
};
export var attachEntitiesToPostOrBroadcast = function attachEntitiesToPostOrBroadcast(element, channels, campaigns) {
  var channel = channels.get(element.getChannelKey());
  element = element.set('channel', channel);
  element = attachCampaignMetaToPostOrBroadcast(element, campaigns);
  return element;
};
export var getPosts = createSelector([getCampaigns, getChannelsForDisplay, getPostsState], function (campaigns, channels, posts) {
  return posts.posts.map(function (post) {
    return attachEntitiesToPostOrBroadcast(post, channels, campaigns);
  });
});
export var getIndividuallyFetchedPost = createSelector([getCampaigns, getChannelsForDisplay, getPostsState], function (campaigns, channels, posts) {
  return posts.individuallyFetchedPost ? attachEntitiesToPostOrBroadcast(posts.individuallyFetchedPost, channels, campaigns) : null;
});
export var getPostsTotal = createSelector([getPostsState], function (posts) {
  return posts.total;
});
export var getPostIdFromProps = function getPostIdFromProps(_state, props) {
  return props.postId;
};
export var getPostKeyStringFromProps = function getPostKeyStringFromProps(_state, props) {
  return props.postKeyString;
};
export var getPostById = createSelector([getPosts, getIndividuallyFetchedPost, getPostIdFromProps], function (posts, individuallyFetchedPost, postId) {
  var allPosts = individuallyFetchedPost ? posts.set(individuallyFetchedPost.id, individuallyFetchedPost) : posts;
  return allPosts.get(postId);
});
export var getPostByKeyString = createSelector([getPosts, getIndividuallyFetchedPost, getPostKeyStringFromProps], function (posts, individuallyFetchedPost, postKeyString) {
  var allPosts = individuallyFetchedPost ? posts.set(individuallyFetchedPost.id, individuallyFetchedPost) : posts; // Some foreign IDs contain colons that are getting dropped
  // If there are additional parts to the foreign ID beyond what is initially found,
  // recombine them to form a corrected foreign ID for comparison

  var _postKeyString$split = postKeyString.split(':'),
      _postKeyString$split2 = _toArray(_postKeyString$split),
      channelSlug = _postKeyString$split2[0],
      channelId = _postKeyString$split2[1],
      foreignId = _postKeyString$split2[2],
      otherForeignIdParts = _postKeyString$split2.slice(3);

  var correctedForeignId = // If there are more than 1 other parts to the foreign ID, use that as the corrected foreign ID
  otherForeignIdParts && otherForeignIdParts.length > 0 ? foreignId + ":" + otherForeignIdParts.join(':') : foreignId;
  return allPosts.toList().find(function (post) {
    return post.channelSlug === channelSlug && post.channelId === channelId && post.foreignId === correctedForeignId;
  });
});
var getCloneIsVisibleForPost = createSelector([getPostById, getChannelsForComposerPicker], function (post, channels) {
  if (post && post.channelId) {
    return !channels.filter(function (c) {
      return c.accountSlug === post.accountSlug;
    }).isEmpty();
  }

  return false;
});
var getDeleteIsVisibleForPost = createSelector([getPostById, getChannelsForComposerPicker], function (post, channels) {
  if (post.accountSlug !== ACCOUNT_TYPES.instagram) {
    var channel = channels.find(function (c) {
      return c.channelId === post.channelId;
    });
    return channel && !channel.publishingErrors.includes(CHANNEL_VALIDATION.EXPIRED) && channel.userCanPublish;
  }

  return false;
});
var getBoostIsVisibleForPost = createSelector([getPostById], function (post) {
  if (post.accountSlug === ACCOUNT_TYPES.facebook) {
    return true;
  }

  return false;
});
var ACTION_DISABLED_REASON = {
  TOO_MANY_IMAGES: 'tooManyImages',
  OUT_OF_HS_VIDEO_POST: 'outOfHSVideoPost',
  NO_BROADCAST_GUID: 'noBroadcastGuid'
};
var getCloneDisabledReason = createSelector([getPostById], function (post) {
  if (!post.broadcastGuid && post.isVideo()) {
    return ACTION_DISABLED_REASON.OUT_OF_HS_VIDEO_POST;
  } else if (post.metadata.media.size > MAX_ALLOWED_IMAGES_COMPOSER) {
    return ACTION_DISABLED_REASON.TOO_MANY_IMAGES;
  }

  return null;
});
var getDeleteDisabledReason = createSelector([getPostById], function (post) {
  if (!post.broadcastGuid) {
    return ACTION_DISABLED_REASON.NO_BROADCAST_GUID;
  }

  return null;
});

var getIsDetailsPanelFromProps = function getIsDetailsPanelFromProps(state, props) {
  return props.isDetailsPanel;
};

export var getActionsForPost = createSelector([getDeleteIsVisibleForPost, getDeleteDisabledReason, getCloneIsVisibleForPost, getCloneDisabledReason, getBoostIsVisibleForPost, getIsDetailsPanelFromProps], function (deleteIsVisible, deleteDisabledReason, cloneIsVisible, cloneDisabledReason, boostIsVisible, isDetailsPanel) {
  var _ref;

  // this order is going to be the order shown in the dropdown
  return _ref = {}, _defineProperty(_ref, POST_ACTION_TYPES.VIEW_DETAILS, {
    visible: !isDetailsPanel,
    disabled: false
  }), _defineProperty(_ref, POST_ACTION_TYPES.CLONE, {
    visible: cloneIsVisible,
    disabledReason: cloneDisabledReason
  }), _defineProperty(_ref, POST_ACTION_TYPES.BOOST, {
    visible: boostIsVisible,
    disabled: false
  }), _defineProperty(_ref, POST_ACTION_TYPES.VIEW_ON_NETWORK, {
    visible: true,
    disabled: false
  }), _defineProperty(_ref, POST_ACTION_TYPES.DELETE, {
    visible: deleteIsVisible,
    disabledReason: deleteDisabledReason
  }), _ref;
});

var getPostsIdsFromProps = function getPostsIdsFromProps(state, props) {
  return props.selectedRows;
};

export var getBulkCloneDisabled = createSelector([getPosts, getPostsIdsFromProps], function (posts, postIds) {
  if (postIds.length === 0) {
    return false;
  }

  return posts.filter(function (p) {
    return postIds.includes(p.get('id'));
  }).filter(function (p) {
    return !p.get('broadcastGuid') && p.isVideo() || p.metadata.media.size > MAX_ALLOWED_IMAGES_COMPOSER;
  }).size > 0;
});

var getPostIdsFromProps = function getPostIdsFromProps(state, props) {
  return props.selectedRows;
};

export var getCampaignGuidFromSelectedPosts = createSelector([getPosts, getPostIdsFromProps], function (posts, postIds) {
  var selectedPosts = posts.filter(function (p) {
    return postIds.includes(p.get('id'));
  });

  if (selectedPosts.isEmpty()) {
    return null;
  }

  return selectedPosts.every(function (p) {
    return p.campaignGuid === selectedPosts.first().campaignGuid;
  }) ? selectedPosts.first().campaignGuid : null;
});

var getUserIdFromProps = function getUserIdFromProps(_state, props) {
  return props.userId;
};

export var getCreatedByUserFromProps = createSelector([getUsers, getUserIdFromProps], function (users, userId) {
  return users.get(userId);
});