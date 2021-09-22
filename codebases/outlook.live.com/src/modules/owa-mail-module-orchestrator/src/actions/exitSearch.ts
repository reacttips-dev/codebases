import type { ActionSource } from 'owa-mail-store';
import { action } from 'satcheljs';

/**
 * Exit search
 * @param actionSource action source
 */
export let exitSearch = action('exitSearch', (actionSource: ActionSource) => ({
    actionSource: actionSource,
}));
