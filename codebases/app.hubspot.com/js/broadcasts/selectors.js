'use es6';

import { createSelector } from 'reselect';
import { identity } from 'underscore';
import { getCampaigns } from '../redux/selectors/campaigns';
import { getPostsState, getBroadcastCountsByStatus, getUploadedErrors } from '../redux/selectors';
import { getUsers } from '../redux/selectors/users';
import { getUserIsPublisher } from '../redux/selectors/user';
import { attachEntitiesToPostOrBroadcast } from '../posts/selectors';
import { getChannelsForComposerPicker, getChannelsForDisplay } from '../redux/selectors/channels';
import { BROADCAST_ACTION_TYPES, BROADCAST_STATUS_TYPE, CHANNEL_VALIDATION, MAX_ALLOWED_IMAGES_COMPOSER } from '../lib/constants';
import { getIsUngatedForManageBeta } from '../redux/selectors/gates';
export var getBroadcastPosts = createSelector([getCampaigns, getChannelsForDisplay, getPostsState], function (campaigns, channels, posts) {
  return posts.broadcasts.map(function (broadcast) {
    return attachEntitiesToPostOrBroadcast(broadcast, channels, campaigns);
  });
});

var getBroadcastPostIdFromProps = function getBroadcastPostIdFromProps(_state, props) {
  return props.broadcastGuid;
};

export var getBroadcastPost = createSelector([getBroadcastPosts, getBroadcastPostIdFromProps], function (broadcastPosts, broadcastPostId) {
  return broadcastPosts.get(broadcastPostId);
});

var getBroadcastGuidFromProps = function getBroadcastGuidFromProps(_state, props) {
  return props.broadcastGuid;
};

export var getBroadcastAuthor = createSelector([getBroadcastPosts, getBroadcastGuidFromProps, getUsers], function (broadcasts, broadcastGuid, users) {
  var broadcast = broadcasts.get(broadcastGuid);

  if (broadcast.isUploaded() && broadcast.userUpdatedAt) {
    return users.get(broadcast.updatedBy || broadcast.createdBy);
  }

  if (!broadcast.isPublished() && broadcast.createdBy) {
    return users.get(broadcast.createdBy);
  }

  return null;
}); // const getBoostEnabled = createSelector(
//   [getBroadcast, getChannelsForComposerPicker, getStatusType],
//   (broadcast, channels, statusType) => {
//     const channel = channels.find(c => c.channelKey === broadcast.channelKey);
//     if (broadcast.isPublished() && channel) {
//       const userCanModify =
//         broadcast.getStatusType() === BROADCAST_STATUS_TYPE.draft
//           ? channel.userCanDraft
//           : channel.userCanPublish;
//       return (
//         !channel.publishingErrors.includes(CHANNEL_VALIDATION.EXPIRED) &&
//         userCanModify
//       );
//     }
//     return false;
//   }
// );

var getViewDetailsEnabledForBroadcast = createSelector([getBroadcastPost, getChannelsForComposerPicker], function (broadcast, channels) {
  var channel = channels.get(broadcast.channelKey);

  if (broadcast.isPublished() || broadcast.isFailed() || broadcast.isRunning() || !channel) {
    return true;
  }

  if (broadcast.getStatusType() === BROADCAST_STATUS_TYPE.draft) {
    return !channel.userCanDraft;
  }

  return !channel.userCanPublish;
});
var getEditEnabledForBroadcast = createSelector([getBroadcastPost, getChannelsForComposerPicker], function (broadcast, channels) {
  var channel = channels.get(broadcast.channelKey);

  if (!channel || !broadcast || broadcast.isPublished() || broadcast.isFailed() || broadcast.isRunning()) {
    return false;
  }

  if (broadcast.isDraft()) {
    return channel.userCanDraft;
  }

  return channel.userCanPublish;
});
var getDeleteEnabledForBroadcast = createSelector([getBroadcastPost, getChannelsForComposerPicker], function (broadcast, channels) {
  var channel = channels.get(broadcast.channelKey);
  var isDraft = broadcast.getStatusType() === BROADCAST_STATUS_TYPE.draft;

  if (channel) {
    var userCanModify = isDraft ? channel.userCanDraft : channel.userCanPublish;
    return !channel.publishingErrors.includes(CHANNEL_VALIDATION.EXPIRED) && userCanModify && broadcast.canDelete();
  }

  return false;
});
var getCloneEnabledForBroadcast = createSelector([getBroadcastPost, getChannelsForComposerPicker], function (broadcast, channels) {
  var channel = channels.get(broadcast.channelKey);

  if (channel) {
    return !channels.filter(function (c) {
      return c.accountSlug === channel.accountSlug;
    }).isEmpty();
  }

  return false;
});

var getSelectedBroadcastIdsFromProps = function getSelectedBroadcastIdsFromProps(state, props) {
  return props.selectedBroadcastIds;
};

export var getBulkCloneDisabledForBroadcasts = createSelector([getBroadcastPosts, getSelectedBroadcastIdsFromProps], function (broadcasts, selectedBroadcastIds) {
  if (broadcasts.size === 0) {
    return false;
  }

  return broadcasts.filter(function (broadcast) {
    return selectedBroadcastIds.includes(broadcast.get('id'));
  }).filter(function (broadcast) {
    return !broadcast.get('broadcastGuid') && broadcast.isVideo() || broadcast.metadata.media.size > MAX_ALLOWED_IMAGES_COMPOSER;
  }).size > 0;
});
var getMakeDraftEnabledForBroadcast = createSelector([getBroadcastPost, getChannelsForComposerPicker], function (broadcast, channels) {
  var channel = channels.get(broadcast.channelKey);

  if (channel && broadcast.isScheduled()) {
    return channel.userCanPublish && broadcast.getStatusType() === BROADCAST_STATUS_TYPE.scheduled;
  }

  return false;
});
var getApproveDraftEnabled = createSelector([getBroadcastPost, getChannelsForComposerPicker], function (broadcast, channels) {
  var channel = channels.get(broadcast.channelKey);

  if (channel && broadcast.isDraft()) {
    return channel.userCanPublish;
  }

  return false;
});
export var getActionsForBroadcast = createSelector([getViewDetailsEnabledForBroadcast, getEditEnabledForBroadcast, getDeleteEnabledForBroadcast, getCloneEnabledForBroadcast, getMakeDraftEnabledForBroadcast, getApproveDraftEnabled], function (viewDetailsEnabled, editEnabled, deleteEnabled, cloneEnabled, makeDraftEnabled, approveDraft) {
  var actions = []; // this order is going to be the order shown in the dropdown

  if (viewDetailsEnabled) actions.push(BROADCAST_ACTION_TYPES.VIEW_DETAILS);
  if (editEnabled) actions.push(BROADCAST_ACTION_TYPES.EDIT);
  if (cloneEnabled) actions.push(BROADCAST_ACTION_TYPES.CLONE);
  if (makeDraftEnabled) actions.push(BROADCAST_ACTION_TYPES.MAKE_DRAFT);
  if (approveDraft) actions.push(BROADCAST_ACTION_TYPES.APPROVE_DRAFT);
  if (deleteEnabled) actions.push(BROADCAST_ACTION_TYPES.DELETE);
  return actions;
});

var getBroadcastGuidsFromProps = function getBroadcastGuidsFromProps(state, props) {
  return props.selectedRows;
};

export var getCampaignGuidFromSelectedBroadcasts = createSelector([getBroadcastPosts, getBroadcastGuidsFromProps], function (broadcasts, broadcastGuids) {
  var selectedBroadcasts = broadcasts.filter(function (b) {
    return broadcastGuids.includes(b.get('broadcastGuid'));
  });

  if (selectedBroadcasts.isEmpty()) {
    return null;
  }

  return selectedBroadcasts.every(function (b) {
    return b.campaignGuid === selectedBroadcasts.first().campaignGuid;
  }) ? selectedBroadcasts.first().campaignGuid : null;
});

var getStatusTypeFromProps = function getStatusTypeFromProps(state, props) {
  return props.statusType;
};

export var getBroadcastStatusTypesVisible = createSelector([getBroadcastCountsByStatus, getStatusTypeFromProps, getIsUngatedForManageBeta], function (broadcastCountsByStatus, statusType, isUngatedForManageBeta) {
  // Show failed posts if:
  // * The current tab is for failed broadcasts, OR
  // * The current portal is ungated for Manage Beta, OR
  // * The current portal has a nonzero number of failed posts
  var shouldShowFailedPosts = statusType === 'FAILED' || isUngatedForManageBeta || broadcastCountsByStatus && broadcastCountsByStatus.get(BROADCAST_STATUS_TYPE.failed);
  return [BROADCAST_STATUS_TYPE.scheduled, shouldShowFailedPosts && BROADCAST_STATUS_TYPE.failed, statusType === 'PENDING' && BROADCAST_STATUS_TYPE.pending || broadcastCountsByStatus && broadcastCountsByStatus.get(BROADCAST_STATUS_TYPE.pending) && BROADCAST_STATUS_TYPE.pending, BROADCAST_STATUS_TYPE.draft, statusType === 'UPLOADED' && BROADCAST_STATUS_TYPE.uploaded || broadcastCountsByStatus && broadcastCountsByStatus.get(BROADCAST_STATUS_TYPE.uploaded) && BROADCAST_STATUS_TYPE.uploaded].filter(identity);
});
export var getMoveToScheduledDisabled = createSelector([getUploadedErrors, getUserIsPublisher], function (uploadedErrors, userIsPublisher) {
  return Boolean(!uploadedErrors || !uploadedErrors.isEmpty()) || !userIsPublisher;
});