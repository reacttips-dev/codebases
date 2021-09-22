import { isPerformanceTimingSupported } from 'owa-analytics-start';
import type CalculatedResourceTimings from '../types/CalculatedResourceTimings';
import captureAssetsOptics from '../captureAssetsOptics';
import calculateTiming from './calculateTiming';

type ResourceTimingCallback = (timings: CalculatedResourceTimings | undefined) => void;
const sequenceNumbersToCapture: { [sequenceNumber: string]: ResourceTimingCallback } = {};
let cachedResourceTimings: { [sequenceNumber: string]: PerformanceResourceTiming } = {};
let totalResources: number = 0;

let timeoutId;
export default function getResourceTimingForUrl(
    url: string
): Promise<CalculatedResourceTimings | undefined> {
    return new Promise(resolve => {
        const sequenceNumber = extractSequenceNumber(url);
        if (!isPerformanceTimingSupported() || sequenceNumber == -1) {
            return resolve(undefined);
        }

        sequenceNumbersToCapture[sequenceNumber] = addToExistingFunction(
            sequenceNumbersToCapture[sequenceNumber],
            resolve
        );

        // we will try to resolve it now
        resolveUrls();
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            resolveUrls();

            // if we can't capture the url after the timeout, we will resolve the callbacks with undefined
            for (let sequenceNumber of Object.keys(sequenceNumbersToCapture)) {
                resolveSequenceNumber(sequenceNumber);
            }
            cachedResourceTimings = {};
        }, 2000);
    });
}

export function getTotalResourceCount() {
    return totalResources;
}

function addToExistingFunction(
    existingFunction: ResourceTimingCallback,
    newFunction: ResourceTimingCallback
): ResourceTimingCallback {
    if (existingFunction) {
        return function (timing: CalculatedResourceTimings | undefined) {
            existingFunction(timing);
            newFunction(timing);
        };
    }
    return newFunction;
}

function resolveUrls() {
    updateTimings();
    for (let sequenceNumber of Object.keys(sequenceNumbersToCapture)) {
        const timing = cachedResourceTimings[sequenceNumber];
        if (timing) {
            // we found the timing so lets call the callback
            resolveSequenceNumber(sequenceNumber, timing);
        }
    }
}

function resolveSequenceNumber(sn: string, timing?: PerformanceResourceTiming) {
    sequenceNumbersToCapture[sn](calculateTiming(timing));
    delete sequenceNumbersToCapture[sn];
    delete cachedResourceTimings[sn];
}

function updateTimings() {
    const timings = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    totalResources += timings.length;
    cachedResourceTimings = timings.reduce((agg, timing) => {
        const sn = extractSequenceNumber(timing.name);
        if (sn > -1) {
            agg[sn] = timing;
        }
        return agg;
    }, cachedResourceTimings || {});
    captureAssetsOptics(timings.map(t => calculateTiming(t)));
    if (window.performance.clearResourceTimings) {
        window.performance.clearResourceTimings();
    } else if (window.performance.webkitClearResourceTimings) {
        window.performance.webkitClearResourceTimings();
    }
}

// This will try to extract the sequence number from a url such as the one below
// https://outlook-sdf.office.com/owa/service.svc?action=GetConversationItems&n=25&app=Mail
const extractSequenceNumberRegex = /n=([\d]+)/;
function extractSequenceNumber(url: string): number {
    let match = extractSequenceNumberRegex.exec(url);
    if (match) {
        return parseInt(match[1]) || -1;
    }
    return -1;
}
