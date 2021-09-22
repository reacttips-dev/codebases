import type { ActionType, TriageContext } from 'owa-mail-actions';
import { action } from 'satcheljs';

/**
 * Once the spotlight cache is updated, this action is dispatched so that
 * store updates can be made. These actions are sequenced because there are
 * certain actions that will remove items from the Spotlight store, but those
 * items are required to be in the store when the cache updates are made.
 */
export default action(
    'onCacheUpdated',
    (interactionType: ActionType, triageContext: TriageContext) => ({
        interactionType,
        triageContext,
    })
);
