import type CategoryType from 'owa-service/lib/contract/CategoryType';

export interface CategorySuggestions {
    suggestions: CategoryType[];
    hasExactMatch: boolean;
}

/**
 * Get the category suggestions based on the find text that user types
 * @param findText the find text
 * @param categoryList a list of categories to search
 * @return an array of category suggestions
 */
export default function getCategorySuggestions(
    findText: string,
    categoryList: CategoryType[]
): CategorySuggestions {
    let categorySuggestions = [];
    let hasExactMatch = false;
    let findTextLowerCase = findText.trim().toLocaleLowerCase();

    // Use the CategoryMetaData list instead of master list for suggestions
    // VSO 23344 - MRU -  start storing the last used time in categoryMetadata and start using it
    // Add the category to suggestion list if
    // The category name is not empty
    // and the category name contains the find text
    for (let categoryEntry of categoryList) {
        const categoryNameLowerCase = categoryEntry.Name.trim().toLocaleLowerCase();
        if (categoryNameLowerCase != '' && categoryNameLowerCase.indexOf(findTextLowerCase) >= 0) {
            categorySuggestions.push(categoryEntry);

            if (categoryNameLowerCase == findTextLowerCase) {
                hasExactMatch = true;
            }
        }
    }

    const findTextToCompare = findText.toLocaleLowerCase().trim();
    categorySuggestions.sort((a: CategoryType, b: CategoryType) => {
        const aLower = a.Name.toLocaleLowerCase().trim();
        const bLower = b.Name.toLocaleLowerCase().trim();
        const aIndex = aLower.indexOf(findTextToCompare);
        const bIndex = bLower.indexOf(findTextToCompare);

        // If both names have the match string at same index, sort alphabetically
        if (aIndex == bIndex) {
            return aLower.localeCompare(bLower);
        }

        // Else return the one that has the match string at the lower index
        return aIndex - bIndex;
    });

    return {
        suggestions: categorySuggestions,
        hasExactMatch: hasExactMatch,
    };
}
