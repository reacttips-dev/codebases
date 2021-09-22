import { observer } from 'mobx-react-lite';
import FavoriteCategoryNode from '../FavoriteCategoryNode';
import FavoriteFolderNode from '../FavoriteFolderNode';
import FavoriteGroupNode from '../FavoriteGroupNode';
import FavoritePersonaNode from '../FavoritePersonaNode';
import FavoritePrivateDistributionListNode from '../FavoritePrivateDistributionListNode';
import { getStore as getSharedFavoritesStore } from 'owa-favorites';
import folderStore from 'owa-folders';
import { getFavoriteNodeViewStateFromId } from 'owa-mail-favorites-store';
import * as React from 'react';
import type {
    FavoriteFolderData,
    FavoriteGroupData,
    FavoriteCategoryData,
    FavoritePersonaData,
    FavoritePrivateDistributionListData,
    FavoritePublicFolderData,
} from 'owa-favorites-types';

export interface FavoriteNodeCommonProps {
    favoriteId: string;
}

export interface FavoriteNodeV2Props {
    favoriteId: string;
}

export default observer(function FavoriteNodeV2(props: FavoriteNodeV2Props) {
    const createFolderFavorite = (favoriteFolderData: FavoriteFolderData): JSX.Element => {
        const folderId = favoriteFolderData.folderId;
        const folder = folderStore.folderTable.get(folderId);
        if (folder) {
            return (
                <FavoriteFolderNode
                    key={props.favoriteId}
                    favoriteId={props.favoriteId}
                    folderId={folderId}
                />
            );
        }
        return null;
    };
    const createGroupFavorite = (favoriteGroupData: FavoriteGroupData) => {
        return (
            <FavoriteGroupNode
                key={props.favoriteId}
                favoriteId={props.favoriteId}
                displayName={favoriteGroupData.displayName}
                groupId={favoriteGroupData.groupId}
            />
        );
    };
    const createCategoryFavorite = (favoriteCategoryData: FavoriteCategoryData) => {
        return (
            <FavoriteCategoryNode
                key={props.favoriteId}
                favoriteId={props.favoriteId}
                categoryId={favoriteCategoryData.categoryId}
                dropViewState={getFavoriteNodeViewStateFromId(props.favoriteId).drop}
            />
        );
    };
    const createPersonaFavorite = (favoritePersonaData: FavoritePersonaData) => {
        if (favoritePersonaData.mainEmailAddress) {
            return (
                <FavoritePersonaNode
                    key={props.favoriteId}
                    favoriteId={props.favoriteId}
                    displayName={favoritePersonaData.displayName}
                    emailAddress={favoritePersonaData.mainEmailAddress}
                    personaId={favoritePersonaData.personaId}
                    searchFolderId={favoritePersonaData.searchFolderId}
                    isSearchFolderPopulated={favoritePersonaData.isSearchFolderPopulated}
                    dropViewState={getFavoriteNodeViewStateFromId(props.favoriteId).drop}
                    isJustAdded={false}
                />
            );
        }
        return null;
    };
    const createPdlFavorite = (favoritePdlData: FavoritePrivateDistributionListData) => {
        return (
            <FavoritePrivateDistributionListNode
                key={props.favoriteId}
                favoriteId={props.favoriteId}
                displayName={favoritePdlData.displayName}
                searchFolderId={favoritePdlData.searchFolderId}
                isSearchFolderPopulated={favoritePdlData.isSearchFolderPopulated}
                dropViewState={getFavoriteNodeViewStateFromId(props.favoriteId).drop}
            />
        );
    };
    const createPublicFolderFavorite = (favoritePublicFolderData: FavoritePublicFolderData) => {
        return (
            <FavoriteFolderNode
                key={props.favoriteId}
                favoriteId={props.favoriteId}
                folderId={favoritePublicFolderData.publicFolderId}
                isPublicFolder={true}
            />
        );
    };
    const favoritesStore = getSharedFavoritesStore();
    if (favoritesStore.outlookFavorites.has(props.favoriteId)) {
        const favoriteData = favoritesStore.outlookFavorites.get(props.favoriteId);
        switch (favoriteData.type) {
            case 'folder':
                return createFolderFavorite(favoriteData as FavoriteFolderData);
            case 'group':
                return createGroupFavorite(favoriteData as FavoriteGroupData);
            case 'category':
                return createCategoryFavorite(favoriteData as FavoriteCategoryData);
            case 'persona':
                return createPersonaFavorite(favoriteData as FavoritePersonaData);
            case 'privatedistributionlist':
                return createPdlFavorite(favoriteData as FavoritePrivateDistributionListData);
            case 'publicFolder':
                return createPublicFolderFavorite(favoriteData as FavoritePublicFolderData);
            default:
                throw new Error('FavoriteNodeV2 - favorite kind not supported');
        }
    }
    // Invalid unknown data
    return null;
});
