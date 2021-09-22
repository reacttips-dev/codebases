import { isDogfoodEnv } from 'owa-metatags';

// This is max allowed value for 1 symbol in UTF8, which is 1 string character in Kusto;
const MAXVAL = 0x10ffff;

const isPerformanceSupported = window?.performance;
const bootTimings: { [index: string]: number | string } = {};

export function addBootTiming(name: string) {
    if (isPerformanceSupported) {
        bootTimings[name] = Math.floor(performance.now());
    }
}

export function getBootTimings() {
    const timing = isPerformanceSupported && window.performance.timing;
    if (timing) {
        bootTimings['in_e'] = timing.responseEnd - timing.fetchStart;

        if (isDogfoodEnv()) {
            const startingPoint = timing.navigationStart;

            /** Metrics is a UTF8 string of 21n symbols,
             each symbol represents diff from starting point
             Starting point is navigationStart
             Here is an order of events
             0: redirectStart || 0
             1: redirectEnd || 0
             2: unloadEventStart || 0
             3: unloadEventEnd || 0
             4: fetchStart
             5: domainLookupStart
             6: domainLookupEnd
             7: connectStart
             8: secureConnectionStart || 0
             9: connectEnd
             10: requestStart
             11: responseStart
             12: responseEnd
             13: domLoading
             14: domInteractive
             15: domComplete
             16: domContentLoadedEventStart
             17: domContentLoadedEventEnd
             18: loadEventStart
             19: loadEventEnd
             20: workerStart ( != 0 if browser has support for new timings API (Not Safari, Not IE))
             **/

            const timingFromNewApi =
                isPerformanceSupported &&
                (window.performance?.getEntriesByType(
                    'navigation'
                )?.[0] as PerformanceNavigationTiming);
            const workerStart = timingFromNewApi?.workerStart || 0;

            const metrics = String.fromCharCode(
                ...[
                    timing.redirectStart - startingPoint,
                    timing.redirectEnd - startingPoint,
                    timing.unloadEventStart - startingPoint,
                    timing.unloadEventEnd - startingPoint,
                    timing.fetchStart - startingPoint,
                    timing.domainLookupStart - startingPoint,
                    timing.domainLookupEnd - startingPoint,
                    timing.connectStart - startingPoint,
                    timing.secureConnectionStart - startingPoint,
                    timing.connectEnd - startingPoint,
                    timing.requestStart - startingPoint,
                    timing.responseStart - startingPoint,
                    timing.responseEnd - startingPoint,
                    timing.domLoading - startingPoint,
                    timing.domInteractive - startingPoint,
                    timing.domComplete - startingPoint,
                    timing.domContentLoadedEventStart - startingPoint,
                    timing.domContentLoadedEventEnd - startingPoint,
                    timing.loadEventStart - startingPoint,
                    timing.loadEventEnd - startingPoint,
                    workerStart,
                ].map(t => Math.min(Math.max(t, 0), MAXVAL))
            );
            bootTimings['fl'] = metrics;
        }
    }
    return JSON.stringify(bootTimings);
}
