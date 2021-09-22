import type SubstrateSearchScenario from '../data/schema/SubstrateSearchScenario';
import getSubstrateSearchEndpoint from '../helpers/getSubstrateSearchEndpoint';
import { makeGetRequest } from 'owa-ows-gateway';
import buildQueryParams from '../helpers/buildQueryParams';
import { trace } from 'owa-trace';
import { getUrlWithAddedQueryParameters } from 'owa-url';

/**
 * This route is responsible for providing completions/suggestions for the given prefix.
 * The type of suggestions returned would be based on the configuration done at 3S API.
 */
export default function substrateSearchSuggestionsService(
    queryString: string,
    searchSessionGuid: string,
    cvid: string,
    entityTypes: string,
    substrateSearchScenario: SubstrateSearchScenario,
    customHeaders?: any,
    logicalId?: string,
    serverFlights?: string
): Promise<Response> {
    const defaultParams = {
        cvid: cvid,
        query: queryString,
        textdecorations: '1',
        scenario: substrateSearchScenario,
        entityTypes: entityTypes,
    };

    if (logicalId) {
        defaultParams['logicalId'] = logicalId;
    }

    if (serverFlights && queryString?.length > 0) {
        defaultParams['setflight'] = serverFlights;
    }

    if (searchSessionGuid) {
        return makeGetRequest(
            getUrlWithAddedQueryParameters(
                getSubstrateSearchEndpoint('suggestions'),
                buildQueryParams(defaultParams)
            ),
            undefined /* correlationId */,
            true /* returnFullResponse */,
            customHeaders,
            undefined /* throwServiceError */,
            /* 3S does not need auth cookies so omitting them will decrease request header size */
            false /* includeCredentials */
        )
            .then(resp => {
                return resp;
            })
            .catch(err => {
                trace.warn(err);
                return null;
            });
    } else {
        return Promise.resolve(null);
    }
}
