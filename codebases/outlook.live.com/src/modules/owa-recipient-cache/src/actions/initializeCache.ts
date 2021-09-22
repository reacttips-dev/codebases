import tryInitializeCacheWithSource from './tryInitializeCacheWithSource';
import updateUserIdentity from './updateUserIdentity';
import updateRecipientCache from './updateRecipientCache';
import { RecipientCacheSource } from '../store/schema/RecipientCacheSource';
import type RecipientCacheStore from '../store/schema/RecipientCacheStore';
import rcStore from '../store/store';
import shouldUse3SPeopleSuggestions from 'owa-recipient-suggestions/lib/util/shouldUse3SPeopleSuggestions';
import { getUserMailboxInfo } from 'owa-client-ids';

export interface InitializeCacheState {
    store: RecipientCacheStore;
}

export default async function initializeCache(
    state: InitializeCacheState = {
        store: rcStore,
    }
) {
    if (state.store.recipientCache) {
        return;
    }

    updateUserIdentity(state.store, getUserMailboxInfo().userIdentity);

    const is3SEnabled = shouldUse3SPeopleSuggestions();
    // If 3S is enabled first try to get cache results from 3S, if the cache fails to populate, fallback to FindPeople
    await tryInitializeCacheWithSource(
        is3SEnabled ? RecipientCacheSource.SubstrateSuggestions : RecipientCacheSource.FindPeople,
        false /*fallback*/,
        state
    );
    if (is3SEnabled && !state.store.recipientCache) {
        await tryInitializeCacheWithSource(
            RecipientCacheSource.FindPeople,
            true /*fallback*/,
            state
        );
    }
    // If we were unable to populate the recipient cache, initialize with empty values
    if (!state.store.recipientCache) {
        updateRecipientCache(state.store, []);
    }
}
