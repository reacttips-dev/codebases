import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';
import type { ActionSource } from 'owa-mail-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import { wasFolderUnfavoritedRecently } from './helpers/recentlyRemovedFavorite';

/**
 * Add a favorite node to the favorite store
 * @param folderIdToAdd the id to update
 * @param actionSource of where the add action is triggered from
 */
export default action(
    'ADD_FAVORITE_FOLDER',
    (folderIdToAdd: string, actionSource: ActionSource, newIndex?: number) =>
        addDatapointConfig(
            {
                name: isFeatureEnabled('tri-favorites-roaming')
                    ? 'AddOutlookFavoriteFolder'
                    : 'AddFavoriteFolder',
                customData: {
                    actionSource: actionSource,
                    distinguishedFolderName: folderIdToName(folderIdToAdd),
                    wasFolderUnfavoritedRecently: wasFolderUnfavoritedRecently(folderIdToAdd),
                },
            },
            {
                folderIdToAdd,
                actionSource,
                newIndex,
            }
        )
);
