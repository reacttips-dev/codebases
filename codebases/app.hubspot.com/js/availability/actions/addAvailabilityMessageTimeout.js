'use es6';

import { createAction } from 'flux-actions';
import { ADD_AVAILABILITY_MESSAGE_TIMEOUT } from '../constants/actionTypes';
var addAvailabilityMessageTimeout = createAction(ADD_AVAILABILITY_MESSAGE_TIMEOUT, function (channel, timeout) {
  return {
    channel: channel,
    timeout: timeout
  };
});
export { addAvailabilityMessageTimeout as default, addAvailabilityMessageTimeout };