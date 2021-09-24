'use es6';

import addAvailabilityMessageTimeout from './addAvailabilityMessageTimeout';
import { publishAvailabilityMessage } from '../actions/publishAvailabilityMessage';
import getAvailabilityMessageTimeouts from '../selectors/getAvailabilityMessageTimeouts';
var FIVE_SECONDS_IN_MS = 5000;
export function addAvailabilityMessage(_ref) {
  var channel = _ref.channel,
      threadId = _ref.threadId;
  return function (dispatch, getState) {
    var timeouts = getAvailabilityMessageTimeouts(getState());

    if (!timeouts.get(channel)) {
      var timeout = setTimeout(function () {
        dispatch(publishAvailabilityMessage({
          channel: channel,
          threadId: threadId
        }));
      }, FIVE_SECONDS_IN_MS);
      dispatch(addAvailabilityMessageTimeout(channel, timeout));
    }
  };
}