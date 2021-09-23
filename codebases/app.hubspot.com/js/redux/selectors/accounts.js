'use es6';

import { createTruthySelector } from 'truthy-selector';
import { createSelector } from 'reselect';
import { OrderedSet, Map as ImmutableMap } from 'immutable';
import { getAccounts, getYoutubeEnabled, getChannels, getAccountChannels } from './index';
import { ACCOUNT_TYPES, CONNECT_MODAL_NETWORKS, CHANNEL_OWNER_TYPES, CHANNEL_TYPES } from '../../lib/constants';
export var getPendingAccounts = function getPendingAccounts(state) {
  return state.pendingAccounts;
};
export var getConnectStep = function getConnectStep(state) {
  return state.ui.get('connectStep');
};
export var getConnectingAccountGuid = function getConnectingAccountGuid(state) {
  return state.ui.get('connectingAccountGuid');
};
export var getConnectingNetwork = function getConnectingNetwork(state) {
  return state.ui.get('connectingNetwork');
};
export var getConnectingAccount = createSelector([getAccounts, getConnectingAccountGuid, getPendingAccounts], function (accounts, connectingAccountGuid, pendingAccounts) {
  return connectingAccountGuid && accounts.find(function (a) {
    return a.accountGuid === connectingAccountGuid;
  }) || pendingAccounts && pendingAccounts.get(connectingAccountGuid);
}); // todo - make scope based for rest of networks?

export var getConnectableAccountTypes = createSelector([getYoutubeEnabled], function (youtubeEnabled) {
  var networks = OrderedSet(CONNECT_MODAL_NETWORKS);

  if (youtubeEnabled) {
    networks = networks.add(ACCOUNT_TYPES.youtube);
  }

  return networks;
});

var groupAndSortChannels = function groupAndSortChannels(channels) {
  return channels.groupBy(function (c) {
    return c.channelSlug;
  }).sortBy(function (v, c) {
    return Object.values(CHANNEL_TYPES || {}).indexOf(c.channelSlug);
  });
};

var getOriginalChannels = createTruthySelector([getAccountChannels, getConnectingAccount], function (accountChannels, connectingAccount) {
  return accountChannels.get(connectingAccount.accountGuid).filter(function (c) {
    return c.canPublish();
  }).sortBy(function (c) {
    return CHANNEL_OWNER_TYPES.includes(c.channelSlug) ? 0 : 1;
  });
}); // Filters out those FB/IG channels without FACEBOOK_PAGE_TASKS.CREATE_CONTENT page task.

export var getLackPermissionsChannels = createTruthySelector([getOriginalChannels], function (originalChannels) {
  return groupAndSortChannels(originalChannels.filter(function (c) {
    return !c.isPageTaskCompliant();
  }));
}); // Returns FB/IG channels that are missing scopes.

export var getLackScopesChannels = createTruthySelector([getOriginalChannels], function (originalChannels) {
  return groupAndSortChannels(originalChannels.filter(function (channel) {
    return !channel.missingScopes.isEmpty();
  }));
});
export var getConnectedChannels = createTruthySelector([getOriginalChannels, getChannels], function (originalChannels, channels) {
  return groupAndSortChannels(originalChannels.filter(function (c) {
    return c.getCanBeConnected();
  }).filter(function (c) {
    return channels.get(c.channelKey);
  }).map(function (c) {
    return c.merge({
      hidden: false,
      settings: channels.get(c.channelKey).settings
    });
  }));
});
export var getConnectableChannels = createTruthySelector([getOriginalChannels, getChannels], function (originalChannels, channels) {
  return groupAndSortChannels(originalChannels.filter(function (c) {
    return c.getCanBeConnected();
  }).filter(function (c) {
    return !channels.get(c.channelKey);
  }).filter(function (c) {
    return c.accountSlug === ACCOUNT_TYPES.twitter ? c : c.hidden;
  }));
});
export var getAccountChannelsByAccount = createTruthySelector([getAccountChannels, getConnectingAccount], function (accountChannels, connectingAccount) {
  if (!connectingAccount) {
    return ImmutableMap();
  }

  return accountChannels.get(connectingAccount.accountGuid);
});
export var getChannelsConnectingCount = function getChannelsConnectingCount(state) {
  return state.channelsConnectingCount;
};