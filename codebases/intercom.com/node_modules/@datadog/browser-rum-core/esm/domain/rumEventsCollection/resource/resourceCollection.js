import { __assign } from "tslib";
import { combine, generateUUID, RequestType, ResourceType, toServerDuration, relativeToClocks, } from '@datadog/browser-core';
import { supportPerformanceEntry, } from '../../../browser/performanceCollection';
import { RumEventType } from '../../../rawRumEvent.types';
import { LifeCycleEventType } from '../../lifeCycle';
import { matchRequestTiming } from './matchRequestTiming';
import { computePerformanceResourceDetails, computePerformanceResourceDuration, computeResourceKind, computeSize, isRequestKind, } from './resourceUtils';
export function startResourceCollection(lifeCycle) {
    lifeCycle.subscribe(LifeCycleEventType.REQUEST_COMPLETED, function (request) {
        lifeCycle.notify(LifeCycleEventType.RAW_RUM_EVENT_COLLECTED, processRequest(request));
    });
    lifeCycle.subscribe(LifeCycleEventType.PERFORMANCE_ENTRY_COLLECTED, function (entry) {
        if (entry.entryType === 'resource' && !isRequestKind(entry)) {
            lifeCycle.notify(LifeCycleEventType.RAW_RUM_EVENT_COLLECTED, processResourceEntry(entry));
        }
    });
}
function processRequest(request) {
    var type = request.type === RequestType.XHR ? ResourceType.XHR : ResourceType.FETCH;
    var matchingTiming = matchRequestTiming(request);
    var startClocks = matchingTiming ? relativeToClocks(matchingTiming.startTime) : request.startClocks;
    var correspondingTimingOverrides = matchingTiming ? computePerformanceEntryMetrics(matchingTiming) : undefined;
    var tracingInfo = computeRequestTracingInfo(request);
    var resourceEvent = combine({
        date: startClocks.timeStamp,
        resource: {
            id: generateUUID(),
            type: type,
            duration: toServerDuration(request.duration),
            method: request.method,
            status_code: request.status,
            url: request.url,
        },
        type: RumEventType.RESOURCE,
    }, tracingInfo, correspondingTimingOverrides);
    return {
        startTime: startClocks.relative,
        rawRumEvent: resourceEvent,
        domainContext: {
            performanceEntry: matchingTiming && toPerformanceEntryRepresentation(matchingTiming),
            xhr: request.xhr,
            response: request.response,
            requestInput: request.input,
            requestInit: request.init,
            error: request.error,
        },
    };
}
function processResourceEntry(entry) {
    var type = computeResourceKind(entry);
    var entryMetrics = computePerformanceEntryMetrics(entry);
    var tracingInfo = computeEntryTracingInfo(entry);
    var startClocks = relativeToClocks(entry.startTime);
    var resourceEvent = combine({
        date: startClocks.timeStamp,
        resource: {
            id: generateUUID(),
            type: type,
            url: entry.name,
        },
        type: RumEventType.RESOURCE,
    }, tracingInfo, entryMetrics);
    return {
        startTime: startClocks.relative,
        rawRumEvent: resourceEvent,
        domainContext: {
            performanceEntry: toPerformanceEntryRepresentation(entry),
        },
    };
}
function computePerformanceEntryMetrics(timing) {
    return {
        resource: __assign({ duration: computePerformanceResourceDuration(timing), size: computeSize(timing) }, computePerformanceResourceDetails(timing)),
    };
}
function computeRequestTracingInfo(request) {
    var hasBeenTraced = request.traceId && request.spanId;
    if (!hasBeenTraced) {
        return undefined;
    }
    return {
        _dd: {
            span_id: request.spanId.toDecimalString(),
            trace_id: request.traceId.toDecimalString(),
        },
    };
}
function computeEntryTracingInfo(entry) {
    return entry.traceId ? { _dd: { trace_id: entry.traceId } } : undefined;
}
function toPerformanceEntryRepresentation(entry) {
    if (supportPerformanceEntry() && entry instanceof PerformanceEntry) {
        entry.toJSON();
    }
    return entry;
}
//# sourceMappingURL=resourceCollection.js.map