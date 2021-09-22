import { DatapointStatus, logUsage, PerformanceDatapoint } from 'owa-analytics';
import {
    getFileProviderAuthHeaderValue,
    BEARER_TOKEN_HEADER_PREFIX,
} from 'owa-fileprovider-accesstoken-service';
import { getGuid } from 'owa-guid';
import { isSuccessStatusCode } from 'owa-http-status-codes';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import fetchDataProviderResourceRequest from 'owa-service/lib/factory/fetchDataProviderResourceRequest';
import fetchDataProviderResourceOperation from 'owa-service/lib/operation/fetchDataProviderResourceOperation';
import { isFeatureEnabled } from 'owa-feature-flags';
import { trace } from 'owa-trace';
import { lazyRemediateAuth } from 'owa-auth-redemption';
import { POST_METHOD_NAME } from '../utils/constants';

export interface FetchRequestOptions {
    method: string;
    mode: RequestMode;
    body?: string;
    datapointNamePrefix: string;
}

export async function fetchService(
    dataProviderType: AttachmentDataProviderType,
    requestUrl: string,
    linkUrl: string,
    options: FetchRequestOptions,
    additionalHeaders: object | null,
    shouldSkipRemediateAuth: boolean = false
): Promise<string> {
    let token: string;
    try {
        token = await getFileProviderAuthHeaderValue(dataProviderType, false, linkUrl);
    } catch (error) {}

    if (
        isFeatureEnabled('doc-authContext') &&
        dataProviderType === AttachmentDataProviderType.OneDrivePro
    ) {
        if (additionalHeaders) {
            additionalHeaders['x-ms-cc'] = 't';
        } else {
            additionalHeaders = { 'x-ms-cc': 't' };
        }
    }

    if (token && token.split(BEARER_TOKEN_HEADER_PREFIX)[1]) {
        logUsage('fetchServiceViaDataProvider', [dataProviderType]);
        trace.info('fetchServiceViaDataProvider');
        return fetchServiceViaDataProvider(
            dataProviderType,
            requestUrl,
            linkUrl,
            token,
            options,
            shouldSkipRemediateAuth /* shouldSkipRemediateAuth */,
            additionalHeaders
        );
    } else {
        logUsage('fetchServiceFailedToGetToken', [dataProviderType]);
    }

    // Because of the security policies with different organizations, it's not allowed to send ODB client token to those users.
    // Then we will fallback to server call to utilize server auth.
    if (dataProviderType === AttachmentDataProviderType.OneDrivePro) {
        logUsage('fetchServiceViaOWAServer');
        trace.info('fetchServiceViaOWAServer');
        return fetchServiceViaOWAServer(dataProviderType, requestUrl, options, additionalHeaders);
    }

    throw new Error('Fetch service has failed to retrieve client token.');
}

export async function fetchServiceViaDataProvider(
    dataProviderType: AttachmentDataProviderType,
    requestUrl: string,
    linkUrl: string,
    token: string,
    options: FetchRequestOptions,
    shouldSkipRemediateAuth: boolean,
    additionalHeaders?: object
): Promise<string | null> {
    const datapointName = options.datapointNamePrefix + 'DataProvider';
    const datapoint: PerformanceDatapoint = new PerformanceDatapoint(datapointName);
    datapoint.addCustomData({ dataProviderType: dataProviderType });
    let requestHeaders = {
        Authorization: token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };

    if (additionalHeaders) {
        const keys = Object.keys(additionalHeaders);
        keys.forEach(key => {
            requestHeaders[key] = additionalHeaders[key];
        });
    }

    if (
        isFeatureEnabled('doc-oneDrive-correlationId') &&
        (dataProviderType === AttachmentDataProviderType.OneDrivePro ||
            dataProviderType === AttachmentDataProviderType.OneDriveConsumer)
    ) {
        const guid: string = getGuid();
        requestHeaders['X-TransactionId'] = guid;
        datapoint.addCustomData({ TransactionId: guid });
        if (dataProviderType === AttachmentDataProviderType.OneDrivePro) {
            requestHeaders['SPResponseGuid'] = guid;
        }
    }

    const response: Response = await fetch(requestUrl, {
        method: options.method,
        mode: options.mode,
        headers: requestHeaders,
        body: options.body,
    });

    if (isSuccessStatusCode(response.status)) {
        datapoint.end();
        const responseJson = await response.json();
        return JSON.stringify(responseJson);
    } else {
        const error = new Error(
            `${datapointName} : Response status = ${response.status}, body = ${response.body}`
        );

        datapoint.endWithError(DatapointStatus.ServerError, error);
        let errorObj = {
            datapointName: datapointName,
            responseStatus: response.status,
            responseBody: response.body,
            headers: response.headers,
            claims: null,
        };

        if (
            isFeatureEnabled('doc-authContext') &&
            dataProviderType === AttachmentDataProviderType.OneDrivePro &&
            !shouldSkipRemediateAuth
        ) {
            const authenticateHeader: string = response.headers.get('www-authenticate');

            if (!!authenticateHeader) {
                let claims: string;
                try {
                    const remediateAuth = await lazyRemediateAuth.import();
                    claims = await remediateAuth(authenticateHeader);
                } catch (e) {
                    throw JSON.stringify(errorObj);
                }

                try {
                    token = await getFileProviderAuthHeaderValue(
                        dataProviderType,
                        true,
                        linkUrl,
                        claims
                    );
                } catch (error) {}

                return fetchServiceViaDataProvider(
                    dataProviderType,
                    requestUrl,
                    linkUrl,
                    token,
                    options,
                    true /* shouldSkipRemediateAuth */,
                    additionalHeaders
                );
            }
        }

        throw JSON.stringify(errorObj);
    }
}

export async function fetchServiceViaOWAServer(
    dataProviderType: AttachmentDataProviderType,
    requestUrl: string,
    options: FetchRequestOptions,
    additionalHeaders?: object
): Promise<string | null> {
    const datapointName = options.datapointNamePrefix + 'OWA';
    const datapoint: PerformanceDatapoint = new PerformanceDatapoint(datapointName);

    const fetchRequest = fetchDataProviderResourceRequest({
        ProviderType: dataProviderType,
        Url: requestUrl,
        Method: options.method,
        Body: options.body ? options.body : JSON.stringify({}), // When getting response via OWA server, if body is not required, we should pass JSON stringified value: "{}" instead of null
        Headers: JSON.stringify(additionalHeaders),
        IsJsonPost: options.method === POST_METHOD_NAME,
    });

    const response = await fetchDataProviderResourceOperation(fetchRequest);
    if (isSuccessStatusCode(response.Status)) {
        datapoint.end();
        return response.Body;
    }

    const error = new Error(
        `${datapointName} : Response status = ${response.Status}, ServerTraceLog = ${response.ServerTraceLog}`
    );
    datapoint.endWithError(DatapointStatus.ServerError, error);
    const errorObj = {
        datapointName: datapointName,
        responseStatus: response.Status,
        responseServerTraceLog: response.ServerTraceLog,
    };
    throw JSON.stringify(errorObj);
}
