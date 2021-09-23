'use es6';

import { Map as ImmutableMap } from 'immutable';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import { getAsyncPubSubClient } from 'conversations-internal-pub-sub/redux/selectors/pubSubClientGetters';
import { getChannelName, getThreadId } from '../../threads/operators/threadGetters';
import { isUninitialized } from 'conversations-async-data/async-data/operators/statusComparators';
import { CREATE_NEW_THREAD } from '../../thread-create/constants/actionTypes';
import { hasPersistedThreads } from '../../threads/selectors/hasPersistedThreads';
import { startPubSub } from '../actions/startPubSub';
import { isClientReady } from 'conversations-internal-pub-sub/redux/operators/isClientReady';
import { onMessageReceived } from '../actions/onMessageReceived';
import { PUBSUB_READY, RESUBSCRIBE } from 'conversations-internal-pub-sub/redux/constants/actionTypes';
import { updateSubscriptions } from 'conversations-internal-pub-sub/redux/actions/subscriptions';
import { getThreads } from '../../threads/selectors/getThreads';
import { CHANNEL_CHANGE_RECEIVED } from '../constants/pubsubActionTypes';
var SUBSCRIBE_TRIGGERS = [PUBSUB_READY, RESUBSCRIBE, CREATE_NEW_THREAD.SUCCEEDED, ActionTypes.GET_VISITOR_THREADS_SUCCESS, CHANNEL_CHANGE_RECEIVED];
export var realtime = function realtime(store) {
  var applyMessageHandler = function applyMessageHandler(threads) {
    return threads.reduce(function (acc, thread) {
      var channel = getChannelName(thread);
      var threadId = getThreadId(thread);
      return acc.set(channel, {
        onMessage: function onMessage(message) {
          return store.dispatch(onMessageReceived({
            channel: channel,
            message: message,
            threadId: threadId,
            publishContext: {
              playback: false
            }
          }));
        },
        // TODO: Communication team recommends creating
        // a batch action for handling all playback messages
        // at once to avoid intermediary state thrashing
        onPlayback: function onPlayback(messages) {
          messages.forEach(function (message) {
            store.dispatch(onMessageReceived({
              channel: channel,
              message: message,
              threadId: threadId,
              publishContext: {
                playback: true
              }
            }));
          });
        },
        // ensure visitor is entered into presence
        // on the agent->visitor channel. Subscribe
        // to these messages to get presence state updates
        onPresence: function onPresence(__presenceState) {}
      });
    }, ImmutableMap()).toJS();
  };

  return function (next) {
    return function (action) {
      var result = next(action);
      var asyncPubSubClient = getAsyncPubSubClient(store.getState());
      var newThreadCreated = action.type === CREATE_NEW_THREAD.SUCCEEDED;
      var visitorHasExistingThreads = action.type === ActionTypes.GET_VISITOR_THREADS_SUCCESS && hasPersistedThreads(store.getState());

      if (isUninitialized(asyncPubSubClient) && (newThreadCreated || visitorHasExistingThreads)) {
        store.dispatch(startPubSub({
          newThreadCreated: newThreadCreated
        }));
      }

      if (isClientReady(asyncPubSubClient) && SUBSCRIBE_TRIGGERS.includes(action.type)) {
        var threads = getThreads(store.getState());
        var subscriptions = applyMessageHandler(threads);
        store.dispatch(updateSubscriptions(subscriptions));
      }

      return result;
    };
  };
};