import type {
    default as SuperExecuteSearchResponseMessage,
    QuerySuggestionData,
} from 'owa-search-service/lib/data/schema/SuperExecuteSearchResponseMessage';
import getSupportedQueryAlterationTypes from 'owa-search-service/lib/helpers/getSupportedQueryAlterationTypes';
import type ExecuteSearchResponseMessage from 'owa-service/lib/contract/ExecuteSearchResponseMessage';
import type {
    default as SubstrateSearchResponse,
    QueryAlterationResponse,
    QueryAlterationResponseV2,
    QueryAlterationType,
    SubstrateSearchResponseV1,
    SubstrateSearchResponseV2,
} from 'owa-search-service/lib/data/schema/SubstrateSearchResponse';

export default async function augmentExecuteSearchResponseMessage(
    substrateSearchResponse: Response,
    substrateSearchResponseBody: SubstrateSearchResponse,
    executeSearchResponseMessage: ExecuteSearchResponseMessage
): Promise<SuperExecuteSearchResponseMessage> {
    // If failure response (or no response), return ES body.
    if (!substrateSearchResponse || substrateSearchResponse.status !== 200) {
        return {
            ...executeSearchResponseMessage,
        };
    }

    const apiVersion = parseFloat(substrateSearchResponseBody.ApiVersion);
    const queryAlterationResponse =
        apiVersion === 1.4
            ? (substrateSearchResponseBody as SubstrateSearchResponseV1)?.EntitySets?.[0]
                  ?.QueryAlterationResponse
            : (substrateSearchResponseBody as SubstrateSearchResponseV2)?.QueryAlterationResponse;

    // If there's no QueryAlterationResponse from 3S response, return ES body.
    if (!queryAlterationResponse) {
        return {
            ...executeSearchResponseMessage,
        };
    }

    /**
     * If QueryAlterationType isn't supported just extend the ES response with
     * empty data.
     */
    if (!isSupportedQueryAlterationType(queryAlterationResponse.QueryAlterationType)) {
        return {
            ...executeSearchResponseMessage,
            querySuggestionData: {
                alteredQuery: '',
                flaggedTokens: null,
                recourseQuery: '',
                suggestedSearchTerm: null,
                suggestedSearchTermReferenceId: null,
                queryAlterationType: null,
            },
        };
    }

    /**
     * If we get here, the QueryAlterationType is "Suggestion", which is the
     * response for spell-corrected search.
     */
    const superExecuteSearchResponseMessage: SuperExecuteSearchResponseMessage = {
        ...executeSearchResponseMessage,
        querySuggestionData: getQuerySuggestionData(apiVersion, queryAlterationResponse),
    };

    return superExecuteSearchResponseMessage;
}

const getQuerySuggestionData = (
    apiVersion: number,
    queryAlterationResponse: QueryAlterationResponse | QueryAlterationResponseV2
): QuerySuggestionData => {
    if (apiVersion === 1.4) {
        const v1Response = queryAlterationResponse as QueryAlterationResponse;
        return {
            alteredQuery: v1Response.AlteredQuery?.AlteredQuery?.RawString,
            flaggedTokens: v1Response.AlteredQuery?.FlaggedTokens,
            recourseQuery: v1Response.RecourseQuery?.RawString,
            displayText: v1Response.AlteredQuery?.AlteredQuery?.DisplayText,
            suggestedSearchTerm: v1Response.AlteredQuery?.FlaggedTokens?.[0]?.Suggestion,
            suggestedSearchTermReferenceId: v1Response.AlteredQuery?.AlteredQuery?.ReferenceId,
            queryAlterationType: v1Response.QueryAlterationType,
        };
    } else {
        const v2Response = queryAlterationResponse as QueryAlterationResponseV2;
        return {
            alteredQuery: v2Response.QueryAlteration?.AlteredQuery?.RawString,
            flaggedTokens: v2Response.QueryAlteration?.FlaggedTokens,
            recourseQuery: v2Response.RecourseQuery?.RawString,
            displayText: v2Response.QueryAlteration?.AlteredQuery?.DisplayText,
            suggestedSearchTerm: v2Response.QueryAlteration?.FlaggedTokens?.[0]?.Suggestion,
            suggestedSearchTermReferenceId: v2Response.QueryAlteration?.AlteredQuery?.ReferenceId,
            queryAlterationType: v2Response.QueryAlterationType,
        };
    }
};

const isSupportedQueryAlterationType = (queryAlterationType: QueryAlterationType): boolean => {
    const supportedQueryAlterationTypes = getSupportedQueryAlterationTypes();
    return supportedQueryAlterationTypes.includes(queryAlterationType);
};
