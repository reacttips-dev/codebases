import getMasterCategoryList from './getMasterCategoryList';

/**
 * Return whether the category is in master list
 * @param id of the category
 * @returns a boolean which indicates whether a category exists in master list
 */
export default function isCategoryInMasterList(id: string): boolean {
    return getMasterCategoryList().filter(category => category.Id === id).length === 1;
}
