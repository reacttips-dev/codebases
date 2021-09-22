import type CategoryType from 'owa-service/lib/contract/CategoryType';

const MAX_CATEGORIES_WHEN_NOT_ALL_SHOWN = 8;

export const getCategoriesToShow = (
    categoryList: CategoryType[],
    categoriesToCheck: string[],
    shouldShowClearCategories: boolean,
    isAllMode: boolean
): string[] => {
    const allCategories = categoryList;
    const doCategoriesHaveTimestamp = allCategories.every(
        (category: CategoryType) => category?.LastTimeUsed
    );
    let sortedCategories: CategoryType[];

    // Sort categories by alphabetical order in all mode
    if (isAllMode) {
        sortedCategories = allCategories.sort((a, b) => {
            return a.Name.localeCompare(b.Name);
        });
    } else if (doCategoriesHaveTimestamp) {
        // Otherwise sort categories by most recently used
        sortedCategories = allCategories.sort((a, b) => {
            return b.LastTimeUsed.localeCompare(a.LastTimeUsed);
        });
    } else {
        // If there is no timestamp, fallback to sorting by creation date
        sortedCategories = allCategories.reverse();
    }

    // Get the category names
    let categoriesToShow = sortedCategories.map(category => category.Name);

    if (!isAllMode) {
        // Put checked (applied) categories at the top of the list
        categoriesToCheck.forEach(category => {
            let index = categoriesToShow.indexOf(category);
            if (index != -1) {
                categoriesToShow.splice(index, 1);
            }
            categoriesToShow.unshift(category);
        });

        // Show 1 less category if displaying clear categories as an option
        const maxCategoriesToShow = shouldShowClearCategories
            ? MAX_CATEGORIES_WHEN_NOT_ALL_SHOWN - 1
            : MAX_CATEGORIES_WHEN_NOT_ALL_SHOWN;
        // Keep only the n most recently used categories
        categoriesToShow.splice(maxCategoriesToShow);

        // Sort remaining categories alphabetically, ignoring checked categories
        const sortedRemainingCategories = categoriesToShow
            .slice(categoriesToCheck.length)
            .sort((a, b) => {
                return a.localeCompare(b);
            });
        categoriesToShow = categoriesToShow
            .slice(0, categoriesToCheck.length)
            .concat(sortedRemainingCategories);
    }
    return categoriesToShow;
};
