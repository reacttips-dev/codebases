import { getStore } from '../../index';

/**
 * Get the favorite id(guid) from folder id
 * @param folderId the folder id
 * @returns the favorite id
 */
export default function getFavoriteIdFromFolderId(folderId: string): string {
    return getStore().favoriteSecondaryKeyMap.get(folderId);
}
