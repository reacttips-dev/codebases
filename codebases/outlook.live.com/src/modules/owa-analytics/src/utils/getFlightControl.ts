import type { AriaDatapoint } from '../datapoints/AriaDatapoint';
import type { AnalyticsOptions, FlightControl } from '../types/DatapointEnums';
import { isQosNonSampledDatapoint } from '../utils/isQosDatapoint';

export default function getFlightControl(
    datapoint: AriaDatapoint,
    analyticsOptions: AnalyticsOptions,
    eventType: string
): FlightControl | null {
    // do not sample datapoints if marked as isCore
    if (datapoint.options?.isCore || isQosNonSampledDatapoint(analyticsOptions, datapoint)) {
        return null;
    }

    // Application that do not initialize analytics, such as Storybook, have an undefined appAnalyticsOptions
    if (analyticsOptions?.flightControls) {
        return analyticsOptions.flightControls[eventType];
    }
    return null;
}
