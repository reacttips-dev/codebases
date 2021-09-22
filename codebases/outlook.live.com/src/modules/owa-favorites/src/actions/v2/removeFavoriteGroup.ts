import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';

/**
 * Remove the given groupId from the favorite group list
 * @param groupIdToRemove the id to remove
 * @param actionSource of where the remove action is triggered from
 */
export default action('REMOVE_FAVORITE_GROUP', (groupIdToRemove: string, actionSource: string) =>
    addDatapointConfig(
        {
            name: 'RemoveFavoriteGroup',
            customData: [actionSource],
        },
        {
            groupIdToRemove,
            actionSource,
        }
    )
);
