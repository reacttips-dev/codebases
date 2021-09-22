import datapoints from '../../../datapoints';
import * as pendingFavoritesMapMutators from '../../../mutators/pendingFavoritesMapMutators';
import { logUsage, wrapFunctionForDatapoint } from 'owa-analytics';
import { getSelectedNode } from 'owa-mail-folder-forest-store';
import { deleteFolders } from 'owa-mail-persona-search-folder-services';
import type { ActionSource } from 'owa-mail-store';
import { trace } from 'owa-trace';
import { getStore as getSharedFavoritesStore, updateFavoritesUserOption } from 'owa-favorites';
import type { FavoritePersonaNode } from 'owa-favorites-types';
import isFavoritingInProgress from '../../../selectors/isFavoritingInProgress';
import { mutatorAction } from 'satcheljs';

/**
 * Add or remove the given persona from the favorite list
 * @param favoriteNodeId The Node Id of the persona to be removed
 */
const removeFavoritePersonaAction = wrapFunctionForDatapoint(
    datapoints.RemoveFavoritePersonaAction,
    async function removeFavoritePersona(
        favoriteNodeId: string,
        actionSource: ActionSource
    ): Promise<void> {
        const sharedFavoritesStore = getSharedFavoritesStore();
        const persona = sharedFavoritesStore.favoritesPersonaNodes.get(favoriteNodeId);
        let inProgressKey = undefined;
        let isInProgressSet = false;

        try {
            if (!persona) {
                throw new Error('RemoveFavoritePersona - NodeId could not be found in the store');
            }

            inProgressKey = persona.mainEmailAddress || persona.personaId || persona.id;
            if (isFavoritingInProgress(inProgressKey)) {
                throw new Error('RemoveFavoritePersona - Favoriting is already in progress');
            }

            pendingFavoritesMapMutators.add(inProgressKey);
            isInProgressSet = true;

            // Remove from favorite from the store
            removeFavoriteNodeId(favoriteNodeId);

            await updateFavoritesUserOption();

            const searchFolderId = persona.searchFolderId;

            try {
                if (searchFolderId) {
                    // If the selected node is being un-favorited, we don't delete the search
                    // folder immediately since it would break the filters, but set the node to be
                    // deleted. The folder will be deleted after the selected node changes.
                    const selectedPersonaNode = getSelectedNode() as FavoritePersonaNode;
                    if (selectedPersonaNode.id === favoriteNodeId) {
                        selectedPersonaNode.markedForDeletion = true;
                    } else {
                        // If the action comes from LPC or the left nav we delete the folder immediately
                        await deleteFolders([searchFolderId], true /* permanentlyDelete */);
                    }
                }
            } catch (error) {
                // Fail silently and log.
                // By default search folders are deleted at some point when they become stale
                const { name: eventName, customData: customData } = datapoints.DeleteFolderFailure;

                trace.warn(eventName + ': ' + error);
                logUsage(eventName, customData(error.toString()));
            }
            pendingFavoritesMapMutators.remove(inProgressKey);
        } catch (error) {
            if (isInProgressSet) {
                pendingFavoritesMapMutators.remove(inProgressKey);
            }

            const eventName = 'RemoveFavoritePersonaFailure';
            trace.warn(eventName + ': ' + error);

            const totalFavoritesCount = sharedFavoritesStore.favoritesPersonaNodes.size;
            logUsage(eventName, [error.toString(), favoriteNodeId, totalFavoritesCount.toString()]);

            // Add back to store if needed
            if (persona && !sharedFavoritesStore.favoritesPersonaNodes.has(persona.id)) {
                addFavoritePersona(persona);
            }

            throw {
                type: 'RemoveFavoritePersonaError',
                ...error,
            };
        }
    }
);

const removeFavoriteNodeId = mutatorAction('removeFavoriteNodeId', (favoriteNodeId: string) => {
    const sharedFavoritesStore = getSharedFavoritesStore();
    const indexOfElementToRemove = sharedFavoritesStore.orderedFavoritesNodeIds.indexOf(
        favoriteNodeId
    );
    if (indexOfElementToRemove > -1) {
        sharedFavoritesStore.orderedFavoritesNodeIds.splice(indexOfElementToRemove, 1);
    }
    sharedFavoritesStore.favoritesPersonaNodes.delete(favoriteNodeId);
});

const addFavoritePersona = mutatorAction('addFavoritePersona', (persona: FavoritePersonaNode) => {
    const sharedFavoritesStore = getSharedFavoritesStore();
    sharedFavoritesStore.orderedFavoritesNodeIds.push(persona.id);
    sharedFavoritesStore.favoritesPersonaNodes.set(persona.id, persona);
});

export default removeFavoritePersonaAction;
