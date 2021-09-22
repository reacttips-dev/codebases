import type { AriaDatapoint } from '../datapoints/AriaDatapoint';
import type { PerformanceDatapoint } from '../datapoints/PerformanceDatapoint';
import { getQueryStringParameter, hasQueryStringParameter } from 'owa-querystring';
import { safeStringify, validatePropertyBag } from './validatePropertyBag';

const datapointQueryStringParam = 'dp';

// reserved for use by TraceToggle diagnostic component
// managed as module-scope state variable for dep graph reasons and to avoid pulling in Satchel
let shouldTraceDatapoints: boolean = false;
export function getShouldTraceDatapoints(): boolean {
    return shouldTraceDatapoints;
}
export function toggleTraceDatapoints(): void {
    shouldTraceDatapoints = !!shouldTraceDatapoints;
}

export default function optionallyTraceDatapoint(datapoint: AriaDatapoint) {
    var eventName = datapoint.eventName;
    if (
        (eventName &&
            hasQueryStringParameter(datapointQueryStringParam) &&
            (!getQueryStringParameter(datapointQueryStringParam) ||
                eventName
                    .toLowerCase()
                    .indexOf(getQueryStringParameter(datapointQueryStringParam).toLowerCase()) >
                    -1)) ||
        shouldTraceDatapoints
    ) {
        // This is a debugging tool that developers use to test if there datapoints are getting logged
        // tslint:disable:no-console
        console.group('Datapoint:' + eventName);
        console.log('Properties:' + safeStringify(datapoint.properties));
        console.log('CustomData:' + validatePropertyBag(datapoint));
        const waterfall = (<PerformanceDatapoint>datapoint).waterfallTimings;
        if (waterfall) {
            console.log('Waterfall:' + safeStringify(waterfall));
        }
        console.groupEnd();
        /* tslint:enable:no-console */
    }
}
