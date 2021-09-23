'use es6';

import { createTruthySelector } from 'truthy-selector';
import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';
import { getChannels, getPublishableChannelKeys, getDraftableChannelKeys, getConfigurableChannelKeys, getFollowMeLinks, getInbox, getAccountsForDisplay, getUsers, getOwnedAccountGuids, getReadableChannelKeys } from '../selectors';
import { ACCOUNT_TYPES, FOLLOW_ME_ACCOUNT_TYPES, FOLLOW_ME_RAW_URL_ACCOUNT_TYPES, ACCOUNT_SETTINGS_CHANNEL_TYPES, CHANNEL_VALIDATION, REPORTS_NEXT_SUPPORTED_CHANNEL_TYPES } from '../../lib/constants';
import { getFavoriteChannelsSeen } from './users';
import { attachAccountToChannels } from '../reducers/accounts';
import { getUserCanConfigureSharedAccounts, getUserIsAdmin } from './user';
export var getChannelsForDisplay = createSelector([getChannels, getAccountsForDisplay, getUsers, getUserIsAdmin, getDraftableChannelKeys, getConfigurableChannelKeys, getPublishableChannelKeys, getOwnedAccountGuids, getUserCanConfigureSharedAccounts], function (channels, accounts, users, userIsAdmin, draftableChannelKeys, configurableChannelKeys, publishableChannelKeys, ownedAccountGuids, userCanConfigureSharedAccounts) {
  if (channels && accounts) {
    channels = channels.map(function (c) {
      return c.merge({
        // allows a user to disconnect, edit BAP or shared, and if the channel is expired within all accounts - shows the "Reconnect" link
        userCanConfigure: configurableChannelKeys.includes(c.channelKey),
        // allows user to schedule/publish broadcasts on this channel or edit existing ones
        userCanPublish: publishableChannelKeys.includes(c.channelKey),
        // allows user to save drafts for broadcasts ont this channel or edit existing drafts
        userCanDraft: draftableChannelKeys.includes(c.channelKey)
      });
    });
    return attachAccountToChannels(channels, accounts, ownedAccountGuids, users, userCanConfigureSharedAccounts).map(function (c) {
      return c.set('userCanShare', c.owned || userIsAdmin);
    });
  }

  return null;
}); // Rows of the Account Settings page, in order. Does not mean that you can necessarily configure or
// disconnect them all, depends on who you are and the type of channel and whether its expired

export var accountSettingsChannels = createTruthySelector([getChannelsForDisplay], function (channels) {
  channels = channels.filter(function (c) {
    return ACCOUNT_SETTINGS_CHANNEL_TYPES.includes(c.channelSlug) && !c.hidden;
  });
  channels = channels.filterNot(function (c) {
    return c.isLongExpired();
  });
  return channels;
}); // channels active and visible to the current user, it will filter out unshared channels for
// "Their accounts only" user

export var activeChannels = createTruthySelector([getChannelsForDisplay, getReadableChannelKeys], function (channels, readableChannelKeys) {
  return channels.filter(function (c) {
    return readableChannelKeys.has(c.channelKey);
  });
}); // activeChannel but also ensures the channel is of a type that supports publishing

export var getPublishableChannels = createTruthySelector([activeChannels], function (channels) {
  return channels.filter(function (c) {
    return c.canPublish();
  });
});
export var getNonExpiredChannels = createTruthySelector([getPublishableChannels], function (channels) {
  return channels.filter(function (c) {
    return !c.accountExpired;
  });
}); // Channels that will be present in the Composer, taking publishableChannels then applying filtering
// to exclude expired channels and then based on the user's role & permissions

export var getChannelsForComposerPicker = createTruthySelector([getNonExpiredChannels], function (channels) {
  return channels.filter(function (c) {
    return c.userCanDraft || c.userCanPublish;
  }).filter(function (c) {
    return !c.publishingErrors.includes(CHANNEL_VALIDATION.FB_PAGE_PERMISSIONS);
  }).filter(function (c) {
    return !c.publishingErrors.includes(CHANNEL_VALIDATION.FB_CHANNEL_SCOPES);
  });
});
export var getChannelTypesForClone = createTruthySelector([getChannelsForComposerPicker], function (channels) {
  return channels.map(function (c) {
    return c.channelSlug;
  }).toSet();
});
export var inboxChannels = getNonExpiredChannels; // channels that can be added to follow me

export var getFollowMeAccountTypes = createTruthySelector([getNonExpiredChannels, getFollowMeLinks], function (channels, links) {
  return FOLLOW_ME_ACCOUNT_TYPES.filter(function (accountType) {
    // don't allow adding account types for which there is already a followUrl
    if (FOLLOW_ME_RAW_URL_ACCOUNT_TYPES.includes(accountType)) {
      return links.filter(function (link) {
        return link.iconName === accountType;
      }).isEmpty();
    } // can't add account types without channels at all, or for which there is already a followMe enabled channel


    var accountTypeChannels = channels.filter(function (c) {
      return c.accountSlug === accountType;
    });

    if (accountTypeChannels.isEmpty() || !links.filter(function (link) {
      return link.iconName === accountType;
    }).isEmpty()) {
      return false;
    }

    return true;
  });
});
export var getTwitterChannels = createTruthySelector([getPublishableChannels], function (channels) {
  return channels.filter(function (c) {
    return c.channelSlug === ACCOUNT_TYPES.twitter;
  });
});
export var getCurrentTwitterChannels = createTruthySelector([getTwitterChannels], function (channels) {
  return channels.filter(function (c) {
    return !c.accountExpired;
  });
});
export var getTwitterChannelsAvailableForStreams = createTruthySelector([getCurrentTwitterChannels], function (channels) {
  return channels.filter(function (c) {
    return c.isPublishAnywhereDataSource();
  });
});
export var interactingAsChannel = createTruthySelector([getCurrentTwitterChannels, getInbox], function (channels, inbox) {
  var defaultTwitterChannel = !channels.isEmpty() ? channels.first() : null;
  return channels.get(inbox.interactingAs) || defaultTwitterChannel;
});
export var getExpiredChannels = createTruthySelector([activeChannels], function (channels) {
  var expiredChannels = channels.filterNot(function (c) {
    return c.isLongExpired();
  }).filter(function (c) {
    return c.accountExpired;
  });
  var willExpireChannels = channels.filter(function (c) {
    return c.willExpireSoon;
  });
  return ImmutableMap({
    expired: expiredChannels,
    willExpire: willExpireChannels
  });
});
export var getChannelsLackFacebookPageRoles = createTruthySelector([getNonExpiredChannels], function (channels) {
  return channels.filter(function (c) {
    return c.publishingErrors.includes(CHANNEL_VALIDATION.FB_PAGE_PERMISSIONS);
  }).map(function (c) {
    return c.name;
  }).toSet();
});
export var getConnectStep = function getConnectStep(state) {
  return state.ui.get('connectStep');
};
export var getShowFavoriteChannelsPopover = createSelector([getFavoriteChannelsSeen, accountSettingsChannels, getConnectStep], function (favoriteChannelsSeen, channels, connectStep) {
  return function (currentChannel) {
    return !connectStep && !favoriteChannelsSeen && channels.first().equals(currentChannel);
  };
});
export var getNetworksFromChannels = createTruthySelector([getChannelsForComposerPicker], function (channels) {
  return channels.groupBy(function (c) {
    return c.accountSlug;
  }).keySeq().toArray();
});
export var getAccounts = function getAccounts(state) {
  return state.accounts;
};
export var accountThatExpiresLast = function accountThatExpiresLast(channels) {
  return channels.sortBy(function (a) {
    return 0 - a.expiresAt;
  }).first();
};
export var getWillExpireSoon = function getWillExpireSoon(accounts) {
  if (accounts.isEmpty()) {
    return false;
  }

  var willExpireSoonAccounts = accounts.filter(function (a) {
    return a.getWillExpireSoon();
  }).size;
  var expiredAccounts = accounts.filter(function (a) {
    return a.expired;
  }).size;
  return willExpireSoonAccounts > 0 && willExpireSoonAccounts + expiredAccounts === accounts.size;
};
export var getChannelsForReports = function getChannelsForReports(state) {
  var channels = state.channels || state.logicalChannels;

  if (!channels) {
    return channels;
  }

  return channels.filter(function (c) {
    return REPORTS_NEXT_SUPPORTED_CHANNEL_TYPES.includes(c.channelSlug);
  });
};
export var getChannelsWithAccounts = createTruthySelector([getChannelsForReports, getAccounts], function (channels, accounts) {
  var result = channels.map(function (c) {
    var channelAccounts = c.accountGuids.map(function (guid) {
      return accounts.find(function (a) {
        return a.accountGuid === guid;
      });
    });
    var account = channelAccounts.sortBy(function (a) {
      return -a.createdAt;
    }).first();
    return c.merge({
      accountExpired: channelAccounts.every(function (a) {
        return a.expired;
      }),
      accountExpiredAt: account.expiresAt,
      willExpireSoon: getWillExpireSoon(channelAccounts),
      accountExpiresAt: accountThatExpiresLast(channelAccounts) ? accountThatExpiresLast(channelAccounts).expiresAt : null,
      hasReportingData: channelAccounts.some(function (a) {
        return a.hasReportingData();
      }),
      requiresOneOffPermissionReconnect: account.requiresOneOffPermissionReconnect
    });
  });
  return result;
});
export var getOneOffReconnectRequiredAccounts = createTruthySelector([getChannelsWithAccounts, getConfigurableChannelKeys], function (channelsWithAccounts, configurableChannelKeys) {
  return channelsWithAccounts.filter(function (ch) {
    return configurableChannelKeys.contains(ch.get('channelKey')) && ch.requiresOneOffPermissionReconnect;
  }).size;
});
export var getHasLinkedInAccounts = createTruthySelector([getAccounts], function (accounts) {
  return !!accounts.find(function (acc) {
    return acc.accountSlug === ACCOUNT_TYPES.linkedin;
  });
});
export var getHasFacebookAccounts = createTruthySelector([getAccounts], function (accounts) {
  return !!accounts.find(function (acc) {
    return acc.accountSlug === ACCOUNT_TYPES.facebook;
  });
});
export var getHasInstagramAccounts = createTruthySelector([getChannelsWithAccounts], function (channels) {
  return !!channels.find(function (channel) {
    return channel.channelSlug === ACCOUNT_TYPES.instagram;
  });
});
export var getHasTwitterAccounts = createTruthySelector([getAccounts], function (accounts) {
  return accounts.some(function (acc) {
    return acc.accountSlug === ACCOUNT_TYPES.twitter;
  });
});