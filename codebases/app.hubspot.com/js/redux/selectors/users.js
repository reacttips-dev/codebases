'use es6';

import { SHEPHERD_TOURS_USER_ATTRIBUTES, USER_ATTR_DEFAULT_PUBLISHING_VIEW, PUBLISHING_VIEW, USER_ATTR_FAVORITE_CHANNEL_POPOVER_SEEN, USER_ATTR_FAVORITE_CHANNEL_KEYS, USER_ATTR_DEFAULT_PUBLISH_NOW, FAVORITE_CHANNELS_LIMIT, USER_ATTR_MANAGE_COLUMNS, getNetworkFromChannelKey, USER_ATTR_FAILED_POST_BANNER_DISMISSAL_TIME } from '../../lib/constants';
import { createSelector } from 'reselect';
export var getUsers = function getUsers(state) {
  return state.users;
};
export var getUserAttributes = function getUserAttributes(state) {
  return state.userAttributes;
};
export var getManageDashboardStepsSeen = createSelector([getUserAttributes], function (userAttributes) {
  var manageDashboardStepsSeen = userAttributes.get(SHEPHERD_TOURS_USER_ATTRIBUTES.manageDashboard);
  return JSON.parse(manageDashboardStepsSeen);
});
export var getManageDashboardStartTourModalStepsSeen = createSelector([getUserAttributes], function (userAttributes) {
  var manageDashboardStepsSeen = userAttributes.get(SHEPHERD_TOURS_USER_ATTRIBUTES.manageDashboardStartTourModal);
  return JSON.parse(manageDashboardStepsSeen);
});
export var getReportsTourStepsSeen = createSelector([getUserAttributes], function (userAttributes) {
  var reportsTourStepsSeen = userAttributes.get(SHEPHERD_TOURS_USER_ATTRIBUTES.reportsNextOverview);
  return JSON.parse(reportsTourStepsSeen);
});
export var getDetailsPanelTourStepsSeen = createSelector([getUserAttributes], function (userAttributes) {
  var detailsPanelTourStepsSeen = userAttributes.get(SHEPHERD_TOURS_USER_ATTRIBUTES.detailsPanel);
  return JSON.parse(detailsPanelTourStepsSeen);
});
export var getMostRecentIndexView = createSelector([getUserAttributes], function (userAttributes) {
  return userAttributes.get(USER_ATTR_DEFAULT_PUBLISHING_VIEW) === PUBLISHING_VIEW.calendar ? PUBLISHING_VIEW.calendar : PUBLISHING_VIEW.publishingTable;
});
export var getFavoriteChannelsSeen = createSelector([getUserAttributes], function (userAttributes) {
  return userAttributes.get(USER_ATTR_FAVORITE_CHANNEL_POPOVER_SEEN);
});
export var getFavoriteChannelKeys = createSelector([getUserAttributes], function (userAttributes) {
  return userAttributes && JSON.parse(userAttributes.get(USER_ATTR_FAVORITE_CHANNEL_KEYS));
});
export var getSavedColumns = createSelector([getUserAttributes], function (userAttributes) {
  return userAttributes && JSON.parse(userAttributes.get(USER_ATTR_MANAGE_COLUMNS));
});
export var getDefaultPublishNow = createSelector([getUserAttributes], function (userAttributes) {
  return userAttributes.get(USER_ATTR_DEFAULT_PUBLISH_NOW) !== 'false';
});
export var getComposerShepherdSeen = createSelector([getUserAttributes], function (userAttributes) {
  return JSON.parse(userAttributes.get(SHEPHERD_TOURS_USER_ATTRIBUTES.composer));
});
export var getPublishingTableStepsSeen = createSelector([getUserAttributes], function (userAttributes) {
  return JSON.parse(userAttributes.get(SHEPHERD_TOURS_USER_ATTRIBUTES.publishingTable));
});
export var getOverFavoriteChannelsLimit = createSelector([getFavoriteChannelKeys], function (favoriteChannelKeys) {
  return favoriteChannelKeys.length >= FAVORITE_CHANNELS_LIMIT;
});
export var makeGetFavoriteChannelsForNetwork = createSelector([getFavoriteChannelKeys], function (favoriteChannelKeys) {
  return function (network) {
    return favoriteChannelKeys.filter(function (k) {
      return getNetworkFromChannelKey(k) === network;
    });
  };
});
export var makeGetIsFavoriteChannel = createSelector([getFavoriteChannelKeys], function (favoriteChannelKeys) {
  return function (channelKey) {
    return favoriteChannelKeys.indexOf(channelKey) !== -1;
  };
});
export var makeGetFavoriteChannelsForComposer = createSelector([getFavoriteChannelKeys], function (favoriteChannelKeys) {
  return function (network, channels) {
    var networkChannels = channels.filter(function (c) {
      return c.accountSlug === network;
    }).toList();
    var favoriteChannels = networkChannels.filter(function (c) {
      return favoriteChannelKeys.indexOf(c.channelKey) !== -1;
    });

    if (!favoriteChannels.isEmpty()) {
      return favoriteChannels;
    }

    return networkChannels.slice(0, 1);
  };
});
export var getFailedPostBannerDismissedTime = createSelector([getUserAttributes], function (userAttributes) {
  var failedPostBannerDismissedTime = userAttributes.get(USER_ATTR_FAILED_POST_BANNER_DISMISSAL_TIME); // Return the parsed date if the user attribute was found
  // Otherwise, return null

  return failedPostBannerDismissedTime ? parseInt(failedPostBannerDismissedTime, 10) : null;
});