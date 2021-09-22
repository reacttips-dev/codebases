import validateAndUpdateFavorite from './validateAndUpdateFavorite';
import synchronizeSearchFolder from './synchronizeSearchFolder';
import updateSelectedNodeWithNewPersona from './updateSelectedNodeWithNewPersona';
import {
    markSearchFolderAsPopulated,
    MARK_FOLDER_POPULATED_TIMEOUT,
} from './markSearchFolderAsPopulated';
import datapoints from '../../../datapoints';
import type { ObservableMap } from 'mobx';
import { logUsage, wrapFunctionForDatapoint } from 'owa-analytics';
import type { FavoritePersonaNode } from 'owa-favorites-types';
import { favoritesStore, updateFavoritesUserOption } from 'owa-favorites';
import { trace } from 'owa-trace';

export interface OnFavoritePersonaSelectedState {
    favoritesPersonaNodes: ObservableMap<string, FavoritePersonaNode>;
}

// When user click on exiting favorite persona we want to update search folder if needed - if emails/display name has changed
export default wrapFunctionForDatapoint(
    datapoints.OnFavoritePersonaSelectedAction,
    async function onFavoritePersonaSelected(
        favoriteNodeId: string,
        state: OnFavoritePersonaSelectedState = {
            favoritesPersonaNodes: favoritesStore.favoritesPersonaNodes,
        }
    ): Promise<void> {
        const personaNode = state.favoritesPersonaNodes.get(favoriteNodeId);
        if (personaNode.isSyncUpdateDone) {
            // If user clicks on the favorite persona multiple times in the same session, we will not sync the search folder again.
            return;
        }
        try {
            const hasPersonaInformationChanged = await validateAndUpdateFavorite(personaNode.id);
            if (hasPersonaInformationChanged) {
                //If the favoritePersona was changed, the selectedNode object has to be updated with the latest info
                updateSelectedNodeWithNewPersona(personaNode.id);
            }
            // Synchronize the search folder, recreate the folder if not found/persona updated
            const wasSearchFolderUpdated = await synchronizeSearchFolder(
                personaNode,
                'OnClick',
                hasPersonaInformationChanged
            );
            // If a search folder had to be re-created/updated, mark it as populated after a timeout
            if (wasSearchFolderUpdated) {
                setTimeout(() => {
                    markSearchFolderAsPopulated(personaNode.id);
                }, MARK_FOLDER_POPULATED_TIMEOUT);
            }
            if (hasPersonaInformationChanged || wasSearchFolderUpdated) {
                // If the persona was changed, or a folder was re-created, then update the user config
                await updateFavoritesUserOption();
            }
        } catch (error) {
            // Fail silently and log.
            // This is scenario where persona info changed and we are trying to recreate/update search folder.
            // Random failure is not considered important as update will be done next time.
            const eventName = 'UpdatePersonaAndSearchFolderFailure';
            trace.warn(eventName + ': ' + error);
            logUsage(eventName, [error.toString()]);
        }
    }
);
