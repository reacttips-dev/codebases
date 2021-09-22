import { getStore as getFavoritesStore, loadFavorites } from 'owa-favorites';
import { isGroupsEnabled } from 'owa-account-capabilities/lib/isGroupsEnabled';
import { lazyLoadGroups, lazyLoadGroupsFromSessionData } from 'owa-group-left-nav-actions';
import { lazyLoadUnifiedGroupsSettings } from 'owa-groups-shared-actions';
import { FolderForestNodeType, FavoriteDataWithSearchFolderId } from 'owa-favorites-types';
import {
    lazyInitializeFavoritePersonas,
    lazyOutlookFavoritePersonasLoaded,
} from 'owa-mail-favorites-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import { selectDefaultFolder } from '../index';
import { getSelectedNode } from 'owa-mail-folder-forest-store';
import folderStore from 'owa-folders';
import type { MailFolder } from 'owa-graph-schema';
import { loadMailFolders } from 'owa-mail-folder-store';
import { markFunction } from 'owa-performance';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';

/**
 * Load the folder forest to stores, i.e. folders and favorites
 */

export default markFunction(async function loadFolderForest(
    sessionData: SessionData | undefined,
    apolloClientPromise?: Promise<ApolloClient<NormalizedCacheObject>>
) {
    await loadMailFolders(sessionData);

    loadFavorites();
    if (isFeatureEnabled('tri-favorites-roaming')) {
        onOutlookFavoritesLoaded();
    } else {
        onFavoritesLoaded();
    }

    // Check that what we have selected is actually a valid node,
    // not an old one that has been removed.
    // Otherwise selected the default one (inbox).
    if (!isSelectedNodeValid()) {
        selectDefaultFolder('ResetInbox', sessionData, apolloClientPromise);
    }

    if (isGroupsEnabled()) {
        lazyLoadGroupsFromSessionData.importAndExecute();
        lazyLoadGroups.importAndExecute(true);
        lazyLoadUnifiedGroupsSettings.importAndExecute();
    }
},
'ff');

function isSelectedNodeValid(): boolean {
    const selectedNode = getSelectedNode();

    let isValid = false;
    switch (selectedNode.type) {
        case FolderForestNodeType.Folder:
        case FolderForestNodeType.Persona:
        case FolderForestNodeType.PrivateDistributionList:
            const selectedFolderId = selectedNode.id;
            const folder: MailFolder = selectedFolderId
                ? folderStore.folderTable.get(selectedFolderId)
                : null;
            isValid = folder != null;
            break;

        case FolderForestNodeType.Group:
            isValid = true;
            break;

        default:
            break;
    }

    return isValid;
}

/**
 * Called on favorites loaded in store
 */
function onFavoritesLoaded() {
    const favoritesStore = getFavoritesStore();
    const favoritePersonaNodes = favoritesStore.favoritesPersonaNodes;
    if (favoritePersonaNodes.size > 0) {
        lazyInitializeFavoritePersonas.importAndExecute(
            [...favoritePersonaNodes.values()].map(persona => persona.id)
        );
    }
}

/**
 * Called on Outlook favorites loaded in store
 */
function onOutlookFavoritesLoaded() {
    const favoritesStore = getFavoritesStore();
    const allFavorites = [...favoritesStore.outlookFavorites.values()];
    const personaAndPdlFavorites = allFavorites.filter(
        favorite => favorite.type === 'persona' || favorite.type === 'privatedistributionlist'
    );

    if (personaAndPdlFavorites.length > 0) {
        lazyOutlookFavoritePersonasLoaded.importAndExecute(
            personaAndPdlFavorites as FavoriteDataWithSearchFolderId[]
        );
    }
}
