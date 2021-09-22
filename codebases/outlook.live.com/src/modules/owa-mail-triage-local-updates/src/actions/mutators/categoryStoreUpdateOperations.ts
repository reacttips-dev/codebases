/**
 * Add categories to existing collection by merging and deduping the categories
 * @param categoriesToAdd the categories to be added
 * @param existingCategories the existing categories to added to
 * @returns the merged de-duped categories collection
 */
export function addCategoriesToCollection(
    categoriesToAdd: string[],
    existingCategories: string[]
): string[] {
    // Skip if there is existing categories to be added
    if (!existingCategories || existingCategories.length == 0) {
        return categoriesToAdd;
    }

    const newCategories: string[] = [];

    existingCategories.forEach(existingCategoryName => {
        newCategories.push(existingCategoryName);
    });

    categoriesToAdd.forEach(categoryNameToAdd => {
        // Add new category only if it doesn't exist in existing categories
        if (existingCategories.indexOf(categoryNameToAdd) === -1) {
            newCategories.push(categoryNameToAdd);
        }
    });

    return newCategories;
}

/**
 * Remove categories to existing collection by merging and deduping the categories
 * @param categoriesToRemove the categories to be removed
 * @param existingCategories the existing categories to remove from
 * @returns the new category collection with specified categories removed
 */
export function removeCategoriesFromCollection(
    categoriesToRemove: string[],
    existingCategories: string[]
): string[] {
    // Skip if there is no existing category
    if (!existingCategories || existingCategories.length == 0) {
        return existingCategories;
    }

    // Remove the category from the collection if it exists
    categoriesToRemove.forEach(categoryToRemove => {
        const index = existingCategories.indexOf(categoryToRemove);
        if (index !== -1) {
            existingCategories.splice(index, 1);
        }
    });

    // If all categories are removed, we set the category field to undefined,
    // as this aligns with what FindItem/FindConversation returns when there is no category
    if (existingCategories.length === 0) {
        existingCategories = undefined;
    }

    return existingCategories;
}
