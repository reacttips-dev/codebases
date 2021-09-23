'use es6';

import actionTypes from './actionTypes';
import Account from '../../data/model/Account';
import Channel from '../../data/model/Channel';
import { Set as ImmutableSet } from 'immutable';
import { getUserId } from '../selectors/user';
import ChannelManager from '../../data/ChannelManager';
var channelManager = ChannelManager.getInstance();
export var fetchAccountsWithChannels = function fetchAccountsWithChannels() {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.ACCOUNTS_WITH_CHANNELS_FETCH,
      apiRequest: function apiRequest(state) {
        return channelManager.fetchAccountsWithChannels().then(function (resp) {
          var accounts = Account.createFromArray(resp.accounts);
          var userId = getUserId(state);
          var ownedAccountGuids = accounts.filter(function (a) {
            return a.createdBy === userId;
          }).map(function (a) {
            return a.accountGuid;
          }).toSet();
          return {
            accounts: accounts,
            ownedAccountGuids: ownedAccountGuids,
            channels: Channel.createFromArray(resp.channels).sortBy(function (c) {
              return c.getSortKey();
            }),
            readableChannelKeys: ImmutableSet(resp.readableChannelKeys),
            configurableChannelKeys: ImmutableSet(resp.configurableChannelKeys),
            draftableChannelKeys: ImmutableSet(resp.draftableChannelKeys),
            publishableChannelKeys: ImmutableSet(resp.publishableChannelKeys),
            totalConnectedChannels: resp.totalChannelCount
          };
        });
      }
    });
  };
};