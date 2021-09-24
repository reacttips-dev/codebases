'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { Map as ImmutableMap, List as ImmutableList, Set as ImmutableSet } from 'immutable';
import { handleActions } from 'flux-actions';
import { identity } from 'underscore';
import ActionMapper from '../../lib/legacyRequestActionMapper';
import actionTypes from '../actions/actionTypes';
import { CHANNEL_VALIDATION, ACCOUNT_TYPES, CHANNEL_TYPES } from '../../lib/constants';

var getWillExpireSoon = function getWillExpireSoon(accounts) {
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

var setPageTaskError = function setPageTaskError(channel, errors) {
  return !channel.getCanBeConnected() && !channel.isPageTaskCompliant() ? errors.add(CHANNEL_VALIDATION.FB_PAGE_PERMISSIONS) : errors;
};

var setGranularScopesError = function setGranularScopesError(channel, errors) {
  return !channel.getCanBeConnected() && !channel.missingScopes.isEmpty() ? errors.add(CHANNEL_VALIDATION.FB_CHANNEL_SCOPES) : errors;
};

var setExpiredError = function setExpiredError(accounts, errors) {
  return accounts.every(function (a) {
    return a.expired;
  }) ? errors.add(CHANNEL_VALIDATION.EXPIRED) : errors;
};

var setExpireSoonError = function setExpireSoonError(accounts, errors) {
  return getWillExpireSoon(accounts) ? errors.add(CHANNEL_VALIDATION.WILL_EXPIRE) : errors;
};

var setLinkedinPermissionError = function setLinkedinPermissionError(accounts, channelSlug, errors) {
  var account = accounts.sortBy(function (a) {
    return -a.createdAt;
  }).first();

  if ([CHANNEL_TYPES.linkedincompanypage, CHANNEL_TYPES.linkedinstatus].includes(channelSlug) && account.requiresOneOffPermissionReconnect) {
    return errors.add(CHANNEL_VALIDATION.LI_PERMISSION_MIGRATION);
  }

  return errors;
};

var setInstagramError = function setInstagramError(accounts, channelSlug, errors) {
  if (channelSlug === ACCOUNT_TYPES.instagram && !accounts.every(function (a) {
    return a.missingScopes.isEmpty();
  })) {
    return errors.add(CHANNEL_VALIDATION.INSTAGRAM_PERMISSIONS);
  }

  return errors;
};

var getChannelPublishingErrors = function getChannelPublishingErrors(accounts, channel) {
  var errors = channel.publishingErrors;
  errors = setPageTaskError(channel, errors);
  errors = setGranularScopesError(channel, errors);
  errors = setExpiredError(accounts, errors);
  errors = setExpireSoonError(accounts, errors); // errors = setInactiveChannelError(channel, errors);

  errors = setLinkedinPermissionError(accounts, channel.channelSlug, errors);
  errors = setInstagramError(accounts, channel.channelSlug, errors);
  return errors;
};

export function attachAccountToChannels(channels, accounts, ownedAccountGuids, users) {
  var userCanConfigureSharedAccounts = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  return channels.map(function (c) {
    var channelAccounts = c.accountGuids.map(function (accountGuid) {
      return accounts.find(function (a) {
        return a.accountGuid === accountGuid;
      });
    }).filter(identity);

    if (channelAccounts.isEmpty()) {
      return c;
    }

    var account = channelAccounts.sortBy(function (a) {
      return -a.createdAt;
    }).first();
    var user;

    if (users) {
      user = users.find(function (u) {
        return u.id === account.createdBy;
      });
    } // we require every because if not all of the accountGuids in this channel are attached to the user's accounts, its not completely owned by the user
    // Once PUBLISHING_PERMISSIONS_GATE is ungate to all we should be able to use c.userCanConfigure instead of c.shared or c.owned


    var owned = c.accountGuids.every(function (guid) {
      return ownedAccountGuids.has(guid);
    });
    var accountThatExpiresLast = channelAccounts.sortBy(function (a) {
      return 0 - a.expiresAt;
    }).first();
    var nonExpiredAccountGuids = channelAccounts.filter(function (a) {
      return !a.expired;
    }).map(function (a) {
      return a.accountGuid;
    }).toSet();
    c = c.merge({
      owned: owned,
      accountName: account.name,
      accountServiceId: account.serviceId,
      accountExpired: nonExpiredAccountGuids.isEmpty(),
      accountExpiredAt: account.expiresAt,
      accountUserName: user ? user.getFullName() : null,
      publishingErrors: getChannelPublishingErrors(channelAccounts, c),
      willExpireSoon: getWillExpireSoon(channelAccounts),
      accountExpiresAt: accountThatExpiresLast ? accountThatExpiresLast.expiresAt : null
    }); // if there are multiple visible instances of this account, disconnection or changes to BAP will affect all instances
    // a user lacking social-shared-accounts-configure (eg "Their accounts only" should not be able to do this)

    if (c.userCanConfigure && !userCanConfigureSharedAccounts) {
      // however, if all instances are expired or the only remaining unexpired instance of the account belongs to the current user, they should be able to reconnect/disconnect
      if (!nonExpiredAccountGuids.isEmpty() && ownedAccountGuids.intersect(nonExpiredAccountGuids).isEmpty()) {
        c = c.set('userCanConfigure', false);
      }
    }

    return c;
  });
}
export var DEFAULT_ACCOUNTS_STATE = {
  accountChannels: ImmutableMap(),
  accounts: ImmutableList(),
  accountsConnected: ImmutableSet(),
  configurableChannelKeys: ImmutableSet(),
  draftableChannelKeys: ImmutableSet(),
  ownedAccountGuids: ImmutableSet(),
  pendingAccounts: ImmutableMap(),
  publishableChannelKeys: ImmutableSet(),
  readableChannelKeys: ImmutableSet()
};
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, ActionMapper.success(actionTypes.ACCOUNT_COMPLETE_AUTH), function (state, action) {
  if (action.data.account && action.data.channels) {
    var account = action.data.account;
    state = Object.assign({}, state);
    state.accountChannels = state.accountChannels.set(account.accountGuid, action.data.channels);
    state.pendingAccounts = state.pendingAccounts.set(account.accountGuid, account);
    return state;
  }

  return state;
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.ACCOUNTS_WITH_CHANNELS_FETCH), function (state, action) {
  return Object.assign({}, state, {
    logicalChannels: action.data.channels,
    accounts: action.data.accounts,
    ownedAccountGuids: action.data.ownedAccountGuids,
    configurableChannelKeys: action.data.configurableChannelKeys,
    draftableChannelKeys: action.data.draftableChannelKeys,
    publishableChannelKeys: action.data.publishableChannelKeys,
    readableChannelKeys: action.data.readableChannelKeys,
    totalConnectedChannels: action.data.totalConnectedChannels
  });
}), _defineProperty(_handleActions, actionTypes.CHANNEL_UPDATE, function (state, action) {
  var _action$payload = action.payload,
      channelKey = _action$payload.channelKey,
      data = _action$payload.data;
  var logicalChannel = state.logicalChannels.get(channelKey);
  var logicalChannels = state.logicalChannels;

  if (logicalChannel) {
    logicalChannels = logicalChannels.mergeIn([logicalChannel.channelKey], data);
  }

  return Object.assign({}, state, {
    logicalChannels: logicalChannels
  });
}), _defineProperty(_handleActions, actionTypes.CHANNEL_SET_CONNECTING_COUNT, function (state, action) {
  return Object.assign({}, state, {
    channelsConnectingCount: action.payload
  });
}), _defineProperty(_handleActions, actionTypes.ACCOUNT_CHANNEL_UPDATE, function (state, action) {
  var accountChannels = state.accountChannels.mergeIn([action.payload.accountGuid, action.payload.channelKey], action.payload.attrs);
  return Object.assign({}, state, {
    accountChannels: accountChannels
  });
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.ACCOUNT_CREATE), function (state, action) {
  return Object.assign({}, state, {
    pendingAccount: action.data
  });
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.ACCOUNT_DELETE), function (state, action) {
  return Object.assign({}, state, {
    accounts: state.accounts.filterNot(function (a) {
      return a.accountGuid === action.data;
    })
  });
}), _defineProperty(_handleActions, actionTypes.OAUTH_CALLBACK, function (state, action) {
  return Object.assign({}, state, {
    accountsConnected: state.accountsConnected.add(action.payload.accountGuid)
  });
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.BLOG_AUTO_PUBLISH_SAVE), function (state, action) {
  if (state) {
    var logicalChannels = state.logicalChannels.setIn([action.channelKey, 'autoPublishBlogIds'], ImmutableSet(action.data.blogAutoPublishSettings.map(function (b) {
      return b.blogId;
    })));
    return Object.assign({}, state, {
      logicalChannels: logicalChannels
    });
  }

  return state;
}), _handleActions));