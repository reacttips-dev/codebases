import { action } from 'satcheljs';

/**
 * Local updates for category rename and delete
 */
export default action(
    'updateCategoriesInView',
    (modifiedCategoryName: string, newCategoryName?: string) => ({
        modifiedCategoryName,
        newCategoryName,
    })
);
