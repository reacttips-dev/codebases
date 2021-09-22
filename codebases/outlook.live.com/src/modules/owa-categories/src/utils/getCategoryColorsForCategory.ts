import {
    DEFAULT_CATEGORY_COLOR_CODE,
    DEFAULT_NEW_CATEGORY_COLOR_CODE,
} from './categoriesConstants';
import type { CategoryColorValue } from '../store/schema/CategoryColor';
import categoryStore from '../store/store';
import type CategoryType from 'owa-service/lib/contract/CategoryType';
import getMasterCategoryList from '../utils/getMasterCategoryList';

/**
 * Gets category colors for a given category name
 * @param categoryName the name of the category
 * @param categoryList a list of categories to search
 * @returns the category color properties
 */
export default function getCategoryColorsForCategory(
    categoryName: string,
    categoryList: CategoryType[]
): CategoryColorValue {
    if (!categoryList) {
        categoryList = getMasterCategoryList();
    }

    for (let i = 0; i < categoryList.length; i++) {
        let category = categoryList[i];
        if (category.Name.toLowerCase() === categoryName.toLowerCase()) {
            return categoryStore.colorCodeColorValueMap[category.Color.toString()];
        }
    }

    return getDefaultCategoryColor();
}

/**
 * Gets the default category color
 * @returns a default category color value
 */
export function getDefaultCategoryColor(): CategoryColorValue {
    return categoryStore.colorCodeColorValueMap[DEFAULT_CATEGORY_COLOR_CODE];
}

/**
 * Gets the default new category color
 * @returns a default new category color value
 */
export function getDefaultNewCategoryColor(): CategoryColorValue {
    return categoryStore.colorCodeColorValueMap[DEFAULT_NEW_CATEGORY_COLOR_CODE];
}
