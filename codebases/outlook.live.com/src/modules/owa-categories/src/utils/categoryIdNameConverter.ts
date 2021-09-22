import type CategoryType from 'owa-service/lib/contract/CategoryType';

/**
 * Get the category id given the name
 * @param name the category name
 * @param categoryList the list of categories
 * @returns the category id if category was found in the master list
 */
export function getCategoryIdFromName(name: string, categoryList: CategoryType[]): string {
    // The category might be deleted but some scenarios may end up asking for it e.g. FrequentlyUsedFolders
    const filteredCategories = categoryList.filter(category => category.Name === name);
    if (filteredCategories.length > 0) {
        return filteredCategories[0].Id;
    }

    return null;
}

/**
 * Get the category name given the id
 * @param id the category id
 * @param categoryList the list of categories
 * @returns the category name if the category was found in the master list
 */
export function getCategoryNameFromId(id: string, categoryList: CategoryType[]): string {
    const filteredCategories = categoryList.filter(category => category.Id === id);
    if (filteredCategories.length > 0) {
        return filteredCategories[0].Name;
    }

    return null;
}
