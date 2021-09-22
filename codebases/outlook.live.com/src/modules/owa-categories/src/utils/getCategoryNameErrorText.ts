import {
    duplicateCategoryErrorText,
    forbiddenCharactersCategoryErrorText,
    emptyCategoryErrorText,
    categoryNameTooLongErrorText,
    blockedCategoryNameErrorText,
} from './getCategoryNameErrorText.locstring.json';
import loc from 'owa-localize';
import getMasterCategoryList from './getMasterCategoryList';
import { getStore } from '../store/store';

const CATEGORY_NAME_MAX_CHARACTERS = 255;

export function getCategoryNameErrorText(name: string): string {
    // Valid category name means the name string is not white space, or null, or empty,
    // contains no commas or semicolons, and it is not duplicated with existing categories
    if (doesCategoryNameHaveCommaOrSemicolon(name)) {
        return loc(forbiddenCharactersCategoryErrorText);
    } else if (isCategoryNameEmptyOrWhitespace(name) && name !== '') {
        return loc(emptyCategoryErrorText);
    } else if (doesCategoryNameExceedCharacterLimit(name)) {
        return loc(categoryNameTooLongErrorText);
    } else if (
        isCategoryNameDuplicate(name) &&
        !(
            getStore().categoryDialogViewState?.operation === 'edit' &&
            name === getStore().categoryDialogViewState?.initialCategoryState.categoryName
        )
    ) {
        return loc(duplicateCategoryErrorText);
    } else if (getStore().blockedCategoryNames.includes(name)) {
        return loc(blockedCategoryNameErrorText);
    }
    return '';
}

export function isCategoryNameValid(name: string): boolean {
    return (
        !doesCategoryNameHaveCommaOrSemicolon(name) &&
        !isCategoryNameEmptyOrWhitespace(name) &&
        !isCategoryNameDuplicate(name) &&
        !doesCategoryNameExceedCharacterLimit(name)
    );
}

function isCategoryNameEmptyOrWhitespace(name: string): boolean {
    return !name || !name.trim();
}

function doesCategoryNameHaveCommaOrSemicolon(name: string): boolean {
    return name.indexOf(',') !== -1 || name.indexOf(';') !== -1;
}

function doesCategoryNameExceedCharacterLimit(name: string): boolean {
    return name.length > CATEGORY_NAME_MAX_CHARACTERS;
}

/**
 * Determines whether a category has duplicate name with existing categories
 * @param name of the category to be checked
 * @param categoryList the list of categories
 * @returns true if a category does not have duplicate name with existing categories, false otherwise
 */
export function isCategoryNameDuplicate(name: string): boolean {
    const trimmedName = name.trim();
    const categoriesWithDuplicateName = getMasterCategoryList().filter(
        categoryRow => categoryRow.Name.toLocaleLowerCase() === trimmedName.toLocaleLowerCase()
    );

    // Not a valid name if it is duplicate with other existing categories
    return categoriesWithDuplicateName.length > 0;
}
