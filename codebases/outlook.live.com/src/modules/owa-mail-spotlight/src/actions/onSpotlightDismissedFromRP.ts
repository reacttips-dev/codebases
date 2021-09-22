import { action } from 'satcheljs';

export default action('onSpotlightDismissedFromRP', (rowKey: string) => ({
    rowKey,
}));

/**
 * This action is required to remove the item from the store after the orchestrator
 * handles the original action (which requires access to the item in the store).
 */
export const onSpotlightDismissedFromRPProcessed = action(
    'onSpotlightDismissedFromRPProcessed',
    (rowKey: string) => ({
        rowKey,
    })
);
