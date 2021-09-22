import { getStore } from '../../index';

/**
 * Get the favorite id(guid) from category id
 * @param categoryId the category id
 * @returns the favorite id
 */
export default function getFavoriteIdFromCategoryId(categoryId: string): string {
    return getStore().favoriteSecondaryKeyMap.get(categoryId);
}
