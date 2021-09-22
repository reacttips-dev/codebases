import {captureApiPerformanceMetrics} from "utils/analytics/performanceInstrumentation";

export const productRelationshipApiInstrumentation = (resourceUrl: string, eventLabel: string) => {
    const browserDelayToMakeMetricsAvailable = 1000;
    setTimeout(() => {
        captureApiPerformanceMetrics(resourceUrl, "ajax-api-relationship-variants", eventLabel);
    }, browserDelayToMakeMetricsAvailable);
};
