import { isFeatureEnabled } from 'owa-feature-flags';
import { isSuccessStatusCode } from 'owa-http-status-codes';
import { getQueryStringParameter, hasQueryStringParameter } from 'owa-querystring';
import {
    getOrigin,
    getUrlWithAddedQueryParameters,
    getExplicitPath,
    joinPath,
    ensureLeadingSlash,
    getRootVdirName,
} from 'owa-url';
import { getAnchorMailbox } from './anchormailbox';
import { getOwaCanaryCookie } from 'owa-service/lib/canary';
import getRequestNumber from 'owa-service/lib/getRequestNumber';
import throttledFetch from 'owa-service/lib/throttledFetch';
import { getAccessTokenforResourceAsLazy } from 'owa-tokenprovider';
import * as trace from 'owa-trace';
import {
    getCorrelationVector,
    correlationVectorHeaderName,
} from 'owa-service/lib/correlationVector';
import type { InternalRequestOptions } from 'owa-service/lib/RequestOptions';
import type { RequestDatapointOptions } from 'owa-analytics-types/lib/types/BaseRequestOptions';
import type { OwsRequestOptions } from './OwsRequestOptions';
import { callResponseCallbacks } from './registerCreateServiceResponseCallback';
import { owsServerParam, owsApiParam, HttpMethod } from './constants';
import { getSessionId } from 'owa-config';
import { addImmutableIdPreference } from 'owa-service/lib/addImmutableIdPreference';

const MAX_HTTP_HEADER_LENGTH = 2048;
var owsServerParamOverrideAllowed: boolean | null = null;

export function makeRequest(
    requestUrl: string,
    requestMethod: HttpMethod,
    options: OwsRequestOptions,
    actionName?: string
): Promise<any | Response>;
export function makeRequest(
    requestUrl: string,
    requestMethod: HttpMethod,
    returnFullResponse?: boolean,
    actionName?: string,
    correlationId?: string,
    requestObject?: any,
    customHeaders?: { [header: string]: any },
    throwServiceError?: boolean,
    includeCredentials?: boolean
): Promise<any | Response>;
export function makeRequest(
    requestUrl: string,
    requestMethod: HttpMethod,
    optionsOrReturnFullResponse?: boolean | OwsRequestOptions,
    actionName?: string,
    correlationId?: string,
    requestObject?: any,
    customHeaders?: { [header: string]: any },
    throwServiceError?: boolean,
    includeCredentials?: boolean
): Promise<any | Response> {
    // Create the custom headers with lower case headers as we should be
    // case insensitive when checking if header exists
    const customHeadersToUse =
        (typeof optionsOrReturnFullResponse === 'object' &&
            optionsOrReturnFullResponse.customHeaders) ||
        customHeaders;
    const lowerCasedCustomHeaders = customHeadersToUse
        ? Object.keys(customHeadersToUse).reduce<{ [header: string]: any }>(
              (lowerCaseHeaders, headerName) => {
                  lowerCaseHeaders[headerName.toLowerCase()] = customHeadersToUse[headerName];
                  return lowerCaseHeaders;
              },
              {}
          )
        : undefined;

    let options =
        typeof optionsOrReturnFullResponse === 'object'
            ? { ...optionsOrReturnFullResponse, customHeaders: lowerCasedCustomHeaders }
            : {
                  returnFullResponse: optionsOrReturnFullResponse,
                  correlationId,
                  requestObject,
                  customHeaders: lowerCasedCustomHeaders,
                  throwServiceError,
                  includeCredentials,
              };
    const AuthorizationHeader = 'authorization';

    if (!options.customHeaders || !options.customHeaders[AuthorizationHeader]) {
        if (options.includeCredentials === undefined) {
            options.includeCredentials = !isFeatureEnabled('auth-authzHeaderNoCookies');
        }
        let resourceUrl = getOrigin();
        let [token, tokenPromise] = getAccessTokenforResourceAsLazy(resourceUrl, 'OwsGateway');

        // If token is not returned synchronously, we need to await on the tokenPromise
        if (token) {
            return makeRequestInternal(
                requestUrl,
                requestMethod,
                options,
                actionName,
                token as string
            );
        }

        return tokenPromise.then(t =>
            makeRequestInternal(requestUrl, requestMethod, options, actionName, t as string)
        );
    }

    return makeRequestInternal(requestUrl, requestMethod, options, actionName);
}

function makeRequestInternal(
    requestUrl: string,
    requestMethod: HttpMethod,
    options: OwsRequestOptions,
    actionName: string,
    accessToken?: string
): Promise<JSON | Response> {
    const {
        returnFullResponse,
        correlationId,
        requestObject,
        customHeaders,
        throwServiceError,
        sendPayloadAsBody,
        includeCredentials,
    } = options;
    let headers = new Headers();
    headers.append('X-OWA-CANARY', getOwaCanaryCookie());
    headers.append('X-MS-AppName', 'owa-react' + getRootVdirName());
    headers.set('X-OWA-SessionId', getSessionId());

    const additionalQueryStringParams: { [key: string]: string } = {
        n: getRequestNumber().toString(),
    };
    if (correlationId) {
        headers.append('client-request-id', correlationId);
        additionalQueryStringParams.cri = correlationId;
    }

    if (customHeaders) {
        Object.keys(customHeaders).forEach(k => {
            headers.append(k, customHeaders[k]);
        });
    }

    const cv = getCorrelationVector();
    // the cv can be falsy if it gets corrupted, in that case there is no point in sending it
    if (cv) {
        headers.append(correlationVectorHeaderName, cv);
        additionalQueryStringParams.cv = cv;
    }

    if (accessToken) {
        const headerName = 'Authorization';

        if (accessToken.length > 0 && accessToken?.split(' ')[0]?.toLowerCase() === 'msauth1.0') {
            headers.append(headerName, accessToken);
        } else {
            if (isFeatureEnabled('fwk-devTools')) {
                var parts = accessToken.split('.');
                if (parts.length != 3 || parts[2].length === 0) {
                    // this can be a signed of an unsigned token flowing through
                    trace.errorThatWillCauseAlert(`BearerTokenIncomplete ${parts.length}`);
                }
            }
            headers.append(headerName, `Bearer  ${accessToken}`);
        }
    }

    const AnchorMailboxHeader = 'x-anchormailbox';
    if (!customHeaders || !customHeaders[AnchorMailboxHeader]) {
        let anchorMailbox = getAnchorMailbox();

        if (anchorMailbox && anchorMailbox.length > 0) {
            headers.append('X-AnchorMailbox', anchorMailbox);
        }
    }

    let requestOptions: InternalRequestOptions = {
        method: requestMethod,
        credentials: includeCredentials !== false ? 'same-origin' : 'omit',
        body: options.requestBody,
        headers,
    };

    if (requestObject) {
        headers.append('Content-Type', 'application/json');
        const requestBody = JSON.stringify(requestObject);

        // The empty post request only works when the request is to OWS or OWA.
        // Match ows/ or owa/ to avoid something like "search/api/v1/events?scenario=owa.react"
        const isOwsOrOwaRequest = requestUrl.search(/ows\/|owa\//i) >= 0;

        if (
            isFeatureEnabled('fwk-emptyPost') &&
            isOwsOrOwaRequest &&
            requestMethod == 'POST' &&
            !sendPayloadAsBody
        ) {
            const uriEncodedRequestBody = encodeURIComponent(requestBody);

            // send request body as a header when possible -- this causes
            // significant performance gains
            if (uriEncodedRequestBody.length < MAX_HTTP_HEADER_LENGTH) {
                headers.append('X-OWA-UrlPostData', uriEncodedRequestBody);
            } else {
                requestOptions.body = requestBody;
            }
        } else {
            requestOptions.body = requestBody;
        }
    }

    if (!options.doNotAddImmutableIdHeader) {
        addImmutableIdPreference(headers);
    }

    const url = getFetchUrl(requestUrl, additionalQueryStringParams);
    const promise = throttledFetch(url, requestOptions);

    callResponseCallbacks(requestOptions, options, promise, actionName, url);

    return promise
        .then(response => {
            if (returnFullResponse) {
                return response;
            }
            if (isSuccessStatusCode(response.status)) {
                return response.text().then(text => (text ? JSON.parse(text) : {}));
            } else {
                throw new Error(
                    `${requestMethod} request to ${requestUrl} failed, http error:${response.status}`
                );
            }
        })
        .catch(error => {
            trace.trace.warn(error);
            if (throwServiceError) {
                const primeError = {
                    stack: error.stack,
                    message: error.message,
                    correlationVector: cv,
                    correlationId: options.correlationId,
                    networkError: true,
                } as trace.TraceErrorObject;
                throw primeError;
            } else {
                return [];
            }
        });
}

function getFetchUrl(requestUrl: string, additionalParams: { [key: string]: string }): string {
    // For Local OWS Prime testing, this way developer can test their OWS changes with react gulp
    var gatewayUrl = isFeatureEnabled('fwk-proxyOwsPrime') ? '/OutlookGateway/' : '/';
    var modifiedRequestUrl = getExplicitUrl(gatewayUrl, requestUrl);
    var fetchUrl = getOrigin() + modifiedRequestUrl;

    if (
        isFeatureEnabled('fwk-devTools') &&
        hasQueryStringParameter(owsServerParam) &&
        (getQueryStringParameter(owsApiParam) == requestUrl ||
            !hasQueryStringParameter(owsApiParam))
    ) {
        if (owsServerParamOverrideAllowed == null) {
            owsServerParamOverrideAllowed = confirm(
                `A query param '${owsServerParam}' is set to redirect some of calls to '${getQueryStringParameter(
                    owsServerParam
                )}'.

Those calls contain PII. If this is not intentional, click 'Cancel' below or remove the queryparam and reload the page.`
            );
        }

        if (owsServerParamOverrideAllowed) {
            var requestUrlSegments = requestUrl.split('/');
            if (requestUrlSegments.length > 0 && requestUrlSegments.shift() == 'ows') {
                requestUrl = requestUrlSegments.join('/');
            }

            fetchUrl = getQueryStringParameter(owsServerParam) + '/' + requestUrl;
        }
    }

    return getUrlWithAddedQueryParameters(fetchUrl, additionalParams);
}

function getExplicitUrl(gatewayUrl: string, requestUrl: string) {
    /* Get url taking into account explicit logon */
    var modifiedRequestUrl = joinPath(gatewayUrl, requestUrl);
    var modifiedRequestUrlSegments = modifiedRequestUrl.split('/');

    if (
        modifiedRequestUrlSegments.length > 0 &&
        (modifiedRequestUrlSegments[0] == 'ows' ||
            modifiedRequestUrlSegments[0] == 'OutlookGateway')
    ) {
        modifiedRequestUrlSegments[0] = getExplicitPath(modifiedRequestUrlSegments[0]);
        modifiedRequestUrl = modifiedRequestUrlSegments.join('/');
    }

    return ensureLeadingSlash(modifiedRequestUrl);
}

export function makeGraphRequest(requestUrl: string, requestBody: string) {
    return makeRequest(requestUrl, 'POST', {
        requestBody,
        customHeaders: { 'Content-Type': 'application/json' },
    });
}

export function makePostRequest(
    requestUrl: string,
    requestObject: any,
    correlationId?: string,
    returnFullResponse?: boolean,
    customHeaders?: any,
    throwServiceError?: boolean,
    sendPayloadAsBody?: boolean,
    includeCredentials?: boolean,
    actionName?: string,
    datapoint?: RequestDatapointOptions,
    doNotAddImmutableIdHeader?: boolean
): Promise<any> {
    const options: OwsRequestOptions = {
        returnFullResponse: returnFullResponse,
        correlationId: correlationId,
        requestObject: requestObject,
        customHeaders: customHeaders,
        throwServiceError: throwServiceError,
        sendPayloadAsBody: sendPayloadAsBody,
        includeCredentials: includeCredentials,
        datapoint,
        doNotAddImmutableIdHeader,
    };

    return makeRequest(requestUrl, 'POST', options, actionName);
}

export function makePatchRequest(
    requestUrl: string,
    requestObject: any,
    correlationId?: string,
    returnFullResponse?: boolean,
    customHeaders?: any,
    throwServiceError?: boolean,
    includeCredentials?: boolean,
    actionName?: string
): Promise<any> {
    const options: OwsRequestOptions = {
        returnFullResponse: returnFullResponse,
        correlationId: correlationId,
        requestObject: requestObject,
        customHeaders: customHeaders,
        throwServiceError: throwServiceError,
        includeCredentials: includeCredentials,
    };

    return makeRequest(requestUrl, 'PATCH', options, actionName);
}

export function makePutRequest(
    requestUrl: string,
    requestObject: any,
    correlationId?: string,
    returnFullResponse?: boolean,
    customHeaders?: any,
    throwServiceError?: boolean,
    actionName?: string,
    includeCredentials?: boolean
): Promise<any> {
    return makeRequest(
        requestUrl,
        'PUT',
        returnFullResponse,
        actionName,
        correlationId,
        requestObject,
        customHeaders,
        throwServiceError,
        includeCredentials
    );
}

export function makeGetRequest(
    requestUrl: string,
    correlationId?: string,
    returnFullResponse?: boolean,
    customHeaders?: any,
    throwServiceError?: boolean,
    includeCredentials?: boolean,
    actionName?: string
): Promise<any> {
    return makeRequest(
        requestUrl,
        'GET',
        returnFullResponse,
        actionName,
        correlationId,
        undefined /* requestObject */,
        customHeaders,
        throwServiceError,
        includeCredentials
    );
}

export function makeDeleteRequest(
    requestUrl: string,
    requestObject?: any,
    correlationId?: string,
    returnFullResponse?: boolean,
    customHeaders?: any,
    throwServiceError?: boolean,
    includeCredentials?: boolean,
    actionName?: string
): Promise<any> {
    const options: OwsRequestOptions = {
        returnFullResponse: returnFullResponse,
        correlationId: correlationId,
        requestObject: requestObject,
        customHeaders: customHeaders,
        throwServiceError: throwServiceError,
        includeCredentials: includeCredentials,
    };

    return makeRequest(requestUrl, 'DELETE', options, actionName);
}
