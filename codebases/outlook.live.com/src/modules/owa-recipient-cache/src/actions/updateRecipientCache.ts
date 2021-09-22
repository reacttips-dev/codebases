import { mutatorAction } from 'satcheljs';
import type RecipientCacheStore from '../store/schema/RecipientCacheStore';
import type { CachePersona } from '../store/schema/RecipientCacheStore';

export default mutatorAction(
    'updateRecipientCache',
    (store: RecipientCacheStore, cache: CachePersona[]) => {
        store.recipientCache = cache;
    }
);
