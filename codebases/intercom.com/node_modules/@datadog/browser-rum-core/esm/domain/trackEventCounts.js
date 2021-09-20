import { noop } from '@datadog/browser-core';
import { RumEventType } from '../rawRumEvent.types';
import { LifeCycleEventType } from './lifeCycle';
export function trackEventCounts(lifeCycle, callback) {
    if (callback === void 0) { callback = noop; }
    var eventCounts = {
        errorCount: 0,
        longTaskCount: 0,
        resourceCount: 0,
        userActionCount: 0,
    };
    var subscription = lifeCycle.subscribe(LifeCycleEventType.RUM_EVENT_COLLECTED, function (_a) {
        var type = _a.type;
        switch (type) {
            case RumEventType.ERROR:
                eventCounts.errorCount += 1;
                callback(eventCounts);
                break;
            case RumEventType.ACTION:
                eventCounts.userActionCount += 1;
                callback(eventCounts);
                break;
            case RumEventType.LONG_TASK:
                eventCounts.longTaskCount += 1;
                callback(eventCounts);
                break;
            case RumEventType.RESOURCE:
                eventCounts.resourceCount += 1;
                callback(eventCounts);
                break;
        }
    });
    return {
        stop: function () {
            subscription.unsubscribe();
        },
        eventCounts: eventCounts,
    };
}
//# sourceMappingURL=trackEventCounts.js.map