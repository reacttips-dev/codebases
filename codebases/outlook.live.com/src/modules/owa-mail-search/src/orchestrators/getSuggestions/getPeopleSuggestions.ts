import { updateCachedSuggestionSet } from '../../actions/internalActions';
import getPeopleSuggestionsService from '../../services/getPeopleSuggestionsService';
import { PerformanceDatapoint } from 'owa-analytics';
import { is3SServiceAvailable } from 'owa-search';
import searchCache from 'owa-recipient-cache/lib/selectors/searchCache';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import { trace } from 'owa-trace';
import { PeopleSuggestion, SuggestionKind, Suggestion, SuggestionSource } from 'owa-search-service';

/**
 * Gets legacy (pre-QF) peoSearchScenarioIdservice.
 */
export default async function getPeopleSuggestions(
    queryStringForSuggestions: string,
    searchSessionGuid: string,
    maxResults: number,
    suggestionSource: SuggestionSource
): Promise<Suggestion[]> {
    // Get suggestions from the recipient cache.
    const recipientCacheSuggestions = getRecipientCacheSuggestions(
        queryStringForSuggestions,
        maxResults
    );

    /**
     * Caller only expects "maxResults" number of suggestions to be returned. This
     * value, "remainingSuggestionCount", will be used to fetch additional suggestions
     * (not from recipient cache) from the server, but we need to account for
     * the number of suggestions we've already retrieved from the cache.
     */
    const remainingSuggestionCount = maxResults - recipientCacheSuggestions.length;

    // If we already have enough suggestions, early return.
    if (remainingSuggestionCount === 0) {
        return Promise.resolve(recipientCacheSuggestions);
    }

    // Get people from FindPeople.
    const personas: PersonaType[] = await getPeopleSuggestionsService(
        queryStringForSuggestions,
        searchSessionGuid,
        maxResults
    );

    const processSuggestionsDatapoint = new PerformanceDatapoint(
        'TnS_ProcessPeopleSuggestionsTime'
    );

    // Convert personas to PeopleSuggestions.
    const peopleSuggestions = mapPersonasToPeopleSuggestions(personas, suggestionSource);

    // Update cached suggestions.
    updateCachedSuggestionSet(queryStringForSuggestions, peopleSuggestions);

    processSuggestionsDatapoint.end();

    return peopleSuggestions;
}

/**
 * Gets array of PeopleSuggestion objects from recipient cache.
 */
export function getLocalPeopleSuggestions(maxResults: number) {
    // Get suggestions from the recipient cache.
    const recipientCacheSuggestions = getRecipientCacheSuggestions(
        '' /* queryStringForSuggestions */,
        maxResults
    );

    if (!is3SServiceAvailable()) {
        // Update cached suggestions in the store.
        updateCachedSuggestionSet('' /* searchText */, recipientCacheSuggestions);
    }

    return recipientCacheSuggestions;
}

/**
 * Returns an array of PeopleSuggestion objects, based on results from the
 * recipient cache.
 */
function getRecipientCacheSuggestions(queryStringForSuggestions: string, maxResults: number) {
    const recipientCacheSuggestions = searchCache(queryStringForSuggestions, maxResults);
    return mapPersonasToPeopleSuggestions(recipientCacheSuggestions, 'localCache');
}

/**
 * Maps the PersonaType array to a PeopleSuggestion array.
 */
function mapPersonasToPeopleSuggestions(
    personas: PersonaType[],
    suggestionSource: SuggestionSource
): PeopleSuggestion[] {
    const peopleSuggestions: PeopleSuggestion[] = [];

    personas.forEach(persona => {
        peopleSuggestions.push({
            kind: SuggestionKind.People,
            DisplayName: persona.DisplayName,
            HighlightedDisplayName: persona.DisplayName,
            EmailAddresses: persona.EmailAddresses.map(e => e.EmailAddress),
            ReferenceId: persona.PersonaId.Id,
            Attributes: undefined,
            Source: suggestionSource,
            MailboxType: persona.EmailAddress.MailboxType,
        });

        if (persona.EmailAddresses.length === 0) {
            trace.info('Received persona with no email address.');
        }
    });

    return peopleSuggestions;
}
