import {
    AriaDatapoint,
    VerbosePerfEventType,
    isEventQueryStringEnabled,
} from '../datapoints/AriaDatapoint';
import { AnalyticsOptions, DataPointEventType } from '../types/DatapointEnums';
import { isFeatureEnabled, getFeatureFlag } from 'owa-feature-flags';
import { getLogicalRing } from 'owa-config';
import getFlightControl from './getFlightControl';
import { isCurrentSessionInSample } from './getSessionSampleBucket';
import { DatapointVariant } from 'owa-analytics-types';
import { getApplicationSettings } from 'owa-application-settings';

let errorsInSession = 0;

export default function shouldLogDatapoint(
    datapoint: AriaDatapoint,
    analyticsOptions: AnalyticsOptions,
    eventType: string
): boolean {
    // if we enable with a query string parameter, we should always allow this datapoint to get logged
    if (isEventQueryStringEnabled(eventType)) {
        return true;
    }

    const disabledDatapoints = isFeatureEnabled('fwk-application-settings')
        ? getApplicationSettings('Analytics').disabledDatapoints || []
        : [];

    if (disabledDatapoints.includes(datapoint.eventName)) {
        return false;
    }

    // don't log client_verbose datapoints if there is no whitelist or the datapoint is not on the whitelist
    if (
        datapoint.eventName &&
        eventType == VerbosePerfEventType &&
        (!analyticsOptions.verboseWhiteListEvents ||
            analyticsOptions.verboseWhiteListEvents.indexOf(datapoint.eventName) == -1)
    ) {
        return false;
    }

    if (eventType == DataPointEventType.ClientError) {
        errorsInSession++;
        if (
            analyticsOptions.maxErrorsPerSession &&
            errorsInSession > analyticsOptions.maxErrorsPerSession
        ) {
            return false;
        }
    }

    let control = getFlightControl(datapoint, analyticsOptions, eventType);
    if (control && !getFeatureFlag(control.flight)) {
        return false;
    }

    // if logEvery is set to 5, then we should log every 5th of these datapoints
    if (datapoint.options?.logEvery) {
        if (
            datapoint.sessionOccurence &&
            (datapoint.sessionOccurence - 1) % datapoint.options.logEvery != 0
        ) {
            return false;
        }
    }

    if (datapoint.options?.ring && datapoint.options.ring != getLogicalRing()) {
        return false;
    }

    return getIsSessionSampled(datapoint) && getDoesVariantApply(datapoint);
}

function getIsSessionSampled(datapoint: AriaDatapoint) {
    return (
        !datapoint.options ||
        !datapoint.options.sessionSampleRate ||
        isCurrentSessionInSample(datapoint.options.sessionSampleRate)
    );
}

function getDoesVariantApply(datapoint: AriaDatapoint) {
    switch (datapoint.options?.variant) {
        case DatapointVariant.None:
            return false;
        case DatapointVariant.WarmOnly:
            return datapoint.sessionOccurence == 1;
        case DatapointVariant.ColdOnly:
            return !!datapoint.sessionOccurence && datapoint.sessionOccurence > 1;
        default:
            return true;
    }
}
