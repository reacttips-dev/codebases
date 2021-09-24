'use es6';

import { eventProps } from '../selectors/eventProps';
import { getIsPrivateLoad } from '../../widget-data/selectors/getIsPrivateLoad';
import { getUsageTracker } from '../usageTracker';
export function trackInteraction(eventName) {
  var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch, getState, contexts) {
    var tracker = getUsageTracker();
    var shouldNotUseTracker = contexts.getVisitorIdentityContext().getIsFirstVisitorSession();
    var isPrivateLoad = getIsPrivateLoad(getState());

    if (!shouldNotUseTracker) {
      tracker.track(eventName, Object.assign({}, properties, {}, eventProps(getState()), {
        privateLoad: isPrivateLoad
      }));
    }
  };
}