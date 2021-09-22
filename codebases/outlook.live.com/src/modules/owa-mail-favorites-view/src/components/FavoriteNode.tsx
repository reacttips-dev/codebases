import FavoriteCategoryNode from './FavoriteCategoryNode';
import FavoriteFolderNode from './FavoriteFolderNode';
import FavoritePersonaNode from './FavoritePersonaNode';
import FavoriteSearchNode from './FavoriteSearchNode';
import { observer } from 'mobx-react-lite';
import { favoritesStore } from 'owa-favorites';
import { FolderForestNodeType } from 'owa-favorites-types';
import folderStore from 'owa-folders';
import publicFolderFavoriteStore from 'owa-public-folder-favorite/lib/store/publicFolderFavoriteStore';
import * as React from 'react';

export interface FavoriteNodeCommonProps {
    favoriteId: string;
}

export interface FavoriteNodeProps {
    favoriteId: string;
}

const FavoriteNode = observer(function FavoriteNode(props: FavoriteNodeProps) {
    const id = props.favoriteId;
    if (favoritesStore.favoritesPersonaNodes.has(id)) {
        const personaNode = favoritesStore.favoritesPersonaNodes.get(id);

        if (personaNode.mainEmailAddress) {
            return (
                <FavoritePersonaNode
                    favoriteId={id}
                    displayName={personaNode.displayName}
                    emailAddress={personaNode.mainEmailAddress}
                    personaId={personaNode.personaId}
                    searchFolderId={personaNode.searchFolderId}
                    dropViewState={personaNode.dropViewState}
                    isJustAdded={personaNode.isJustAdded}
                    isSearchFolderPopulated={personaNode.isSearchFolderPopulated}
                />
            );
        }
    } else if (favoritesStore.favoritesFolderNodes.has(id)) {
        const folderNode = favoritesStore.favoritesFolderNodes.get(id);
        const isPublicFolder = folderNode && folderNode.type === FolderForestNodeType.PublicFolder;
        const folder = isPublicFolder
            ? publicFolderFavoriteStore.folderTable.get(id)
            : folderStore.folderTable.get(id);

        if (folder) {
            return (
                <FavoriteFolderNode favoriteId={id} folderId={id} isPublicFolder={isPublicFolder} />
            );
        }
    } else if (favoritesStore.favoriteSearches.has(id)) {
        const favoriteSearch = favoritesStore.favoriteSearches.get(id);
        return (
            <FavoriteSearchNode
                favoriteId={id}
                searchQuery={id}
                dropViewState={favoriteSearch.dropViewState}
            />
        );
    } else if (favoritesStore.favoriteCategories.has(id)) {
        const favoriteCategory = favoritesStore.favoriteCategories.get(id);
        return (
            <FavoriteCategoryNode
                favoriteId={id}
                categoryId={id}
                dropViewState={favoriteCategory.dropViewState}
            />
        );
    }

    return null;
});
export default FavoriteNode;
