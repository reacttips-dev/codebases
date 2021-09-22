import type { PerformanceDatapoint } from 'owa-analytics';
import { getGuid } from 'owa-guid';
import SearchProvider from '../data/schema/SearchProvider';
import type SearchRequestInstrumentation from '../data/schema/SearchRequestInstrumentation';
import { makePostRequest } from 'owa-ows-gateway';
import { getConfig } from 'owa-service/lib/config';
import type ExecuteSearchJsonRequest from 'owa-service/lib/contract/ExecuteSearchJsonRequest';
import type ExecuteSearchJsonResponse from 'owa-service/lib/contract/ExecuteSearchJsonResponse';
import createFetchOptions from 'owa-service/lib/createFetchOptions';
import fetchWithRetry from 'owa-service/lib/fetchWithRetry';
import type { RequestOptions, InternalRequestOptions } from 'owa-service/lib/RequestOptions';
import * as trace from 'owa-trace';
import type SubstrateSearchScenario from '../data/schema/SubstrateSearchScenario';
import { getClientId, getClientVersion, getApp } from 'owa-config';

const SUBSTRATE_SEARCH_QUERY_URL: string = 'ows/beta/substratesearch/query';

const MAX_HTTP_HEADER_LENGTH = 2048;

type SearchFetchCallback = (
    actionName: string,
    pageNumber: number,
    jsonRequest: ExecuteSearchJsonRequest,
    searchQueryId: string,
    fetchOptions: RequestOptions,
    substrateSearchScenario: SubstrateSearchScenario
) => Promise<[ExecuteSearchJsonResponse, SearchRequestInstrumentation, string]>;

export default function makeSubstrateSearchRequest(
    jsonRequest: ExecuteSearchJsonRequest,
    pageNumber: number,
    searchQueryId: string,
    executeSearchDatapoint: PerformanceDatapoint,
    actionSource: string,
    substrateSearchScenario: SubstrateSearchScenario
): Promise<[ExecuteSearchJsonResponse, SearchRequestInstrumentation, string]> {
    return internalMakeSearchRequest(
        jsonRequest,
        pageNumber,
        searchQueryId,
        executeSearchDatapoint,
        makeOwsPrimeRequest,
        actionSource,
        substrateSearchScenario
    );
}

export function makeExecuteSearchRequest(
    jsonRequest: ExecuteSearchJsonRequest,
    pageNumber: number,
    searchQueryId: string,
    executeSearchDatapoint: PerformanceDatapoint,
    actionSource: string,
    substrateSearchScenario: SubstrateSearchScenario
): Promise<[ExecuteSearchJsonResponse, SearchRequestInstrumentation, string]> {
    return internalMakeSearchRequest(
        jsonRequest,
        pageNumber,
        searchQueryId,
        executeSearchDatapoint,
        makeOwsRequest,
        actionSource,
        substrateSearchScenario
    );
}

/**
 * Make search request
 * @param actionName - The action name
 * @param pageNumber - Page number for search results
 * @param searchQueryId - The search query id used to identify search for a specific query
 * @param executeSearchDatapoint - the E2E execute search datapoint
 * @returns The promise which resolves after the server response containing:
 * @returns [0] - The ExecuteSearchJsonResponse
 * @returns [1] - The SearchRequestInstrumentation object for this request
 * @returns [2] - The URL of the request
 */
function internalMakeSearchRequest(
    jsonRequest: ExecuteSearchJsonRequest,
    pageNumber: number,
    searchQueryId: string,
    executeSearchDatapoint: PerformanceDatapoint,
    fetch: SearchFetchCallback,
    actionSource: string,
    substrateSearchScenario: SubstrateSearchScenario
): Promise<[ExecuteSearchJsonResponse, SearchRequestInstrumentation, string]> {
    const actionName = 'ExecuteSearch';
    return createFetchOptions().then(fetchOptions => {
        const headers = fetchOptions.headers;

        if (actionSource) {
            headers.append('X-OWA-ActionSource', actionSource);
        }

        const fetchPromise: Promise<
            [ExecuteSearchJsonResponse, SearchRequestInstrumentation, string]
        > = fetch(
            actionName,
            pageNumber,
            jsonRequest,
            searchQueryId,
            fetchOptions,
            substrateSearchScenario
        );

        // If a execute search E2E datapoint was specified, we want to add a checkmark to record the
        // pre-request JavaScript time, and request JS thread time
        let preRequestJSTime = 0;
        let requestJSThreadTime = 0;
        if (executeSearchDatapoint) {
            preRequestJSTime = executeSearchDatapoint.addCheckmark('ClientJSPreRequestTime');

            Promise.resolve().then(() => {
                requestJSThreadTime = executeSearchDatapoint.addCheckmark('ClientJSRequestThread');
            });
        }

        if (!fetchPromise) {
            return Promise.reject('Client-side issue prevented request from being sent');
        }

        return fetchPromise.then(
            (result: [ExecuteSearchJsonResponse, SearchRequestInstrumentation, string]) => {
                const jsonResponse = result[0];
                const searchInstrumentation = result[1];
                const url = result[2];

                const returnValue: [
                    ExecuteSearchJsonResponse,
                    SearchRequestInstrumentation,
                    string
                ] = [jsonResponse, searchInstrumentation, url];

                searchInstrumentation.ClientJSPreRequestTime = preRequestJSTime;
                searchInstrumentation.ClientJSRequestThreadTime = requestJSThreadTime;
                return returnValue;
            }
        );
    });
}

/**
 * Make search request using OWS
 * @param actionName - The action name
 * @param pageNumber - Page number for search results
 * @param jsonRequest - The JSON request to send
 * @param searchQueryId - The search query id used to identify search for a specific query
 * @param fetchOptions - RequestOptions to set on the header
 * @returns The promise which resolves after the server response containing:
 * [0] The ExecuteSearchJsonResponse
 * [1] SearchRequestInstrumentation for this request
 * [2] The URL of the request
 */
function makeOwsRequest(
    actionName: string,
    pageNumber: number,
    jsonRequest: ExecuteSearchJsonRequest,
    searchQueryId: string,
    fetchOptions: InternalRequestOptions,
    substrateSearchScenario: SubstrateSearchScenario
): Promise<[ExecuteSearchJsonResponse, SearchRequestInstrumentation, string]> {
    const serializedRequestBody = JSON.stringify(jsonRequest);
    const urlEncodedSerializedRequestBody = encodeURIComponent(serializedRequestBody);
    let shouldAddEmptyPostMarker = false;
    const headers = fetchOptions.headers;
    headers.append('Content-Type', 'application/json; charset=utf-8');

    fetchOptions.returnFullResponseOnSuccess = true;

    // Check whether to send the payload on the body or on the header
    if (urlEncodedSerializedRequestBody.length > MAX_HTTP_HEADER_LENGTH) {
        fetchOptions.body = serializedRequestBody;
    } else {
        shouldAddEmptyPostMarker = true;
        headers.append('X-OWA-UrlPostData', urlEncodedSerializedRequestBody);
        fetchOptions.body = null;
    }
    const requestUrl = getOwsRequestUrl(actionName, shouldAddEmptyPostMarker);

    const clientRequestStart = new Date();
    const fetchPromise = fetchWithRetry('ExecuteSearch', requestUrl, 1, fetchOptions);
    return fetchPromise.then(async response => {
        const responseBody = <ExecuteSearchJsonResponse>await response.json();
        const result: [ExecuteSearchJsonResponse, SearchRequestInstrumentation, string] = [
            responseBody,
            buildInstrumentation(
                response,
                jsonRequest.Body.Query,
                response.status == 200
                    ? null
                    : responseBody
                    ? JSON.stringify(responseBody.Body)
                    : null,
                SearchProvider.ExecuteSearch,
                clientRequestStart,
                new Date(),
                searchQueryId,
                <Headers>fetchOptions.headers,
                pageNumber,
                substrateSearchScenario
            ),
            response.url,
        ];
        return result;
    });
}

/**
 * Make search request using OWS prime
 * @param actionName - The action name
 * @param pageNumber - Page number for search results
 * @param jsonRequest - The JSON request to send
 * @param searchQueryId - The search query id used to identify search for a specific query
 * @param fetchOptions - RequestOptions to set on the header
 * @param substrateSearchScenario - Identifer for the scenario for 3S
 * @returns The promise which resolves after the server response containing:
 * [0] The ExecuteSearchJsonResponse
 * [1] SearchRequestInstrumentation for this request
 * [2] The URL of the request
 */
function makeOwsPrimeRequest(
    actionName: string,
    pageNumber: number,
    jsonRequest: ExecuteSearchJsonRequest,
    searchQueryId: string,
    fetchOptions: RequestOptions,
    substrateSearchScenario: SubstrateSearchScenario
): Promise<[ExecuteSearchJsonResponse, SearchRequestInstrumentation, string]> {
    if (!searchQueryId) {
        trace.errorThatWillCauseAlert(
            'SearchQueryId must be specified when calling makeExecuteSearchRequest!'
        );
        return null;
    }

    const headers = {};
    (<Headers>fetchOptions.headers).forEach((val, key) => {
        headers[key] = val;
    });

    headers['X-Search-Griffin-Version'] = 'GWSv2';

    const clientRequestStart = new Date();

    // our translation layer in OWS' expects the SessionId to be the QueryId
    jsonRequest.Body.SearchSessionId = searchQueryId;

    jsonRequest.Body.Scenario = substrateSearchScenario;

    return makePostRequest(
        SUBSTRATE_SEARCH_QUERY_URL,
        jsonRequest,
        getGuid() /* correlationId (client-request-id) */,
        true /* returnFullResponse */,
        headers
    )
        .then(async response => {
            const responseBody = <ExecuteSearchJsonResponse>await response.json();
            return [
                responseBody,
                buildInstrumentation(
                    response,
                    jsonRequest.Body.Query,
                    response.status == 200
                        ? null
                        : responseBody
                        ? JSON.stringify(responseBody.Body)
                        : null,
                    SearchProvider.Substrate,
                    clientRequestStart,
                    new Date(),
                    searchQueryId,
                    <Headers>fetchOptions.headers,
                    pageNumber,
                    substrateSearchScenario
                ),
                response.url,
            ];
        })
        .catch(err => {
            trace.trace.warn(err);
            return null;
        });
}

/**
 * Build the instrumentation data for a specific search request
 * @param response - The Response object
 * @param jsonRequest - The JSON request
 * @param errorMessage - The Error message in the body (if any)
 * @param clientRequestStart - Start time for when client initiated the network request
 * @param clientRequestFinish - End time for when the client received network response
 * @param clientQueryId - The search query id
 * @param pageNumber - Page number for search results
 */
export const buildInstrumentation = (
    response: Response,
    query: string,
    errorMessage: string,
    provider: SearchProvider,
    clientRequestStart: Date,
    clientRequestFinish: Date,
    searchQueryId: string,
    clientRequestHeaders: Headers,
    pageNumber: number,
    substrateSearchScenario: SubstrateSearchScenario
): SearchRequestInstrumentation => {
    const responseHeader = response.headers || new Headers();

    const searchRequestInstrumentation: SearchRequestInstrumentation = {
        ClientSearchProvider: provider,
        PageNumber: pageNumber,
        ClientNetworkTime: clientRequestFinish.getTime() - clientRequestStart.getTime(),
        ClientJSEndToEndTime: 0, // Populated separately later
        ClientJSPreRequestTime: 0, // Populated separately later
        ClientJSRequestThreadTime: 0, // Populated separately later
        ClientResponseProcessTime: 0, // Populated separately later
        ClientJSRenderingTime: 0, // Populated separately later
        SearchDateTime: responseHeader.get('date'),
        SearchBETarget: responseHeader.get('x-calculatedbetarget'),
        SearchFETarget: responseHeader.get('x-calculatedfetarget'),
        SearchBEHttpStatus: responseHeader.get('x-backendhttpstatus'),
        SearchMsEdgeRef: responseHeader.get('x-msedge-ref'),
        SearchErrorContent: errorMessage,
        SearchTraceID: responseHeader.get('request-id'),
        SearchQueryId: searchQueryId,
        ClientBuildNumber: getClientVersion(),
        ClientTimeSentUTC: clientRequestStart,
        ClientTimeFinishedUTC: clientRequestFinish,
        ClientHttpStatus: response.status || -1, // Ensure ClientHttpStatus isn't undefined.
        SearchClientRequestID: clientRequestHeaders.get('client-request-id'),
        SearchClientSessionID: getClientId(),
        ClientName: substrateSearchScenario,
        DiagnosticsCheckpoints: responseHeader.get('x-ms-diagnostics-checkpoints'),
        ResourceTimingEntry: null,
        PIIData: {
            queryText: query,
        },
    };

    return searchRequestInstrumentation;
};

/**
 * Get the request URL for OWS request
 * @param actionName - The action name
 * @param shouldAddEmptyPostMarker - Whether we should add empty post marker to the request
 */
function getOwsRequestUrl(actionName: string, shouldAddEmptyPostMarker: boolean): string {
    const config = getConfig();
    const baseActionUrl = config.baseUrl
        ? `${config.baseUrl}/service.svc?action=`
        : '/owa/service.svc?action=';
    let url = baseActionUrl + actionName + `&app=${getApp()}`;

    if (shouldAddEmptyPostMarker) {
        url += '&EP=1';
    }

    // Appending a guid to distinguish all the search request and be able to log resource time for all
    // the requests
    url += '&id=' + getGuid();

    return url;
}
