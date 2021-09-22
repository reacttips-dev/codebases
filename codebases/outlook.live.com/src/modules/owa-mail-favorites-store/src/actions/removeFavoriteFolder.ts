import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';
import type { ActionSource } from 'owa-mail-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';

/**
 * Remove the given folderId from the favorite folder list
 * @param folderIdToRemove the id to remove
 * @param actionSource of where the remove action is triggered from
 */
export default action(
    'REMOVE_FAVORITE_FOLDER',
    (folderIdToRemove: string, actionSource: ActionSource) =>
        addDatapointConfig(
            {
                name: isFeatureEnabled('tri-favorites-roaming')
                    ? 'RemoveFavoriteFolderV2'
                    : 'RemoveFavoriteFolderV1',
                customData: {
                    actionSource: actionSource,
                    distinguishedFolderName: folderIdToName(folderIdToRemove),
                },
            },
            {
                folderIdToRemove,
                actionSource,
            }
        )
);
