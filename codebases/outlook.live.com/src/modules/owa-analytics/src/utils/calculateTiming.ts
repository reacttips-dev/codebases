import getAbsoluteResourceTiming from './getAbsoluteResourceTiming';
import type CalculatedResourceTimings from '../types/CalculatedResourceTimings';

export default function calculateTiming(
    timing: PerformanceResourceTiming | PerformanceTiming | undefined,
    name?: string
): CalculatedResourceTimings | undefined {
    if (timing) {
        const st = timing.fetchStart || (<PerformanceResourceTiming>timing).startTime;
        return {
            name: name || (<PerformanceResourceTiming>timing).name,
            ST: st,
            WS: getAbsoluteResourceTiming((<PerformanceResourceTiming>timing).workerStart, st),
            RdS: getAbsoluteResourceTiming(timing.redirectStart, st),
            RdE: getAbsoluteResourceTiming(timing.redirectEnd, st),
            FS: getAbsoluteResourceTiming(timing.fetchStart, st),
            DS: getAbsoluteResourceTiming(timing.domainLookupStart, st),
            DE: getAbsoluteResourceTiming(timing.domainLookupEnd, st),
            CS: getAbsoluteResourceTiming(timing.connectStart, st),
            SCS: getAbsoluteResourceTiming(timing.secureConnectionStart, st),
            CE: getAbsoluteResourceTiming(timing.connectEnd, st),
            RqS: getAbsoluteResourceTiming(timing.requestStart, st),
            RpS: getAbsoluteResourceTiming(timing.responseStart, st),
            RpE: getAbsoluteResourceTiming(timing.responseEnd, st),
            P: (<PerformanceResourceTiming>timing).nextHopProtocol,
        };
    }
    return undefined;
}
