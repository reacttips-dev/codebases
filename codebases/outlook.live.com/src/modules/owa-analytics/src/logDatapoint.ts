import { AriaDatapoint, VerbosePerfEventType } from './datapoints/AriaDatapoint';
import { getInitializeAnalyticsPromise } from './initializeAnalytics';
import optionallyTraceDatapoint from './utils/optionallyTraceDatapoint';
import { validatePropertyBag } from './utils/validatePropertyBag';
import isDevEnvironment from './utils/isDevEnvironment';
import getFlightControl from './utils/getFlightControl';
import shouldLogDatapoint from './utils/shouldLogDatapoint';
import { isFeatureEnabled } from 'owa-feature-flags';
import { createEvent, logOneDSDatapoint } from './OneDsWrapper';
import { DataPointEventType, GenericKeys } from './types/DatapointEnums';
import { getThroughEdge, getDag, getServerVersion } from 'owa-config';
import isQosDatapoint from './utils/isQosDatapoint';
import type { InternalAnalyticOptions } from './types/InternalAnalyticOptions';
import { ValueKind, IEventProperty } from '@microsoft/1ds-analytics-js';

export default function logDatapoint(datapoint: AriaDatapoint, overrideEventType?: string): void {
    getInitializeAnalyticsPromise().then(analyticsOptions => {
        let isFullVerboseLoggingEnabled = isFeatureEnabled('an-full-logging');
        let eventType: string = getEventType(datapoint, overrideEventType);
        let flightControl = getFlightControl(datapoint, analyticsOptions, eventType);
        if (
            !shouldLogDatapoint(datapoint, analyticsOptions, eventType) &&
            !isFullVerboseLoggingEnabled
        ) {
            return;
        }

        datapoint.properties.EventType = 'standard';
        if (isQosDatapoint(analyticsOptions, datapoint)) {
            datapoint.properties.EventType = 'qos';
            datapoint.properties.ThroughAFD = getThroughEdge();
            datapoint.properties.ServiceVersion = getServerVersion();
            datapoint.properties.Dag = getDag();
        }

        if (isFullVerboseLoggingEnabled) {
            datapoint.properties['OriginalEvent'] = eventType;
        }

        const keys = Object.keys(datapoint.properties);
        for (let ii = 0; ii < keys.length; ii++) {
            datapoint.properties[keys[ii]] = datapoint.properties[keys[ii]];
        }

        datapoint.properties['Sampled'] = flightControl?.rate ? flightControl.rate : 100;

        if (datapoint.propertyBag) {
            datapoint.properties['MiscData'] = validatePropertyBag(datapoint);
        }

        optionallyTraceDatapoint(datapoint);

        // let's not actually log datapoints if we are gulping or in a branch or a tds box
        // unless the datapoint is explicitly whitelisted
        if (
            !isDevEnvironment(analyticsOptions) ||
            eventType == DataPointEventType.ClientEventDevOnly
        ) {
            const tokens = datapoint.options?.tenantTokens
                ? datapoint.options.tenantTokens
                : analyticsOptions.ariaTenantTokens;

            tokens.forEach(token => logEvent(token, datapoint, eventType, analyticsOptions));
        }
    });
}

function logEvent(
    tenantToken: string,
    datapoint: AriaDatapoint,
    eventType: string,
    analyticsOptions: InternalAnalyticOptions
) {
    const e = createEvent(
        isFeatureEnabled('an-full-logging') ? VerbosePerfEventType : eventType,
        datapoint.properties
    );

    if (datapoint.properties[GenericKeys.e2eTimeElapsed]) {
        e.latency = <number>datapoint.properties[GenericKeys.e2eTimeElapsed];
    }
    if (e.data) {
        if (datapoint.piiData) {
            e.data['PiiData'] = <IEventProperty>{
                value: datapoint.piiData,
                kind: ValueKind.Pii_Identity,
            };
        }
    }

    logOneDSDatapoint({ tenantToken, item: e, analyticsOptions });
}

function getEventType(datapoint: AriaDatapoint, overrideEventType: string | undefined): string {
    if (overrideEventType) {
        return overrideEventType;
    }

    if (datapoint.options) {
        if (datapoint.options.isVerbose) {
            return DataPointEventType.ClientVerbose;
        }

        if (datapoint.options.excludeFromKusto) {
            return DataPointEventType.ClientCosmos;
        }
    }

    return DataPointEventType.ClientEvent;
}
