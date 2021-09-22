import { action } from 'satcheljs';

/**
 * Add a favorite category node to the favorite store
 * @param categoryId the id to be added
 * @param actionSource of where the add action is triggered from
 */
export default action('ADD_FAVORITE_CATEGORY_V2', (categoryId: string) => {
    return {
        categoryId,
    };
});
