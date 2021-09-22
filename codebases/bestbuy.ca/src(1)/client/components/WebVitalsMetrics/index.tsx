import * as React from "react";
import {getCLS, getFID, getLCP, getFCP, getTTFB, Metric} from "web-vitals";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";

const sendToAnalytics = (metric: Metric) => {
    const trackingEvent = {
        event: "web-vitals-tracking-event",
        event_category: "web-vitals-" + metric.name,
        current_value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
        is_final: metric.isFinal,
        delta: Math.round(metric.name === "CLS" ? metric.delta * 1000 : metric.delta),
        event_label: metric.id,
        non_interaction: true,
    };

    adobeLaunch.pushEventToDataLayer(trackingEvent);
};

export const WebVitalsMetrics = () => {
    React.useEffect(() => {
        const isTrackingAtEveryChanges = true;
        getFCP(sendToAnalytics);
        getCLS(sendToAnalytics, isTrackingAtEveryChanges);
        getLCP(sendToAnalytics, isTrackingAtEveryChanges);
        getFID(sendToAnalytics);
        getTTFB(sendToAnalytics);
    }, []);

    return null;
};

export default WebVitalsMetrics;
