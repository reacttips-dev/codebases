import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';

/**
 * Add a favorite node to the favorite store
 * @param groupSmtp the smtp address of the group being added
 * @param displayName the display name of the group being added
 * @param actionSource of where the add action is triggered from
 */
export default action(
    'ADD_FAVORITE_GROUP',
    (groupSmtp: string, displayName: string, actionSource: string) =>
        addDatapointConfig(
            {
                name: 'AddFavoriteGroup',
                customData: [actionSource],
            },
            {
                groupSmtp,
                displayName,
                actionSource,
            }
        )
);
