'use es6';

import { createAction } from 'flux-actions';
import { identity } from 'underscore';
import { push } from 'react-router-redux';
import { postNotification } from 'ReduxMessenger/actions/NotificationActions';
import actionTypes from './actionTypes';
import { fetchAccountsAndChannels, refreshAfterAccountConnect } from './accounts';
import { setConnectStep, updateRequest } from './ui';
import { getAppSection, isFromAdsCreateFlow, getChannels } from '../selectors';
import { ACCOUNT_TYPES, APP_SECTIONS, CONNECT_STEPS, REQUEST_STATUS, TWITTER_PUBLISH_ANYWHERE_OPTIONS } from '../../lib/constants';
import LogicalChannel from '../../data/model/Channel';
import AccountManager from '../../data/AccountManager';
import ChannelManager from '../../data/ChannelManager';
import { trackInteraction } from './usage';
import { getNotificationFor } from '../../lib/utils';
import { getConnectingAccount } from '../selectors/accounts';
import { setFacebookEngagementModalVisibility } from './app';
import { fetchAccountsWithChannels } from './actions';
var channelManager = ChannelManager.getInstance();
var accountManager = AccountManager.getInstance();
var channelUpdateAction = createAction(actionTypes.CHANNEL_UPDATE, identity);
export var updateAccountChannel = createAction(actionTypes.ACCOUNT_CHANNEL_UPDATE, function (accountGuid, channelKey, attrs) {
  return {
    accountGuid: accountGuid,
    channelKey: channelKey,
    attrs: attrs
  };
});
export var saveChannel = function saveChannel(channelKey, attrs) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.CHANNEL_SAVE,
      apiRequest: function apiRequest() {
        return channelManager.saveChannelByKey(channelKey, attrs).then(function (data) {
          return LogicalChannel.createFromDto(data);
        }).catch(function (err) {
          dispatch(fetchAccountsAndChannels());
          throw err;
        });
      }
    });
  };
};
export var deleteChannel = function deleteChannel(channelKey) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.CHANNEL_DELETE,
      channelKey: channelKey,
      apiRequest: function apiRequest() {
        return channelManager.deleteChannel(channelKey).then(function () {
          return dispatch(fetchAccountsWithChannels());
        });
      }
    });
  };
};
export var setChannelShared = function setChannelShared(channel, shared) {
  return function (dispatch) {
    dispatch(channelUpdateAction({
      channelKey: channel.channelKey,
      data: {
        shared: shared
      }
    }));
    dispatch(saveChannel(channel.channelKey, {
      shared: shared
    }));
  };
};
export var unhideChannel = function unhideChannel(channel) {
  return function (dispatch) {
    dispatch(channelUpdateAction({
      channelKey: channel.channelKey,
      data: {
        hidden: false
      }
    }));
  };
}; // only used from SelectChannelsModal so operates on per-account channels

export var activateNewAccountChannels = function activateNewAccountChannels(_ref) {
  var account = _ref.account,
      channelMap = _ref.channelMap,
      _ref$options = _ref.options,
      options = _ref$options === void 0 ? {} : _ref$options;
  return function (dispatch, getState) {
    var state = getState();
    var connectingAccount = getConnectingAccount(state);
    var connectedChannels = getChannels(state);
    var isOnboarding = getAppSection(state) === APP_SECTIONS.onboarding;

    function handleSelectChannelsSuccess() {
      if (isFromAdsCreateFlow(state) && connectingAccount.accountSlug === ACCOUNT_TYPES.facebook) {
        dispatch(setConnectStep(null));
        dispatch(refreshAfterAccountConnect(false, options));
        dispatch(setFacebookEngagementModalVisibility(true));
        return;
      }

      if (isOnboarding) {
        dispatch(refreshAfterAccountConnect(true, options));
        dispatch(setConnectStep(null));
        dispatch(push('getting-started'));
      } else {
        dispatch(setConnectStep(CONNECT_STEPS.success));
      }

      dispatch(updateRequest('activateNewAccountChannels', REQUEST_STATUS.success));
    }

    function handleSelectChannelsFailure() {
      dispatch(postNotification(getNotificationFor(actionTypes.CHANNEL_BULK_SAVE, 'danger', {
        id: actionTypes.CHANNEL_BULK_SAVE
      })));
      dispatch(updateRequest('activateNewAccountChannels', null));
    }

    if (connectingAccount) {
      dispatch(trackInteraction('bulk unhide channels', {
        channelCount: channelMap.size,
        network: connectingAccount.accountSlug
      }));
    }

    dispatch(updateRequest('activateNewAccountChannels', REQUEST_STATUS.loading));
    var allChannelKeys = channelMap.keySeq().toSet(); // Remove already-connected channels from the number of channels
    // that are about to be connected. allChannelKeys represents
    // ALL channels, not just ones that are newly connected

    var numberOfNewlyConnectedAccounts = allChannelKeys.reduce(function (count, currentChannelGuid) {
      // If this channel does not exist in the set of currently connected channels,
      // increment the count by one
      if (!connectedChannels.has(currentChannelGuid)) {
        count += 1;
      }

      return count;
    }, 0);
    dispatch({
      type: actionTypes.CHANNEL_SET_CONNECTING_COUNT,
      payload: numberOfNewlyConnectedAccounts
    });
    return accountManager.activateAccount(account, allChannelKeys).then(handleSelectChannelsSuccess).catch(handleSelectChannelsFailure);
  };
};
export var saveBlogAutoPublish = function saveBlogAutoPublish(channelKey, blogIds) {
  return function (dispatch) {
    dispatch({
      type: actionTypes.BLOG_AUTO_PUBLISH_SAVE,
      channelKey: channelKey,
      apiRequest: function apiRequest() {
        return channelManager.saveBlogAutoPublish(channelKey, blogIds);
      }
    });
  };
};
export var saveTwitterChannel = function saveTwitterChannel(channel, accountGuid, attrs) {
  return function (dispatch, getState) {
    dispatch({
      type: actionTypes.CHANNEL_SAVE,
      apiRequest: function apiRequest() {
        dispatch(updateRequest('activateNewAccountChannels', REQUEST_STATUS.loading));
        dispatch({
          type: actionTypes.CHANNEL_SET_CONNECTING_COUNT,
          payload: 1
        }); // Make channel shared if PA = ENABLED && it wasn't shared before

        if (attrs.publishAnywhere === TWITTER_PUBLISH_ANYWHERE_OPTIONS.ENABLED && !channel.shared) {
          dispatch(setChannelShared(channel, true));
        }

        return channelManager.savePublishAnywhere(channel.channelId, attrs).then(function () {
          if (getAppSection(getState()) === APP_SECTIONS.onboarding) {
            dispatch(refreshAfterAccountConnect(true, {}));
            dispatch(setConnectStep(null));
            dispatch(push('getting-started'));
          } else {
            dispatch(setConnectStep(CONNECT_STEPS.success));
          }

          dispatch(updateRequest('activateNewAccountChannels', REQUEST_STATUS.success));
        }).catch(function (err) {
          dispatch(updateRequest('activateNewAccountChannels', REQUEST_STATUS.null));
          dispatch(fetchAccountsAndChannels());
          throw err;
        });
      }
    });
  };
};
export { fetchAccountsWithChannels };