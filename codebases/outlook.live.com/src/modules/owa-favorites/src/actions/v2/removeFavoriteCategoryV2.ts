import { action } from 'satcheljs';

/**
 * Remove a favorite category node to the favorite store
 * @param categoryId the id to remove
 * @param actionSource of where the remove action is triggered from
 */
export default action('REMOVE_FAVORITE_CATEGORY_V2', (categoryId: string) => {
    return {
        categoryId,
    };
});
