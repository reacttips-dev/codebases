'use es6';

import { createSelector } from 'reselect';
import { createTruthySelector } from 'truthy-selector';
import enviro from 'enviro';
import PortalStorage from '../../lib/storage';
import { SCOPES, ADS_BOOSTING_POST_SOURCE, ACCOUNT_TYPES, APP_SECTIONS, NAV_ITEMS, PUBLISHING_VIEW_ROUTE } from '../../lib/constants';
import { getInitialQuery } from './initialQuery';
import { fromJS } from 'immutable';
import { getGates } from './gates';
import { getHasAdsReadAccess } from './user';
import { getMostRecentIndexView } from './users';
var storage = PortalStorage.getInstance();
export var getAccounts = function getAccounts(state) {
  return state.accounts;
};
export var getChannels = function getChannels(state) {
  return state.logicalChannels;
};
export var getAccountChannels = function getAccountChannels(state) {
  return state.accountChannels;
};
export var getConfigurableChannelKeys = function getConfigurableChannelKeys(state) {
  return state.configurableChannelKeys;
}; // meaning should show in the dropdowns around the app, possible that unshared chanenls owned by others are returned but not considered "readable" in that sense

export var getReadableChannelKeys = function getReadableChannelKeys(state) {
  return state.readableChannelKeys;
};
export var getDraftableChannelKeys = function getDraftableChannelKeys(state) {
  return state.draftableChannelKeys;
};
export var getPublishableChannelKeys = function getPublishableChannelKeys(state) {
  return state.publishableChannelKeys;
};
export var getOwnedAccountGuids = function getOwnedAccountGuids(state) {
  return state.ownedAccountGuids;
};
export var getFollowMeLinks = function getFollowMeLinks(state) {
  return state.followMeLinks;
};
export var getCampaigns = function getCampaigns(state) {
  return state.campaigns;
};
export var getFeed = function getFeed(state) {
  return state.feed;
};
export var getDataFilter = function getDataFilter(state) {
  return state.dataFilter;
};
export var getInteractions = function getInteractions(state) {
  return state.interactions;
};
export var getBroadcastCounts = function getBroadcastCounts(state) {
  return state.broadcastCounts;
};
export var getBroadcastCountsByStatus = function getBroadcastCountsByStatus(state) {
  return state.broadcastCounts.get('byStatus');
};
export var getBroadcastGroup = function getBroadcastGroup(state) {
  return state.broadcastGroup;
};
export var getBroadcastExtra = function getBroadcastExtra(state) {
  return state.broadcast;
};
export var getBroadcasts = function getBroadcasts(state) {
  return state.broadcasts;
};
export var getCalendarBroadcasts = function getCalendarBroadcasts(state) {
  return state.calendarBroadcasts;
};
export var getUploadedErrors = function getUploadedErrors(state) {
  return state.uploadedErrors;
};
export var user = function user(state) {
  return state.user;
};
export var unboxing = function unboxing(state) {
  return state.unboxing;
};
export var getStreams = function getStreams(state) {
  return state.streams && state.streams.sortBy(function (s) {
    return -s.updatedAt;
  });
};
export var getInbox = function getInbox(state) {
  return state.inbox;
};
export var getUi = function getUi(state) {
  return state.ui;
};
export var getRelationships = function getRelationships(state) {
  return state.relationships;
};
export var getPostsState = function getPostsState(state) {
  return state.posts;
};
export var getProfile = function getProfile(state) {
  return state.profile;
};
export var getSocialContacts = function getSocialContacts(state) {
  return state.socialContacts;
};
export var getFacebookEngagementModalVisible = function getFacebookEngagementModalVisible(state) {
  return Boolean(state.ui.get('isFacebookEngagementModalVisible'));
};
export var getUploads = function getUploads(state) {
  return state.uploads;
};
export var getExportModalIsOpen = createSelector([getUi], function (ui) {
  return ui.get('exportModalIsOpen');
});
export var getPortalId = function getPortalId(state) {
  return state.portal.portal_id;
};
export var getIntel = function getIntel(state) {
  return state.intel;
};
export var getUsers = function getUsers(state) {
  return state.users;
};
export var getBoostedPosts = function getBoostedPosts(state) {
  return state.boostedPosts;
};
export var getRoute = function getRoute(state) {
  if (state.composerEmbed) {
    return {
      id: 'composerEmbed'
    };
  }

  if (state.route.current) {
    return state.route.current;
  }

  if (state.routes) {
    return state.routes[state.routes.length - 1];
  }

  return null;
};
export var getAccountsForDisplay = createSelector([getAccounts, getUsers], function (accounts, users) {
  if (!accounts) {
    return null;
  }

  if (!users) {
    return accounts;
  }

  return accounts.map(function (a) {
    if (a.user) {
      return a;
    }

    return a.set('user', users.get(a.createdBy));
  });
});
export var getAccountsForSettings = createSelector([getAccountsForDisplay], function (accounts) {
  return accounts && accounts.filter(function (acc) {
    return acc.accountSlug !== ACCOUNT_TYPES.bitly;
  });
});
export var getAppSection = function getAppSection(state) {
  if (state.composerEmbed) {
    return 'composerEmbed';
  }

  return getRoute(state) && getRoute(state).appSection;
};
export var hasLoaded = function hasLoaded() {
  for (var _len = arguments.length, requestNames = new Array(_len), _key = 0; _key < _len; _key++) {
    requestNames[_key] = arguments[_key];
  }

  return function (state) {
    return requestNames.every(function (r) {
      return state.requests.get(r) === 200;
    });
  };
};
export var isFailed = function isFailed() {
  for (var _len2 = arguments.length, requestNames = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    requestNames[_key2] = arguments[_key2];
  }

  // requests have been made and are neither loading nor successful
  return function (state) {
    return requestNames.some(function (r) {
      return state.requests.get(r) === 0 || state.requests.get(r) >= 400;
    });
  };
};
export var isDebug = function isDebug() {
  return Boolean(enviro.debug('social'));
};
export var getMonitoringEnabled = function getMonitoringEnabled() {
  return !storage.hasOptedOut() || Boolean(enviro.debug('monitoring'));
};
export var getInstagramCommentsEnabled = function getInstagramCommentsEnabled() {
  return true;
};
export var getYoutubeEnabled = function getYoutubeEnabled(state) {
  return state.user.scopes.includes(SCOPES.youtubeAccess);
};
export var getSocialContactsEnabled = function getSocialContactsEnabled() {
  return true;
};
export var getCalendarEnabled = function getCalendarEnabled() {
  return true;
};
export var currentLocation = function currentLocation(state) {
  return state.routing.locationBeforeTransitions;
};
export var ssOnboarding = createSelector([unboxing], function (_unboxing) {
  return _unboxing && Boolean(_unboxing.find(function (s) {
    return s.get('name') === 'ssOnboarding';
  }));
});
export var classicOnboarding = createSelector([unboxing], function (_unboxing) {
  return _unboxing && Boolean(_unboxing.find(function (s) {
    return s.get('name') === 'accountActivation';
  }));
});
export var hasCompletedOnboarding = createTruthySelector([ssOnboarding, classicOnboarding], function (_ssOnboarding, _classicOnboarding) {
  return _ssOnboarding || _classicOnboarding;
});
export var getFromApp = createSelector([getInitialQuery], function (initialQuery) {
  return initialQuery && initialQuery.from;
});
export var isFromAdsCreateFlow = createSelector([getInitialQuery], function (initialQuery) {
  return Boolean(initialQuery && initialQuery.source === ADS_BOOSTING_POST_SOURCE);
});
export function isRivalIqEnabled(state) {
  return state.user.scopes.includes(SCOPES.socialMonitoringCompanies);
}
export function bulkApprovalEnabled(state) {
  return state.user.scopes.includes(SCOPES.socialDraftOnlyUserAccess);
}
export var isLoading = function isLoading() {
  for (var _len3 = arguments.length, requestNames = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    requestNames[_key3] = arguments[_key3];
  }

  return function (state) {
    return requestNames.some(function (r) {
      return state.requests.get(r) === 100;
    });
  };
};
export var getNavItems = createSelector([getGates, getMostRecentIndexView], function (gates, mostRecentIndexView) {
  var navItems = fromJS(NAV_ITEMS);
  return navItems.filter(function (item) {
    return !item.get('gate') && !item.get('notGate') || gates.has(item.get('gate')) || Boolean(item.get('notGate') && !gates.has(item.get('notGate')));
  }).map(function (navItem) {
    if (navItem.get('id') === APP_SECTIONS.publishing) {
      return navItem.set('route', PUBLISHING_VIEW_ROUTE[mostRecentIndexView]);
    }

    return navItem;
  });
});
export var getUserCanBoostPosts = createSelector([getHasAdsReadAccess], function (hasAdsReadAccess) {
  return hasAdsReadAccess;
});
export var getStorage = function getStorage(state) {
  return state.storage;
};