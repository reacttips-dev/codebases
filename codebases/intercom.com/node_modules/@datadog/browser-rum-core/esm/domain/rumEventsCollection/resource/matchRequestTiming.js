import { toValidEntry } from './resourceUtils';
/**
 * Look for corresponding timing in resource timing buffer
 *
 * Observations:
 * - Timing (start, end) are nested inside the request (start, end)
 * - Some timing can be not exactly nested, being off by < 1 ms
 * - Browsers generate a timing entry for OPTIONS request
 *
 * Strategy:
 * - from valid nested entries (with 1 ms error margin)
 * - if a single timing match, return the timing
 * - if two following timings match (OPTIONS request), return the timing for the actual request
 * - otherwise we can't decide, return undefined
 */
export function matchRequestTiming(request) {
    if (!performance || !('getEntriesByName' in performance)) {
        return;
    }
    var sameNameEntries = performance.getEntriesByName(request.url, 'resource');
    if (!sameNameEntries.length || !('toJSON' in sameNameEntries[0])) {
        return;
    }
    var candidates = sameNameEntries
        .map(function (entry) { return entry.toJSON(); })
        .filter(toValidEntry)
        .filter(function (entry) {
        return isBetween(entry, request.startClocks.relative, endTime({ startTime: request.startClocks.relative, duration: request.duration }));
    });
    if (candidates.length === 1) {
        return candidates[0];
    }
    if (candidates.length === 2 && firstCanBeOptionRequest(candidates)) {
        return candidates[1];
    }
    return;
}
function firstCanBeOptionRequest(correspondingEntries) {
    return endTime(correspondingEntries[0]) <= correspondingEntries[1].startTime;
}
function endTime(timing) {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return (timing.startTime + timing.duration);
}
function isBetween(timing, start, end) {
    var errorMargin = 1;
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return timing.startTime >= start - errorMargin && endTime(timing) <= end + errorMargin;
}
//# sourceMappingURL=matchRequestTiming.js.map