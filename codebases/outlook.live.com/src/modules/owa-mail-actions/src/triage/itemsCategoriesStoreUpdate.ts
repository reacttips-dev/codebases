import { action } from 'satcheljs';

/**
 * Action to propagate the categorize items action to client stores
 * @param itemIds - the item ids for updating categories
 * @param categoriesToAdd - categories to be added to the item
 * @param cateogiresToRemove - categories to be removed from the item
 * @param clearCategories - a boolean which indicates whether to clear categories
 * @returns action message which contains the parameters that required to update item categogires
 */
export default action(
    'ITEMS_CATEGORIES_STORE_UPDATE',
    (
        itemIds: string[],
        categoriesToAdd: string[],
        categoriesToRemove: string[],
        clearCategories: boolean
    ) => {
        return {
            itemIds,
            categoriesToAdd,
            categoriesToRemove,
            clearCategories,
        };
    }
);
