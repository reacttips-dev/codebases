'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import { getEntry } from 'conversations-async-data/indexed-async-data/operators/getters';
import { DEFAULT_CLIENT_KEY } from '../constants/clientKeys';
export var getIndexedAsyncPubSubClients = get('pubSubClient');
export var getClientKeyFromProps = function getClientKeyFromProps(__state) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$clientKey = _ref.clientKey,
      clientKey = _ref$clientKey === void 0 ? DEFAULT_CLIENT_KEY : _ref$clientKey;

  return clientKey;
};
export var getAsyncPubSubClient = createSelector([getClientKeyFromProps, getIndexedAsyncPubSubClients], getEntry);
export var getPubSubClient = createSelector([getAsyncPubSubClient], getData);
export var getPubSubVendor = createSelector([getPubSubClient], function (client) {
  return client && client.vendor;
});