'use es6';

import { List, Record } from 'immutable';
import { INITIAL_MESSAGE } from '../constants/messageType';
var InitialMessage = Record({
  '@type': INITIAL_MESSAGE,
  clientType: null,
  id: null,
  richText: null,
  sender: null,
  status: null,
  text: null,
  timestamp: null,
  attachments: List()
}, 'InitialMessage');
export default InitialMessage;