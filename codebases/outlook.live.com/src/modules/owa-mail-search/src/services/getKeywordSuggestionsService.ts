import type GetSearchSuggestionsJsonRequest from 'owa-service/lib/contract/GetSearchSuggestionsJsonRequest';
import type GetSearchSuggestionsRequest from 'owa-service/lib/contract/GetSearchSuggestionsRequest';
import SuggestionKind from 'owa-service/lib/contract/SuggestionKind';
import type SuggestionType from 'owa-service/lib/contract/SuggestionType';
import getSearchSuggestionsOperation from 'owa-service/lib/operation/getSearchSuggestionsOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

/**
 * Pre-QF way of fetching keyword suggestions, using the GetSearchSuggestions
 * (GSS) service.
 */
export default function getKeywordSuggestionsService(
    searchText: string,
    searchSessionGuid: string,
    maxResults: number
): Promise<SuggestionType[]> {
    return getSearchSuggestionsOperation(<GetSearchSuggestionsJsonRequest>{
        Header: getJsonRequestHeader(),
        Body: <GetSearchSuggestionsRequest>{
            Query: searchText,
            SearchSessionId: searchSessionGuid,
            MaxSuggestionsCountPerSuggestionType: maxResults,
            SuggestionTypes: SuggestionKind.Keywords,
            SuggestionsPrimer: false,
        },
    }).then(response => {
        // If suggestions are returned, return the first "maxResults".
        if (response?.Body?.SearchSuggestions) {
            return response.Body.SearchSuggestions.Suggestions.slice(0, maxResults);
        }

        // If no suggestions are returned, just return an empty array.
        return [];
    });
}
