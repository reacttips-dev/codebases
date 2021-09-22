import validateAndUpdateFavorite from './validateAndUpdateFavorite';
import synchronizeSearchFolder from './synchronizeSearchFolder';
import { getStore, updateFavoritesUserOption } from 'owa-favorites';
import { wrapFunctionForDatapoint } from 'owa-analytics';

// When a favorite is updated, i.e. via the people hub, we want to keep the userConfiguration copy fresh and ensure search folders are updated
export default wrapFunctionForDatapoint(
    {
        name: 'OnFavoritePersonaUpdatedAction',
    },
    async function onFavoritePersonaUpdated(favoriteNodeId: string): Promise<void> {
        const personaNode = getStore().favoritesPersonaNodes.get(favoriteNodeId);

        const hasFavoritePersonaChanged = await validateAndUpdateFavorite(personaNode.id);

        // Check if the folder needs an update and re-create if necessary
        const wasSearchFolderUpdated = await synchronizeSearchFolder(
            personaNode,
            'OnFavoriteUpdate',
            hasFavoritePersonaChanged
        );

        if (hasFavoritePersonaChanged || wasSearchFolderUpdated) {
            // If the persona was changed, or a folder was re-created, then update the user config
            await updateFavoritesUserOption();
        }
    }
);
