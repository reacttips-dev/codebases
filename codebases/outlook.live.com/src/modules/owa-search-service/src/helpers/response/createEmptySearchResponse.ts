import { convertSearchQueryId } from './converterHelpers';
import type ExecuteSearchResponseMessage from 'owa-service/lib/contract/ExecuteSearchResponseMessage';

export default function createEmptySearchResult(): ExecuteSearchResponseMessage {
    return {
        SearchResults: {
            MoreResultsAvailable: false,
            TotalResultsCount: 0,
            SearchResultsCount: 0,
            TDQueryId: convertSearchQueryId(null),
        },
    };
}
