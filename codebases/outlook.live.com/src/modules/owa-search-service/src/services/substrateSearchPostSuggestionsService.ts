import type {
    default as SubstrateSearchRequest,
    EntityRequest,
} from '../data/schema/SubstrateSearchRequest';
import type SubstrateSearchScenario from '../data/schema/SubstrateSearchScenario';
import { makePostRequest } from 'owa-ows-gateway';
import { getSubstrateSearchEndpoint } from '../index';
import buildQueryParams from '../helpers/buildQueryParams';
import { trace } from 'owa-trace';
import { getUrlWithAddedQueryParameters } from 'owa-url';

/**
 * This route is responsible for providing suggestions from POST requests to 3S/Suggestions service.
 * Currently used by Sonora plugin.
 */
export default function substrateSearchPostSuggestionsService(
    queryString: string,
    cvid: string,
    entityType: string,
    size: number,
    substrateSearchScenario: SubstrateSearchScenario,
    customHeaders?: any,
    logicalId?: string
): Promise<Response> {
    const entityRequest: EntityRequest[] = [
        {
            EntityType: entityType,
            Filter: undefined,
            From: undefined,
            PropertySet: undefined,
            Provenances: undefined,
            Query: {
                QueryString: queryString,
            },
            RefiningQueries: undefined,
            Size: size,
            Sort: undefined,
        },
    ];
    const substrateSearchRequest: SubstrateSearchRequest = {
        Cvid: cvid,
        EntityRequests: entityRequest,
        Scenario: { Name: substrateSearchScenario },
        TextDecorations: undefined,
        TimeZone: undefined,
        LogicalId: logicalId,
    };

    return makePostRequest(
        getUrlWithAddedQueryParameters(
            getSubstrateSearchEndpoint('suggestions'),
            buildQueryParams()
        ) /* requestUrl */,
        substrateSearchRequest /* requestObject */,
        undefined /* correlationId (client-request-id) */,
        true /* returnFullResponse */,
        customHeaders /* customHeaders */,
        undefined /* throwServiceError */,
        undefined /* sendPayloadAsBody */,
        false /* includeCredentials */
    )
        .then(response => {
            return Promise.resolve(response);
        })
        .catch(error => {
            trace.warn(error);
            return Promise.reject(error);
        });
}
