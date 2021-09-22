import logDatapoint from './logDatapoint';
import { ServiceActionDatapoint } from './datapoints/ServiceActionDatapoint';
import getResourceTimingForUrl from './utils/getResourceTimingForUrl';
import type { BaseRequestOptions } from 'owa-analytics-types/lib/types/BaseRequestOptions';
import { DataPointEventType } from './types/DatapointEnums';
import sleep from 'owa-sleep';

export default function captureServiceActionOptics(
    responsePromise: Promise<Response>,
    actionName: string,
    url: string,
    attemptCount: number,
    optionsPromise: Promise<BaseRequestOptions>
) {
    let datapoint = new ServiceActionDatapoint(actionName, attemptCount);
    return Promise.all([optionsPromise, responsePromise])
        .then(([options, response]) => {
            datapoint.addResponseDiagnostics(response, options);
            if (options?.datapoint) {
                if (options.datapoint.headersCustomData && response) {
                    datapoint.addCustomData(options.datapoint.headersCustomData(response.headers));
                }
                if (options.datapoint.jsonCustomData) {
                    return response
                        .clone()
                        .json()
                        .then(json => {
                            if (options?.datapoint?.jsonCustomData) {
                                datapoint.addCustomData(options.datapoint.jsonCustomData(json));
                            }
                        });
                }
            }

            const isUserIdentitySet = options?.datapoint?.mailbox != undefined;
            datapoint.addCustomData({ isUserIdentitySet: isUserIdentitySet });

            return Promise.resolve();
        })
        .catch(error => {
            datapoint.addErrorDiagnostics(error);
        })
        .then(() => {
            return Promise.race([sleep(3000), getResourceTimingForUrl(url)]);
        })
        .then(timing => {
            if (timing) {
                datapoint.addResourceTimings('ServiceAction', timing);
            }
            logDatapoint(datapoint, DataPointEventType.ClientNetworkRequest);
        });
}
