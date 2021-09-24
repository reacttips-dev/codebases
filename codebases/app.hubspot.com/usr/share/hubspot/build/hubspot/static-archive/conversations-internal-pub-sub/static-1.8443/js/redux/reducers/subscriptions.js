'use es6';

import IndexedAsyncData from 'conversations-async-data/indexed-async-data/IndexedAsyncData';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { updateEntry } from 'conversations-async-data/indexed-async-data/operators/updateEntry';
import { requestStateUpdate } from 'conversations-async-data/async-data/operators/requestStateUpdate';
import { requestStartedWithOperator } from 'conversations-async-data/async-data/operators/requestStartedWithOperator';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { requestFailedWithError } from 'conversations-async-data/async-data/operators/requestFailedWithError';
import { stringIdInvariant } from 'conversations-async-data/indexed-async-data/invariants/stringIdInvariant';
import { UPDATE_SUBSCRIPTIONS, RESUBSCRIBE } from '../constants/actionTypes';
import { RESUBSCRIBING } from '../constants/states';
var initialState = IndexedAsyncData({
  name: 'subscriptions',
  idInvariant: stringIdInvariant,
  notSetValue: AsyncData({
    data: null
  })
});

var subscriptionsReducer = function subscriptionsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case UPDATE_SUBSCRIPTIONS.STARTED:
      {
        var _action$payload = action.payload,
            clientKey = _action$payload.clientKey,
            _subscriptions = _action$payload.subscriptions;
        return updateEntry(clientKey, requestStartedWithOperator(function () {
          return _subscriptions;
        }), state);
      }

    case RESUBSCRIBE.STARTED:
      {
        var _action$payload2 = action.payload,
            _clientKey = _action$payload2.clientKey,
            _subscriptions2 = _action$payload2.subscriptions;
        return updateEntry(_clientKey, requestStateUpdate(RESUBSCRIBING, function () {
          return _subscriptions2;
        }), state);
      }

    case RESUBSCRIBE.SUCCEEDED:
    case UPDATE_SUBSCRIPTIONS.SUCCEEDED:
      {
        var _action$payload3 = action.payload,
            _clientKey2 = _action$payload3.clientKey,
            _subscriptions3 = _action$payload3.subscriptions;
        return updateEntry(_clientKey2, requestSucceededWithOperator(function () {
          return _subscriptions3;
        }), state);
      }

    case RESUBSCRIBE.FAILED:
    case UPDATE_SUBSCRIPTIONS.FAILED:
      {
        var _action$payload4 = action.payload,
            _clientKey3 = _action$payload4.clientKey,
            error = _action$payload4.error;
        return updateEntry(_clientKey3, requestFailedWithError(error), state);
      }

    default:
      {
        return state;
      }
  }
};

export var subscriptions = subscriptionsReducer;