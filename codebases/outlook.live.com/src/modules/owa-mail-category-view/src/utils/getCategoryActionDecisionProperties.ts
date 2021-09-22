import { MailRowDataPropertyGetter, TableView } from 'owa-mail-list-store';

export function getAllCategoriesOnRows(tableView: TableView, rowKeys: string[]): string[] {
    const rowsAllCategories = [];

    // Get all categories for all rows in rowsAllCategories collection
    for (let i = 0; i < rowKeys.length; i++) {
        const rowCategories = MailRowDataPropertyGetter.getCategories(rowKeys[i], tableView) || [];
        rowsAllCategories.push(...rowCategories);
    }

    return rowsAllCategories;
}

/**
 * A function which returns properties that decide whether to show certain category actions
 * includes a collection of common categories for the given rows, and whether any of the row has categories
 * @param tableView to which the rows belong
 * @param rowKeys of the rows for which to get the intersection of categories
 * @returns list of categories that are on all the rows
 */
export function getCommonCategoriesOnRows(tableView: TableView, rowKeys: string[]): string[] {
    const commonCategoriesToReturn = [];
    const rowCategoryMap = {};

    // Get all categories for all rows in rowsAllCategories collection
    const rowsAllCategories = getAllCategoriesOnRows(tableView, rowKeys);

    // Build a category name <=> count map for the categories in rowsAllCategories collection
    for (let i = 0; i < rowsAllCategories.length; i++) {
        const categoryName = rowsAllCategories[i];
        if (!rowCategoryMap[categoryName]) {
            rowCategoryMap[categoryName] = 1;
        } else {
            rowCategoryMap[categoryName] = rowCategoryMap[categoryName] + 1;
        }
    }

    // Iterate map to get the categories for which the count is same as the rowKeys count,
    // which means the category appeared in all rows
    Object.keys(rowCategoryMap).forEach(key => {
        const categoryCount = rowCategoryMap[key];
        if (categoryCount == rowKeys.length) {
            commonCategoriesToReturn.push(key);
        }
    });

    return commonCategoriesToReturn;
}
