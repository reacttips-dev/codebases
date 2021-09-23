'use es6';

import { initializePubSub } from 'conversations-internal-pub-sub/redux/actions/initializePubSub';
import Raven from 'Raven';
import { getToken } from '../clients/getToken';
import { resolveBuilder } from '../resolvers/resolveBuilder';
import { trackUserInteraction } from '../../actions/trackUserInteraction';
import { getSessionId } from '../../selectors/widgetDataSelectors/getSessionId';
import { networkOnline } from '../../actions/PubSubStatusActions/networkOnline';
import { networkOffline } from '../../actions/PubSubStatusActions/networkOffline';
import { fetchCurrentThreadHistory } from '../../thread-histories/actions/fetchCurrentThreadHistory';
import { fetchVisitorThreads } from '../../threads/actions/ThreadActions';
import { getThreads } from '../../threads/selectors/getThreads';
import { diffPrimitives } from 'conversations-internal-pub-sub/utils/diffPrimitives';
import { getChannelName } from '../../threads/operators/threadGetters';
import { onThreadCreatedAndNetworkOnline } from '../../actions/PubSubStatusActions/onThreadCreatedAndNetworkOnline';
import { getHubspotUtk } from '../../query-params/hubspotUtk';
export var startPubSub = function startPubSub() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      newThreadCreated = _ref.newThreadCreated;

  return function (dispatch, getState) {
    // TODO [Follow up]: Find a better home for this
    dispatch(trackUserInteraction());
    var clientOptions = {
      skipSubscribeReauth: false,
      authCallback: function authCallback(__tokenParams, callback) {
        var sessionId = getSessionId(getState());
        var hubspotUtk = getHubspotUtk();
        getToken({
          sessionId: sessionId,
          hubspotUtk: hubspotUtk
        }).then(function (tokenRequest) {
          try {
            var channels = getThreads(getState()).map(getChannelName).valueSeq().toJS();
            var capability = JSON.parse(tokenRequest.capability);
            var grantedChannels = Object.keys(capability);
            var difference = diffPrimitives(channels, grantedChannels);

            if (difference.length) {
              Raven.captureMessage('capability mismatch', {
                level: 'error',
                extra: {
                  channels: channels,
                  grantedChannels: grantedChannels,
                  difference: difference,
                  sessionId: sessionId
                }
              });
            }
          } catch (error) {// Do nothing
          }

          callback(null, tokenRequest);
        }, function (error) {
          return callback(error);
        });
      }
    };
    var lifecycleHooks = {
      onConnect: function onConnect(_ref2) {
        var connectionWasSuspended = _ref2.connectionWasSuspended,
            reconnected = _ref2.reconnected;
        dispatch(networkOnline());

        if (newThreadCreated) {
          dispatch(onThreadCreatedAndNetworkOnline());
        }

        if (connectionWasSuspended || reconnected) {
          dispatch(fetchCurrentThreadHistory());
        }

        if (connectionWasSuspended) {
          dispatch(fetchVisitorThreads());
        }
      },
      onDisconnect: function onDisconnect() {
        dispatch(networkOffline());
      },
      onFailure: function onFailure() {
        dispatch(networkOffline());
      }
    };
    dispatch(initializePubSub({
      clientOptions: clientOptions,
      lifecycleHooks: lifecycleHooks,
      resolveBuilder: resolveBuilder
    }));
  };
};