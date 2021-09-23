'use es6';

import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { CRM_OBJECT_LIFECYCLE_UPDATE } from '../constants/messageTypes';
export var isCrmObjectLifecycleUpdate = function isCrmObjectLifecycleUpdate(message) {
  return getTopLevelType(message) === CRM_OBJECT_LIFECYCLE_UPDATE;
};