'use es6';

import { fromJS, Record, List } from 'immutable';
import { QUEUE_ACCESS_TYPE_PRIVATE } from '../constants/QueueConstants';
var QueueRecord = Record({
  id: null,
  name: null,
  engagementIds: List(),
  accessType: QUEUE_ACCESS_TYPE_PRIVATE,
  userParticipants: List(),
  ownerId: null
}, 'QueueRecord');

QueueRecord.fromJS = function (json) {
  return QueueRecord(fromJS(json));
};

export default QueueRecord;