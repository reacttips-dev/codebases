import {
    FavoriteCategoryNode,
    FavoritePersonaNode,
    FavoriteSearchNode,
    FolderForestNode,
    FolderForestNodeType,
} from 'owa-favorites-types';
import type { ObservableMap } from 'mobx';
import createDropViewState from 'owa-dnd/lib/utils/createDropViewState';
import { trace } from 'owa-trace';

interface PersistedFavoriteNode {
    id: string;
    type: number;
    displayName?: string;
    personaSearchFolderId?: string;
    personaEmail?: string;
    personaAllEmails?: string[];
    personaId?: string;
}

/**
 * Parse a single raw node to folder forest node
 * @param rawNode the raw favorite node data as string
 * @return folder forest node
 */
export function parse(rawNode: string): FolderForestNode {
    let parsedNode;

    try {
        parsedNode = JSON.parse(rawNode) as PersistedFavoriteNode;
    } catch (error) {
        trace.warn('Cannot parse folderForestNode: ' + rawNode);
        return undefined;
    }

    // Make sure the node has valid id
    if (parsedNode.id === undefined) {
        return undefined;
    }

    switch (parsedNode.type) {
        case FolderForestNodeType.PublicFolder:
        case FolderForestNodeType.Folder:
            return <FolderForestNode>{
                id: parsedNode.id,
                type: parsedNode.type,
                treeType: 'favorites',
            };

        case FolderForestNodeType.Search:
            return <FavoriteSearchNode>{
                id: parsedNode.id,
                type: parsedNode.type,
                treeType: 'favorites',
                dropViewState: createDropViewState(),
            };

        case FolderForestNodeType.Category:
            return <FavoriteCategoryNode>{
                id: parsedNode.id,
                type: parsedNode.type,
                treeType: 'favorites',
                dropViewState: createDropViewState(),
            };

        case FolderForestNodeType.Persona:
            const personaNode: FavoritePersonaNode = {
                id: parsedNode.id,
                type: parsedNode.type,
                treeType: 'favorites',
                displayName: parsedNode.displayName,
                mainEmailAddress: parsedNode.personaEmail,
                allEmailAddresses: parsedNode.personaAllEmails || [],
                searchFolderId: parsedNode.personaSearchFolderId,
                isJustAdded: false,
                isSearchFolderPopulated: true,
                isSyncUpdateDone: false,
                dropViewState: createDropViewState(),
            };

            if (parsedNode.personaId) {
                personaNode.personaId = parsedNode.personaId;
            }

            return personaNode;

        default:
            // Safeguard to make sure we don't parse invalid favorite in case other client update userConfiguration which corrupted our data
            trace.warn('Non supported FolderForestNodeType: ' + parsedNode.type);
            return undefined;
    }
}

/**
 * Stringify single node
 * @param node the folder forest node
 * @return string of raw data
 */
export function stringify(node: FolderForestNode): string {
    const persistedNode: PersistedFavoriteNode = {
        id: node.id,
        type: node.type,
    };

    if (node.type === FolderForestNodeType.Persona) {
        const personaNode = <FavoritePersonaNode>node;

        persistedNode.displayName = personaNode.displayName;
        persistedNode.personaSearchFolderId = personaNode.searchFolderId;
        persistedNode.personaEmail = personaNode.mainEmailAddress;
        persistedNode.personaAllEmails = personaNode.allEmailAddresses;
        persistedNode.personaId = personaNode.personaId;
    }

    return JSON.stringify(persistedNode);
}

/**
 * Serialize the favorite nodes
 * @param orderedFavoritesNodeIds the ordered favorites node ids
 * @param favoritesFolderNodes a map contains favorite folders nodes
 * @param favoritesPersonaNodes a map contains favorite persona nodes
 * @param favoritesSearches a map contains favorite search nodes
 * @return an array of serialized node data as string
 */
export function serialize(
    orderedFavoritesNodeIds: string[],
    favoritesFolderNodes: ObservableMap<string, FolderForestNode>,
    favoritesPersonaNodes: ObservableMap<string, FavoritePersonaNode>,
    favoritesSearches: ObservableMap<string, FavoriteSearchNode>,
    favoritesCategories: ObservableMap<string, FavoriteCategoryNode>
): string[] {
    const favoriteNodesRaw = orderedFavoritesNodeIds.map(nodeId => {
        let node: FolderForestNode;
        if (favoritesFolderNodes.has(nodeId)) {
            node = favoritesFolderNodes.get(nodeId);
        } else if (favoritesPersonaNodes.has(nodeId)) {
            node = favoritesPersonaNodes.get(nodeId);
        } else if (favoritesSearches.has(nodeId)) {
            node = favoritesSearches.get(nodeId);
        } else if (favoritesCategories.has(nodeId)) {
            node = favoritesCategories.get(nodeId);
        } else {
            // No-op, invalid case which indicates there is unsync between orderedFavoritesList and the favoritesFolderNodes/favoritesPersonaNodes
            trace.warn('Favorites not found. favoriteType: ' + node.type);
        }

        return stringify(node);
    });

    return favoriteNodesRaw;
}
