import * as favoriteNodeParser from '../helpers/favoriteNodeParser';
import { FavoritesBitFlagsMasks, getIsBitEnabled } from '../helpers/favoritesBitFlagsActions';
import {
    FavoriteCategoryNode,
    FavoritePersonaNode,
    FavoriteSearchNode,
    FolderForestNode,
    FolderForestNodeType,
} from 'owa-favorites-types';
import favoritesStore from '../../store/store';
import type { ObservableMap } from 'mobx';
import { logUsage } from 'owa-analytics';
import { isCategoryInMasterList } from 'owa-categories';
import { lazyMigrateFavorites } from '../../index';
import folderStore, { getPrimaryMailFolders } from 'owa-folders';
import type { MailFolder } from 'owa-graph-schema';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { trace } from 'owa-trace';
import { action } from 'satcheljs/lib/legacy';
import setFavoritesLoaded from '../setFavoritesLoaded';
import type FavoritesStore from '../../store/schema/FavoritesStore';

export interface LoadFavoritesState {
    favoritesStore: FavoritesStore;
    folderTable: ObservableMap<string, MailFolder>;
}

/**
 * Should add folder to favorite list
 * @param folderId the folder id to migrate
 * @param state the LoadFavoritesState which contains favorites store, folder table
 */
const shouldAddFavoriteFolder = function shouldAddFavoriteFolder(
    folderId: string,
    state: LoadFavoritesState = {
        favoritesStore: favoritesStore,
        folderTable: folderStore.folderTable,
    }
): boolean {
    // Add the folders if
    // - the folder is not in favorites yet. This could happen during firstRun, if user already has the default favorite folder.
    // - the folder is in the folder store. Skip unsupported favorites type or stale folders which could be deleted in other clients.
    // If the folderTable is empty, the call comes not from owa-mail, but from photo hub. It this case we omit the check for folderTable
    // the stale folder will be removed the next time owa-mail starts
    if (state.folderTable.size > 0) {
        return (
            !state.favoritesStore.favoritesFolderNodes.has(folderId) &&
            state.folderTable.has(folderId)
        );
    } else {
        return true;
    }
};

/**
 * Should add folder to favorite list
 * @param id the category id
 * @return a boolean which indicates whether we should add a favorite category
 */
function shouldAddFavoriteCategory(id: string): boolean {
    // Add the category to favorites if it is still valid and it is not favorited
    // Otherwise skip adding it, e.g the category has been deleted by the user from other client
    return isCategoryInMasterList(id) && !favoritesStore.favoriteCategories.get(id);
}

/**
 * Should add persona to favorite list
 * @param personaId the persona id to migrate
 */
function shouldAddFavoritePersona(personaId: string): boolean {
    return !favoritesStore.favoritesPersonaNodes.has(personaId);
}

/**
 * Add single favorite folder
 * @param favoriteFolderNode the folder to be added
 */
export function tryAddSingleFavoriteFolderToStore(favoriteFolderNode: FolderForestNode) {
    if (shouldAddFavoriteFolder(favoriteFolderNode.id)) {
        // Only add favorite when it's not in favorite yet and the folder is in folder table
        favoritesStore.orderedFavoritesNodeIds.push(favoriteFolderNode.id);
        favoritesStore.favoritesFolderNodes.set(favoriteFolderNode.id, favoriteFolderNode);
    }
}

/**
 * Add single favorite search node
 * @param favoriteNode the favorite search node to be added
 */
function addSingleFavoriteSearchToStore(favoriteNode: FavoriteSearchNode) {
    favoritesStore.orderedFavoritesNodeIds.push(favoriteNode.id);
    favoritesStore.favoriteSearches.set(favoriteNode.id, favoriteNode);
}

/**
 * Add single favorite category node
 * @param favoriteNode the favorite category node to be added
 */
function tryAddSingleFavoriteCategoryToStore(favoriteNode: FavoriteCategoryNode) {
    if (shouldAddFavoriteCategory(favoriteNode.id)) {
        favoritesStore.orderedFavoritesNodeIds.push(favoriteNode.id);
        favoritesStore.favoriteCategories.set(favoriteNode.id, favoriteNode);
    }
}

/**
 * Deserialize the raw favorites data from userOptions.FavoriteNodes and load it to favorites store
 * @param favoritesStore the favorites store
 * @param userOptions the user options
 */
export let loadFavoriteNodesToStore = action('loadFavoriteNodesToStore')(
    function loadFavoriteNodesToStore(favoritesStore: FavoritesStore) {
        const userOptions = getUserConfiguration().UserOptions;
        if (!userOptions.FavoriteNodes) {
            // Nothing to load
            return;
        }

        // Populate favorites based on the UserOptions.FavoriteNodes
        userOptions.FavoriteNodes.forEach(rawNode => {
            const parsedNode = favoriteNodeParser.parse(rawNode);

            // The parsed result can be undefined when there is error or favorite folder was deleted from other client
            if (parsedNode) {
                switch (parsedNode.type) {
                    case FolderForestNodeType.Folder:
                        tryAddSingleFavoriteFolderToStore(parsedNode);
                        break;
                    case FolderForestNodeType.Search:
                        addSingleFavoriteSearchToStore(parsedNode as FavoriteSearchNode);
                        break;
                    case FolderForestNodeType.Persona:
                        if (shouldAddFavoritePersona(parsedNode.id)) {
                            favoritesStore.orderedFavoritesNodeIds.push(parsedNode.id);
                            favoritesStore.favoritesPersonaNodes.set(
                                parsedNode.id,
                                parsedNode as FavoritePersonaNode
                            );
                        }
                        break;
                    case FolderForestNodeType.Category:
                        tryAddSingleFavoriteCategoryToStore(parsedNode as FavoriteCategoryNode);
                        break;
                    default:
                        trace.warn('Non supported FolderForestNodeType: ' + parsedNode.id);
                        break;
                }
            }
        });

        const favoritePersonasWithPersonaId = [
            ...favoritesStore.favoritesPersonaNodes.values(),
        ].filter(favoritePersonaNode => favoritePersonaNode.personaId);

        logUsage('LoadFavorites', [
            favoritesStore.favoritesFolderNodes.size,
            favoritesStore.favoritesPersonaNodes.size,
            favoritesStore.favoriteSearches.size,
            favoritesStore.favoriteCategories.size,
            favoritePersonasWithPersonaId.length,
        ]);
    }
);

/**
 * Load the favorite folderIds list from the session data
 * @param state the state which contains the favorites store
 */
export default function loadFavorites(
    state: Pick<LoadFavoritesState, 'favoritesStore'> = { favoritesStore: favoritesStore }
) {
    if (favoritesStore.favoritesLoaded) {
        return;
    }
    if (folderStore.folderTable.size === 0) {
        getPrimaryMailFolders();
    }
    const firstRunCompleted = getIsBitEnabled(FavoritesBitFlagsMasks.FirstRunFavoritesMigration);
    if (firstRunCompleted) {
        // Load UserOptions.FavoritesNodes if there is any
        loadFavoriteNodesToStore(state.favoritesStore);
    } else {
        // Migrate JsMVVM favorites to React if user is not marked as first run completed
        lazyMigrateFavorites.importAndExecute();
    }
    setFavoritesLoaded();
}

/**
 * Load the favorite folderIds list from the session data
 * @param state the state which contains the favorites store
 */
export let addFavoriteToStoreV1 = action('addFavoriteToStoreV1')(function addFavoriteToStore(
    folderNode: FolderForestNode
) {
    if (!favoritesStore.favoritesFolderNodes.has(folderNode.id)) {
        favoritesStore.orderedFavoritesNodeIds.push(folderNode.id);
        favoritesStore.favoritesFolderNodes.set(folderNode.id, folderNode);
    }
});
