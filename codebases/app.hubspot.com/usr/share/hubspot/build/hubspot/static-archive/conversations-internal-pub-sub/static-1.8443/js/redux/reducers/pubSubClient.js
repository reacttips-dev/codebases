'use es6';

import IndexedAsyncData from 'conversations-async-data/indexed-async-data/IndexedAsyncData';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { updateEntry } from 'conversations-async-data/indexed-async-data/operators/updateEntry';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestStateUpdate } from 'conversations-async-data/async-data/operators/requestStateUpdate';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { stringIdInvariant } from 'conversations-async-data/indexed-async-data/invariants/stringIdInvariant';
import { INITIALIZE_PUBSUB, PUBSUB_READY, PUBSUB_RECONNECTED, PUBSUB_DISCONNECTED, PUBSUB_RECONNECTING, PUBSUB_SUSPENDED } from '../constants/actionTypes';
import { CONNECTED, DISCONNECTED, RECONNECTING, SUSPENDED } from '../constants/states';

var idenity = function idenity(f) {
  return f;
};

var initialState = IndexedAsyncData({
  name: 'pubSubClient',
  idInvariant: stringIdInvariant,
  notSetValue: AsyncData()
});
export var pubSubClient = function pubSubClient() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case INITIALIZE_PUBSUB.STARTED:
      {
        var clientKey = action.payload.clientKey;
        return updateEntry(clientKey, requestStarted, state);
      }

    case INITIALIZE_PUBSUB.SUCCEEDED:
      {
        var _action$payload = action.payload,
            client = _action$payload.client,
            _clientKey = _action$payload.clientKey;
        return updateEntry(_clientKey, requestSucceededWithOperator(function () {
          return client;
        }), state);
      }

    case INITIALIZE_PUBSUB.FAILED:
      {
        var _clientKey2 = action.payload.clientKey;
        return updateEntry(_clientKey2, requestFailed, state);
      }

    case PUBSUB_RECONNECTING:
      {
        var _clientKey3 = action.payload.clientKey;
        return updateEntry(_clientKey3, requestStateUpdate(RECONNECTING, idenity), state);
      }

    case PUBSUB_RECONNECTED:
    case PUBSUB_READY:
      {
        var _clientKey4 = action.payload.clientKey;
        return updateEntry(_clientKey4, requestStateUpdate(CONNECTED, idenity), state);
      }

    case PUBSUB_DISCONNECTED:
      {
        var _clientKey5 = action.payload.clientKey;
        return updateEntry(_clientKey5, requestStateUpdate(DISCONNECTED, idenity), state);
      }

    case PUBSUB_SUSPENDED:
      {
        var _clientKey6 = action.payload.clientKey;
        return updateEntry(_clientKey6, requestStateUpdate(SUSPENDED, idenity), state);
      }

    default:
      {
        return state;
      }
  }
};