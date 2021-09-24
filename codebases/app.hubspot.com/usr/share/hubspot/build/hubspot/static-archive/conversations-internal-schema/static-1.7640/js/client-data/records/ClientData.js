'use es6';

import { OrderedMap, Record } from 'immutable';
var ClientData = Record({
  chatConfig: null,
  client: null,
  connectionInProgress: false,
  forceClientOffline: false,
  isAdmin: true,
  isInForeground: true,
  isPubNubClientConnected: false,
  serverTimeOffsetInMs: 0,
  timestamps: OrderedMap(),
  uuid: null
}, 'ClientData');
export default ClientData;