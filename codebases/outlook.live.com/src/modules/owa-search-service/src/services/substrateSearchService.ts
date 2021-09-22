import type ConnectedAccountInfo from '../data/schema/ConnectedAccountInfo';
import type SubstrateSearchRequest from '../data/schema/SubstrateSearchRequest';
import buildQueryParams from '../helpers/buildQueryParams';
import { getLocalTime } from '../helpers/getLocalTime';
import getSubstrateSearchEndpoint from '../helpers/getSubstrateSearchEndpoint';
import { getGuid } from 'owa-guid';
import { makePostRequest } from 'owa-ows-gateway';
import { createDefaultHeaders } from 'owa-service/lib/createDefaultHeader';
import { getCurrentCulture } from 'owa-localize';
import { trace } from 'owa-trace';
import { getUrlWithAddedQueryParameters } from 'owa-url';

/**
 * This function allows caller to hit 3S service directly by providing a
 * SubstrateSearchRequest object. Instead of receiving a SubstrateSearchResponse
 * object back directly, the caller will be required to check the response
 * and the response status, and act accordingly (i.e. extracting the results
 * from the response body or handling an error from the API).
 *
 * @param substrateSearchRequest The request object for 3S query request
 * @param searchSessionId The ID identifying the user's current search session (client-session-id header value)
 * @param xClientFlightsHeaderValue Flight names to pass to the 3S service to enable server-side features
 * @param connectedAccountInfo ConnectedAccountInfo object in order to stamp the anchorMailbox and authorization info
 * for searching in multi account scenarios.
 * @returns [response, headers] - "response" will be the actual respons from
 * the 3S call. "headers" will be the custom headers generated and passed with
 * the response (required for instrumentation purposes). returns ["error"] in case of web exception
 */
export default function substrateSearchService(
    substrateSearchRequest: SubstrateSearchRequest,
    searchSessionId: string,
    xClientFlightsHeaderValue?: string,
    connectedAccountInfo?: ConnectedAccountInfo[],
    customHeaders?: { [key: string]: string },
    substrateApiVersion?: number
) {
    const requestHeaders = createSubstrateSearchQueryHeaders(
        substrateSearchRequest,
        searchSessionId,
        xClientFlightsHeaderValue,
        connectedAccountInfo,
        customHeaders
    );
    return makePostRequest(
        getUrlWithAddedQueryParameters(
            getSubstrateSearchEndpoint('query', substrateApiVersion),
            buildQueryParams()
        ),
        substrateSearchRequest /* requestObject */,
        null /* correlationId (client-request-id set in custom headers) */,
        true /* returnFullResponse */,
        requestHeaders /* customHeaders */,
        undefined /* throwServiceError */,
        undefined /* sendPayloadAsBody */,
        false /* includeCredentials */
    )
        .then(response => {
            return [response, requestHeaders];
        })
        .catch((error: any) => {
            trace.warn(error);
            return [error];
        });
}

function createSubstrateSearchQueryHeaders(
    request: SubstrateSearchRequest,
    searchSessionId: string,
    xClientFlightsHeaders: string,
    connectedAccountInfo: ConnectedAccountInfo[],
    customHeaders: { [key: string]: string }
) {
    // This function should call createDefaultHeaders. But this function is an async function
    // which will slow down the performance of search. So we will call createDefaultHeadersWithoutAuth
    // and try to use the last auth token fetched. If we are in native-host or opx and the token is expired
    // this scenario will not work as we will not try to refetch the auth token.
    // WI OutlookWeb 102560
    const headers = createDefaultHeaders().bestEffort;

    // Add custom headers.
    headers['client-session-id'] = searchSessionId;
    headers['client-request-id'] = getGuid();
    headers['x-client-localtime'] = getLocalTime();
    headers['X-Search-Griffin-Version'] = 'GWSv2';
    headers['Accept-Language'] = getCurrentCulture();

    if (connectedAccountInfo && connectedAccountInfo.length > 0) {
        headers['x-anchormailbox'] = connectedAccountInfo[0].mailboxSmtpAddress;
        headers['authorization'] = connectedAccountInfo[0].tokenString;
    }

    /**
     * These are flights required by the service to enable features on their end.
     * If there are no flights passed in, don't set the header. Edge v38 doesn't
     * implement the fetch API correctly and requests fail if any header is set
     * to any empty string.
     */
    if (xClientFlightsHeaders) {
        headers['X-Client-Flights'] = xClientFlightsHeaders;
    }

    // an instrumentation tag that allows us to differentiate the various query scenarios
    const scenarioTagKey = 'scenariotag';
    headers[scenarioTagKey] = buildScenarioTag(request);

    if (customHeaders) {
        Object.keys(customHeaders).forEach(k => {
            headers[k] = customHeaders[k];
        });
    }

    return headers;
}

function buildScenarioTag(request: SubstrateSearchRequest) {
    const hasMultipleEntityRequests = request.EntityRequests.length > 1;
    const entityRequest = request.EntityRequests[0];
    const scenarioTags = [];
    if (hasMultipleEntityRequests) {
        scenarioTags.push('ErrMER');
    }

    if (entityRequest.From == 0) {
        scenarioTags.push('1stPg');
    }

    const shortItemType = entityTypeShortName[entityRequest.EntityType];
    scenarioTags.push(shortItemType || 'Unknown');

    return scenarioTags.join('_');
}

const entityTypeShortName: any = {
    Event: 'ev',
    Conversation: 'cv',
    Email: 'em',
    Message: 'mg',
    MailItems: 'mi',
    CalendarItems: 'ci',
    MailConversations: 'mc',
    MessageItems: 'gi',
};
