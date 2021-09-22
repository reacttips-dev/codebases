import type SuggestionProvider from '../../store/schema/SuggestionProvider';
import { getCategorySuggestions, getMasterCategoryList } from 'owa-categories';
import {
    createClientSuggestionInstrumentationContext,
    getLocalContentInstrumentationType,
} from './logClientSuggestions';
import {
    CategorySearchSuggestion,
    LocalContentInstrumentationContext,
    Suggestion,
    SuggestionKind,
    TrySearchSuggestion,
    PeopleSuggestion,
} from 'owa-search-service';
import {
    MAX_CATEGORY_SUGGESTIONS_TO_SHOW,
    QUERY_LENGTH_FOR_CONFIDENCE,
    MAX_TRY_SUGGESTIONS_TO_SHOW,
} from '../../searchConstants';
import { default as SuggestionsLocStrings } from './getClientSuggestions.locstring.json';
import { getGuid } from 'owa-guid';
import loc, { format } from 'owa-localize';
import {
    cleanupTrySuggestionData,
    shouldShowTrySuggestions,
    getFirstTimeTrySuggestionShown,
} from '../../selectors/getTrySuggestionsData';

import { setTrySuggestionFirstShown } from '../../utils/setTrySuggestionsData';

export type ClientSuggestions = {
    suggestions: Suggestion[];
    instrumentationContext: { [providerName: string]: LocalContentInstrumentationContext[] };
};

interface TrySuggestionTemplate {
    name: string;
    id: string;
}

// Gets client suggestions using client suggestion providers.
export default function getClientSuggestions(
    queryStringForSuggestions: string,
    serverSuggestions: Suggestion[]
): ClientSuggestions {
    const clientSuggestionProviders = getClientSuggestionProviders(
        queryStringForSuggestions,
        serverSuggestions
    );
    const clientSuggestions: Suggestion[] = [];
    const clientSuggestionsInstrumentationContext: {
        [providerName: string]: LocalContentInstrumentationContext[];
    } = {};

    const trimmedQuery = queryStringForSuggestions.trim();
    for (const clientSuggestionProvider of clientSuggestionProviders) {
        const currentProviderSuggestions = clientSuggestionProvider.getSuggestions(
            trimmedQuery,
            clientSuggestionProvider.maxSuggestionsToGet
        );

        clientSuggestions.push(...currentProviderSuggestions);

        if (currentProviderSuggestions.length > 0) {
            const contentType = getLocalContentInstrumentationType(
                clientSuggestionProvider.suggestionKind
            );
            const currentProviderInstrumentationContext = createClientSuggestionInstrumentationContext(
                currentProviderSuggestions,
                contentType
            );

            clientSuggestionsInstrumentationContext[
                clientSuggestionProvider.providerName
            ] = currentProviderInstrumentationContext;
        }
    }

    // Ensure no client suggestions appear as "Best Match" suggestions.
    clientSuggestions.map(suggestion => (suggestion.BestMatchPosition = -1));

    return {
        suggestions: clientSuggestions,
        instrumentationContext: clientSuggestionsInstrumentationContext,
    };
}

/**
 * Gets client suggestion providers for suggestion types that are enabled.
 */
function getClientSuggestionProviders(queryStringForSuggestions: string, serverSuggestions: any[]) {
    const suggestionProviders: SuggestionProvider[] = [
        {
            maxSuggestionsToGet: MAX_CATEGORY_SUGGESTIONS_TO_SHOW,
            suggestionKind: SuggestionKind.Category,
            getSuggestions: getCategorySearchSuggestions,
            providerName: 'categoryprovider',
        },
        {
            maxSuggestionsToGet: MAX_TRY_SUGGESTIONS_TO_SHOW,
            suggestionKind: SuggestionKind.TrySuggestion,
            getSuggestions: () =>
                getTrySearchSuggestions(queryStringForSuggestions, serverSuggestions),
            providerName: 'tryprovider',
        },
    ];

    return suggestionProviders;
}

/**
 * Gets category suggestions for the given query text.
 *
 * @param queryStringForSuggestions The query text for which to get the suggestions
 * @param maxResults Number of suggestions to get
 * @return Suggestion collection
 */
function getCategorySearchSuggestions(
    queryStringForSuggestions: string,
    maxResults: number
): Suggestion[] {
    const categorySuggestions = getCategorySuggestions(
        queryStringForSuggestions,
        getMasterCategoryList()
    );
    const categorySuggestionsToShow: CategorySearchSuggestion[] = [];

    /**
     * Iterate over available categories until list is exhausted, or until we've
     * already matched the max number of maxResults to show.
     */
    for (
        let i = 0;
        i < categorySuggestions.suggestions.length && categorySuggestionsToShow.length < maxResults;
        i++
    ) {
        const suggestion = categorySuggestions.suggestions[i];

        /**
         * Push category suggestion only if either condition is true:
         *      1. The query text length is more than or equal to confidence
         *          threshold
         *      2. The query text length is same as the category name's which
         *          means we found the exact match (i.e. category name length
         *          is smaller than confidence threshold)
         */
        if (
            queryStringForSuggestions.length >= QUERY_LENGTH_FOR_CONFIDENCE ||
            queryStringForSuggestions.length == suggestion.Name.length
        ) {
            categorySuggestionsToShow.push({
                kind: SuggestionKind.Category,
                Name: suggestion.Name,
                ReferenceId: suggestion.Id,
            });
        }
    }

    return categorySuggestionsToShow;
}

/**
 * Gets try search suggestions.
 *
 * @param peopleServerSuggestions The people server suggestions
 * @return Try Search Suggestion collection
 */
function getTrySearchSuggestions(
    queryStringForSuggestions: string,
    serverSuggestions: PeopleSuggestion[]
): TrySearchSuggestion[] {
    const peopleServerSuggestions: PeopleSuggestion[] = [];
    const tryClientSuggestions: TrySearchSuggestion[] = [];
    const timeFirstShown = getFirstTimeTrySuggestionShown();

    if (shouldShowTrySuggestions(queryStringForSuggestions, timeFirstShown)) {
        // first clean up old TrySuggestion rows in local storage
        cleanupTrySuggestionData();

        for (let i = 0; i < serverSuggestions.length && peopleServerSuggestions.length <= 2; i++) {
            if (serverSuggestions[i].kind === SuggestionKind.People) {
                peopleServerSuggestions.push(serverSuggestions[i]);
            }
        }

        if (peopleServerSuggestions.length < 2) {
            return tryClientSuggestions;
        }

        // Bank of try suggestion queries
        const suggestionQueryBank: TrySuggestionTemplate[] = [
            {
                name: SuggestionsLocStrings.NLFirstSuggestion,
                id: '1',
            },
            {
                name: SuggestionsLocStrings.NLSecondSuggestion,
                id: '2',
            },
            {
                name: SuggestionsLocStrings.NLThirdSuggestion,
                id: '3',
            },
            {
                name: SuggestionsLocStrings.NLFourthSuggestion,
                id: '4',
            },
        ];

        const index = getRandomInt(0, suggestionQueryBank.length - 1);
        const suggestedQuery = suggestionQueryBank[index];

        const peopleIndex = getRandomInt(0, peopleServerSuggestions.length - 1);
        tryClientSuggestions.push({
            kind: SuggestionKind.TrySuggestion,
            QueryText: format(
                loc(suggestedQuery.name),
                peopleServerSuggestions[peopleIndex].DisplayName
            ),
            ReferenceId: getGuid(),
            SuggestionId: suggestedQuery.id,
        });
    }

    if (tryClientSuggestions.length > 0 && !timeFirstShown) {
        setTrySuggestionFirstShown();
    }

    return tryClientSuggestions;
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max - min + 1));
}
