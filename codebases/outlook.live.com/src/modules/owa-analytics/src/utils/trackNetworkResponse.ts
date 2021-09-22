import { isClientVerboseQueryStringEnabled } from '../datapoints/AriaDatapoint';
import { trace } from 'owa-trace';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import type { PerformanceDatapoint } from '../datapoints/PerformanceDatapoint';

export function trackNetworkResponse(
    datapoint: PerformanceDatapoint,
    responsePromise: Promise<Response>,
    action: string,
    optionsPromise: Promise<RequestOptions>
) {
    datapoint.addCheckpoint(action + '_sr_s');
    Promise.all([optionsPromise, responsePromise]).then(
        ([options, response]) => {
            collectResponseDiagnostics(datapoint, action, options, response);
        },
        () => {
            collectResponseDiagnostics(datapoint, action);
        }
    );
}

function collectResponseDiagnostics(
    datapoint: PerformanceDatapoint,
    action: string,
    options?: RequestOptions,
    response?: Response
) {
    if (datapoint.hasEnded) {
        trace.warn(
            `Service Request:${action} was not captured in your datapoint({${datapoint.eventName}})`
        );
        return;
    }

    datapoint.madeNetworkRequest = true;
    datapoint.addCheckpoint(action + '_sr_e');

    if (response?.headers) {
        const requestId = response.headers.get('request-id');
        if (requestId) {
            datapoint.allRequestIds.push(requestId);
        }

        if (isClientVerboseQueryStringEnabled()) {
            datapoint.addCustomProperty(action + '_status', response.status);
            if (response.status !== 200) {
                datapoint.addCustomProperty(action + '_AFD', response.headers.get('x-msedge-ref'));
            }
        }
    }
    if (options?.headers) {
        const cv = options.headers.get('ms-cv');
        if (cv) {
            datapoint.responseCorrelationVectors.push(cv);
        }
    }
}
