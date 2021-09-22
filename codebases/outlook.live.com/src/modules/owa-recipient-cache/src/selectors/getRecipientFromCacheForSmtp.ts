import type { CachePersona } from '../store/schema/RecipientCacheStore';
import { searchCacheWithFunction } from './searchCache';

export const getRecipientFromCacheForSmtp = (smtp: string): CachePersona | null => {
    const cachePredicate = (persona: CachePersona) =>
        persona.EmailAddress.RoutingType === 'SMTP' &&
        persona.EmailAddress.EmailAddress &&
        persona.EmailAddress.EmailAddress.toLowerCase() === smtp.toLowerCase();

    const result = searchCacheWithFunction(
        cachePredicate,
        1 //numberOfResults
    );

    return result.length ? result[0] : null;
};
