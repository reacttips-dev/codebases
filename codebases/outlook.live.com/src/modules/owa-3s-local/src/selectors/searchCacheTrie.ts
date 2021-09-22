import { searchCacheTrie as searchCacheTrieSelector } from '3s-featurisers';
import trieStore from '../store/store';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import { isFeatureEnabled } from 'owa-feature-flags';
import { PerformanceDatapoint } from 'owa-analytics';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
const SEARCH_DATAPOINT = 'RecipientTrieSearch';

export function searchCacheTrie(
    searchQuery: string,
    numberOfResults: number,
    shouldSkipRecipient: (EmailAddressWrapper) => boolean
): PersonaType[] {
    const isMulticharCorrectionEnabled = isFeatureEnabled('rp-peopleSuggestionTrieSpellCorrection');
    const datapoint = new PerformanceDatapoint(SEARCH_DATAPOINT);
    let results = searchCacheTrieSelector(
        trieStore.recipientTrie,
        searchQuery,
        numberOfResults,
        shouldSkipRecipient,
        isConsumer(),
        isMulticharCorrectionEnabled
    );
    datapoint.end();
    return results;
}
