import { AnalyticsOptions, DataPointEventType } from './types/DatapointEnums';
import type { InternalAnalyticOptions } from './types/InternalAnalyticOptions';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getBootType, scrubForPii, getOpxHostData } from 'owa-config';
import calculateTiming from './utils/calculateTiming';
import captureAssetsOptics from './captureAssetsOptics';
import { setErrorHandler } from 'owa-exception-handler';
import { registerCreateServiceResponseCallback as registerOwsCreateServiceResponseCallback } from 'owa-service/lib/fetchWithRetry';
import { registerCreateServiceResponseCallback as registerOwsPrimeCreateServiceResponseCallback } from 'owa-ows-gateway/lib/registerCreateServiceResponseCallback';
import { getNonBootUserConfiguration } from 'owa-nonboot-userconfiguration-manager';
import captureServiceActionOptics from './captureServiceActionOptics';
import { logSessionDatapoint } from './utils/logSessionDatapoint';
import TraceDatapoint from './datapoints/TraceDatapoint';
import { getCachedInfo } from 'owa-analytics-start';
import type { CustomDataMap, CustomDataType } from 'owa-analytics-types';
import ErrorDatapoint from './datapoints/ErrorDatapoint';
import { TraceErrorObject, registerTracerListener, TraceLevel, onGlobalError } from 'owa-trace';
import UsageDatapoint from './datapoints/UsageDatapoint';
import { isTracingEnabled } from './utils/isTracingEnabled';
import { trackUserCentricMetrics } from './metrics';
import logDatapoint from './logDatapoint';
import { categorizeError } from 'owa-errors/lib/categorizeError';
import { isExternalError } from 'owa-errors/lib/isExternalError';
import { isOneOf } from 'owa-errors/lib/isOneOf';
import { isDocumentVisible } from './utils/visibilityState';
import { oneDSFlush } from './OneDsWrapper';
import { logUsage } from './api/logUsage';

let resolveInitalizeAnalytics: (options: InternalAnalyticOptions) => void;
//tslint:disable:promise-must-complete
let initializeAnalyticsPromise: Promise<InternalAnalyticOptions> = new Promise(resolve => {
    resolveInitalizeAnalytics = resolve;
});

export function getInitializeAnalyticsPromise() {
    return initializeAnalyticsPromise;
}

export let defaultAnalyticsOptions: AnalyticsOptions = {
    ariaTenantTokens: [],
    isTesting: false,
    maxErrorsPerSession: 100,
    flightControls: undefined,
    verboseWhiteListEvents: [],
};

//tslint:enable:promise-must-complete
export async function initializeAnalytics(analyticsOptions: AnalyticsOptions) {
    // if no aria tokens are passed in, there is no point
    if (analyticsOptions?.ariaTenantTokens && analyticsOptions.ariaTenantTokens.length > 0) {
        analyticsOptions = { ...defaultAnalyticsOptions, ...analyticsOptions };

        if (isFeatureEnabled('ring-dogfood') || isFeatureEnabled('an-no-sample-ppe')) {
            delete analyticsOptions.flightControls;
        }

        try {
            let nonBootSettings = await getNonBootUserConfiguration();
            (<InternalAnalyticOptions>analyticsOptions).isEdu = nonBootSettings?.IsEdu;
            const lazyOpxSessionInfo = getOpxHostData();
            if (lazyOpxSessionInfo) {
                (<InternalAnalyticOptions>(
                    analyticsOptions
                )).opxSessionInfo = await lazyOpxSessionInfo;
            }
        } catch {
            // no op
        }

        resolveInitalizeAnalytics(analyticsOptions);

        let bootType;
        try {
            bootType = await getBootType();
        } catch {
            // no op
        } finally {
            analyticsOptions.ariaTenantTokens.forEach(token => {
                logSessionDatapoint(<InternalAnalyticOptions>analyticsOptions, token, bootType);
            });
        }

        // the errors are backfilled since the begininning of the app. So we can set the error handler here
        // since this is the first time that we can log the errors
        setErrorHandler(onGlobalError);
        if (window.performance?.timing) {
            const timing = calculateTiming(window.performance.timing, 'indexPage');
            if (timing) {
                captureAssetsOptics([timing]);
            }
        }
        const info = getCachedInfo(logUsage);
        info.errors.forEach(cachedError =>
            logErrorDatapoint(cachedError.message, cachedError.error)
        );
        info.network.forEach(networkArgs => captureServiceActionOptics.apply(null, networkArgs));
        info.traces.forEach(traceArgs => logTraceDatapoint(traceArgs.message, traceArgs.level));
        info.usage.forEach(usage => logUsage(usage.name));
        registerTracerListener((message, traceLevel, errorDetails) => {
            if (traceLevel == TraceLevel.Error) {
                logErrorDatapoint(message, errorDetails);
            }
            logTraceDatapoint(message, traceLevel);
        });
        registerOwsCreateServiceResponseCallback(captureServiceActionOptics);
        registerOwsPrimeCreateServiceResponseCallback(captureServiceActionOptics);
        if (isFeatureEnabled('an-log-usermetrics')) {
            trackUserCentricMetrics();
        }

        window.addEventListener('beforeunload', () => {
            oneDSFlush();
        });
    }
}

function logTraceDatapoint(message: string, level: TraceLevel) {
    if (isTracingEnabled(level)) {
        logDatapoint(new TraceDatapoint(message, level), DataPointEventType.ClientTrace);
    }
}

const errorsToIgnore = ['ResizeObserver loop limit exceeded'];

function logErrorDatapoint(message: string, errorDetails: TraceErrorObject | undefined) {
    try {
        if (isOneOf(errorsToIgnore, message)) {
            return;
        }

        const category = categorizeError(message, errorDetails);
        const datapointName = category && `${category}_ERROR`;
        const customData: CustomDataMap = {};
        addToCustomData(customData, 'message', message);

        addToCustomData(customData, 'background', isDocumentVisible());
        if (errorDetails) {
            addToCustomData(customData, 'name', errorDetails.name);
            addToCustomData(customData, 'file', errorDetails.filename);
            addToCustomData(customData, 'line', errorDetails.lineno);
            addToCustomData(customData, 'col', errorDetails.colno);
            addToCustomData(customData, 'httpstatus', errorDetails.httpStatus);
            addToCustomData(customData, 'stack', errorDetails.stack);
        } else {
            addToCustomData(customData, 'stack', new Error(message).stack);
        }

        if (datapointName) {
            logDatapoint(new UsageDatapoint(datapointName, customData));
        } else {
            let eventType: string = isExternalError(message, errorDetails)
                ? DataPointEventType.ClientErrorExternal
                : DataPointEventType.ClientError;
            if (errorDetails?.response) {
                customData.status = errorDetails.response.status;
            }
            if (errorDetails?.fetchErrorType) {
                customData.fet = errorDetails.fetchErrorType;
            }
            logDatapoint(new ErrorDatapoint(message, errorDetails, customData), eventType);
        }
    } catch {
        // TODO OW 48077
    }
}

function addToCustomData(customData: CustomDataMap, key: string, value: CustomDataType) {
    const valueType = typeof value;
    if (valueType != 'undefined') {
        customData[key] = valueType == 'string' ? scrubForPii(<string>value) : value;
    }
}
