import type {
    default as SubstrateSearchResponse,
    SearchResultSet,
} from '../../data/schema/SubstrateSearchResponse';

export default function getSearchResultSet(responseBody: SubstrateSearchResponse): SearchResultSet {
    if (responseBody?.EntitySets?.[0]?.ResultSets?.[0]) {
        return responseBody.EntitySets[0].ResultSets[0];
    }

    return null;
}
