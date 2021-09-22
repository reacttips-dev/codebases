import { mutatorAction } from 'satcheljs';
import type RecipientCacheStore from '../store/schema/RecipientCacheStore';

export default mutatorAction(
    'updateUserIdentity',
    (store: RecipientCacheStore, userIdentity: string) => {
        store.userIdentity = userIdentity;
    }
);
