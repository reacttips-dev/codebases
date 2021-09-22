import { getStore } from '../../../index';

/**
 * Get the favorite id(guid) from group id(smtp address)
 * @param groupId the group id
 * @returns the favorite id
 */
export default function getFavoriteIdFromGroupId(groupId: string): string {
    return getStore().favoriteSecondaryKeyMap.get(groupId.toLowerCase());
}
