import { action } from 'satcheljs';
/**
 * This action is to be dispatched after search is exited and we need
 * to re-select the previous node the user was on before entering into
 * their search session.
 */
export const selectPreviousNode = action('SELECT_PREVIOUS_NODE', (actionSource: string) => ({
    actionSource: actionSource,
}));
