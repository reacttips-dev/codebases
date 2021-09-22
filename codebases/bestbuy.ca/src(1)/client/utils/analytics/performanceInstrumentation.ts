import {utils as adobeLaunch} from "@bbyca/adobe-launch";

export const captureApiPerformanceMetrics = (resourceUrl: string, eventCategory: string, eventLabel: string) => {
    if (window !== undefined && window.performance !== undefined && window.performance.getEntriesByName !== undefined) {
        const metrics = window.performance.getEntriesByName(resourceUrl);

        if (metrics && metrics.length > 0) {
            // getEntriesByName returns a parent type and needs to be cast to the resouce type PerformanceResourceTiming
            const lastEntry = metrics[metrics.length - 1] as PerformanceResourceTiming;

            if (lastEntry) {
                sendToAnalytics(calculateNetworkDuration(lastEntry), eventCategory, eventLabel);
            }
        }
    }
};

const calculateNetworkDuration = (resouceTiming: PerformanceResourceTiming) => {
    const dns =
        resouceTiming.domainLookupEnd !== undefined && resouceTiming.domainLookupStart !== undefined
            ? resouceTiming.domainLookupEnd - resouceTiming.domainLookupStart
            : 0;

    const tcp =
        resouceTiming.connectEnd !== undefined && resouceTiming !== undefined
            ? resouceTiming.connectEnd - resouceTiming.connectStart
            : 0; // includes ssl negotiation

    const waiting =
        resouceTiming.responseStart !== undefined && resouceTiming.requestStart !== undefined
            ? resouceTiming.responseStart - resouceTiming.requestStart
            : 0;

    const content =
        resouceTiming.responseEnd !== undefined && resouceTiming.responseStart !== undefined
            ? resouceTiming.responseEnd - resouceTiming.responseStart
            : 0;

    return dns + tcp + waiting + content;
};

const sendToAnalytics = (duration: number, eventCategory: string, eventLabel: string) => {
    const trackingEvent = {
        event: "ajax-api-tracking-event",
        event_category: eventCategory,
        current_value: Math.round(duration),
        event_label: eventLabel,
    };
    adobeLaunch.pushEventToDataLayer(trackingEvent);
};
