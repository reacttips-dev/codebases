import type { AnalyticsOptions } from '../types/DatapointEnums';
import type { AriaDatapoint } from '../datapoints/AriaDatapoint';

export default function isQosDatapoint(
    analyticsOptions: AnalyticsOptions,
    datapoint: AriaDatapoint
): boolean {
    return (
        isQosDatapointInternal(analyticsOptions.qosDatapointNames, datapoint) ||
        isQosDatapointInternal(analyticsOptions.sampledQosDatapointNames, datapoint)
    );
}

export function isQosNonSampledDatapoint(
    analyticsOptions: AnalyticsOptions,
    datapoint: AriaDatapoint
): boolean {
    return isQosDatapointInternal(analyticsOptions.qosDatapointNames, datapoint);
}

function isQosDatapointInternal(names: string[] | undefined, datapoint: AriaDatapoint): boolean {
    return !!datapoint.eventName && !!names && names.indexOf(datapoint.eventName) > -1;
}
