import { updateCachedSuggestionSet } from '../../actions/internalActions';
import { IS_CATEGORY_QUERY_REGEX, IS_TO_OR_FROM_QUERY_REGEX } from '../../searchConstants';
import getKeywordSuggestionsService from '../../services/getKeywordSuggestionsService';
import { PerformanceDatapoint } from 'owa-analytics';
import { is3SServiceAvailable } from 'owa-search';
import type SuggestionType from 'owa-service/lib/contract/SuggestionType';
import { getUserConfiguration } from 'owa-session-store';
import {
    KeywordSuggestion,
    Suggestion,
    SuggestionKind,
} from 'owa-search-service/lib/data/schema/SuggestionSet';

/**
 * Gets legacy (pre-QF) keyword suggestions, using GetSearchSuggestions
 * service.
 */
export default async function getKeywordSuggestions(
    queryStringForSuggestions: string,
    searchSessionGuid: string,
    maxResults: number
): Promise<Suggestion[]> {
    // Get keywords from legacy GSS.
    const keywords: SuggestionType[] = await getKeywordSuggestionsService(
        queryStringForSuggestions,
        searchSessionGuid,
        maxResults
    );

    const processSuggestionsDatapoint = new PerformanceDatapoint(
        'TnS_ProcessKeywordSuggestionsTime'
    );

    // Convert keywords to KeywordSuggestions.
    const keywordSuggestions = keywords.map((keyword: SuggestionType) => {
        return mapKeywordToKeywordSuggestion(
            keyword.DisplayText,
            keyword.SuggestedQuery,
            keyword.TDSuggestionId.toString(),
            false /* isHistory */
        );
    });

    // Update cached suggestions.
    updateCachedSuggestionSet(queryStringForSuggestions, keywordSuggestions);

    processSuggestionsDatapoint.end();

    return keywordSuggestions;
}

/**
 * Gets keyword suggestions from search history.
 */
export function getLocalKeywordSuggestions(maxResults: number): Suggestion[] {
    // Get suggestions form search history.
    const keywordSuggestions = getZeroInputSuggestionsFromSearchHistory(maxResults);

    if (!is3SServiceAvailable()) {
        // Update cached suggestions in the store.
        updateCachedSuggestionSet('' /* searchText */, keywordSuggestions);
    }

    // Return KeywordSuggestion array.
    return keywordSuggestions;
}

/**
 * Gets suggestions from search history for zero query scenario (when user clicks
 * in the search box when it's empty). Currently, only keyword suggestions are returned
 * since we cannot properly parse persona or category KQL from search history.
 *
 * VSO: 16995 - Add support for reading KQL and hybrid suggestions from history
 * https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/16995
 */
function getZeroInputSuggestionsFromSearchHistory(maxResults: number): Suggestion[] {
    const searchHistory = getUserConfiguration().ViewStateConfiguration.SearchHistory || [];
    const keywordSuggestionsFromSearchHistory: string[] = [];

    /**
     * Iterate over search history until keywordSuggestions is filled with enough
     * suggestions or search history is exhausted.
     */
    for (
        let i = 0;
        i < searchHistory.length && keywordSuggestionsFromSearchHistory.length < maxResults;
        i++
    ) {
        const queryText = searchHistory[i];

        // Skip persona and category suggestions.
        if (
            !queryText.match(IS_TO_OR_FROM_QUERY_REGEX) &&
            !queryText.match(IS_CATEGORY_QUERY_REGEX)
        ) {
            keywordSuggestionsFromSearchHistory.push(queryText);
        }
    }

    // Convert keywords to KeywordSuggestion array.
    const keywordSuggestions = keywordSuggestionsFromSearchHistory.map((keyword, index) =>
        mapKeywordToKeywordSuggestion(
            keyword /* displayText */,
            keyword /* queryText */,
            index.toString() /* referenceId */,
            true /* isHistory */
        )
    );

    return keywordSuggestions;
}

/**
 * Maps a keyword to a KeywordSuggestion.
 */
function mapKeywordToKeywordSuggestion(
    displayText: string,
    queryText: string,
    referenceId: string,
    isHistory: boolean
): KeywordSuggestion {
    return {
        kind: SuggestionKind.Keywords,
        DisplayText: displayText,
        QueryText: queryText,
        ReferenceId: referenceId,
        Attributes: {
            IsHistory: isHistory,
            IsAutoCompleteHighConfidence: undefined /* Unused */,
        },
    };
}
