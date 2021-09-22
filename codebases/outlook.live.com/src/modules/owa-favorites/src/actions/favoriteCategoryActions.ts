import { action } from 'satcheljs';

/**
 * Called on a category favorited
 * @param categoryId the id to be added
 */
export let onCategoryFavorited = action('ON_CATEGORY_FAVORITED', (categoryId: string) => {
    return {
        categoryId,
    };
});

/**
 * Called on a category un favorited
 * @param categoryId the id to be added
 */
export let onCategoryUnfavorited = action('ON_CATEGORY_UNFAVORITED', (categoryId: string) => {
    return {
        categoryId,
    };
});
