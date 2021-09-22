import type SubstrateSearchScenario from '../data/schema/SubstrateSearchScenario';
import getSubstrateSearchEndpoint from '../helpers/getSubstrateSearchEndpoint';
import { makeGetRequest } from 'owa-ows-gateway';
import buildQueryParams from '../helpers/buildQueryParams';
import { getAccessTokenforResourceAsLazy } from 'owa-tokenprovider';
import { getUrlWithAddedQueryParameters, getOrigin } from 'owa-url';
import { isBusiness } from 'owa-session-store';

export default async function substrateSearchInitOperation(
    cvid: string,
    substrateSearchScenario: SubstrateSearchScenario,
    clientFlightsHeaderValue?: string,
    apiVersion?: number
): Promise<void> {
    const defaultParams = { cvid: cvid, scenario: substrateSearchScenario };
    const params = buildQueryParams(defaultParams);
    const customHeaders = {};

    // Add "X-Client-Flights" header (if we need to).
    if (clientFlightsHeaderValue) {
        customHeaders['X-Client-Flights'] = clientFlightsHeaderValue;
    }

    // v2 api needs a different auth token
    if (apiVersion == 2) {
        let [token, tokenPromise] = getAccessTokenforResourceAsLazy(
            getResourceOrigin(),
            'OwaSearchService'
        );

        // If token is not returned synchronously, we need to await on the tokenPromise
        if (!token) {
            token = (await tokenPromise) as string;
        }

        customHeaders['authorization'] = 'Bearer ' + (token as string);
    }

    // Call auto-suggestion init url to warm-up user's index
    return makeGetRequest(
        getUrlWithAddedQueryParameters(getSubstrateSearchEndpoint('init', apiVersion), params),
        undefined /* correlationId */,
        undefined /* returnFullResponse */,
        customHeaders,
        undefined /* throwServiceError */,
        /* 3S does not need auth cookies so omitting them will decrease request header size */
        false /* includeCredentials */
    );
}

export function getResourceOrigin(): string {
    const origin = isBusiness() ? `${getOrigin()}/search` : getOrigin();
    return origin.replace('outlook-sdf.office.com', 'outlook.office.com');
}
