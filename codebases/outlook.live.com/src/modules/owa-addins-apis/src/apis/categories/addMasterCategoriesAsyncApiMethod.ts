import { CategoryColor } from './CategoryDetails';
import { getAdapter, CommonAdapter } from 'owa-addins-adapters';
import ApiErrorCode from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { getMasterCategoryList } from 'owa-categories';
import { getGuid } from 'owa-guid';
import type CategoryType from 'owa-service/lib/contract/CategoryType';

export interface AddCategoriesArgs {
    categoryDetails: CategoryInputType[];
}

export interface CategoryInputType {
    displayName: string;
    color: string;
}
export default async function addMasterCategoriesAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: AddCategoriesArgs,
    callback: ApiMethodCallback
) {
    try {
        const adapter = getAdapter(hostItemIndex) as CommonAdapter;
        if (adapter.isSharedItem()) {
            callback(createErrorResult(ApiErrorCode.InsufficientItemPermissions));
            return;
        }

        var categories,
            uniqueCategories: CategoryType[] = [];
        categories = data.categoryDetails.map(
            wrapper =>
                <CategoryType>{
                    Name: wrapper.displayName,
                    Id: getGuid(),
                    Color: CategoryColor[wrapper.color],
                }
        );

        uniqueCategories = getValidUniqueCategories(categories, callback);
        if (!uniqueCategories) {
            callback(createErrorResult(ApiErrorCode.InvalidCategoryError));
            return;
        }

        if (CategoryIsPresentInMasterList(uniqueCategories)) {
            callback(createErrorResult(ApiErrorCode.DuplicateCategoryError));
            return;
        }

        let success: Boolean = await adapter.addCategoriesMailbox(uniqueCategories);
        if (success) {
            callback(createSuccessResult());
        } else {
            callback(createErrorResult(ApiErrorCode.GenericResponseError));
        }
    } catch (err) {
        callback(createErrorResult(err.errorCode));
    }
}

function getValidUniqueCategories(
    categories: CategoryType[],
    callback: ApiMethodCallback
): CategoryType[] {
    var uniqueCategories: CategoryType[] = [];
    categories.forEach(category => {
        var categoryLength = category.Name.length;
        if (categoryLength === 0 || categoryLength > 255) {
            return null;
        }
        let isDuplicate = false;
        // Checking for duplicates in input
        for (let i = 0; i < uniqueCategories.length; i++) {
            if (uniqueCategories[i].Name == category.Name) {
                //If duplicate is found, replace with the most recent category color
                uniqueCategories[i].Color = category.Color;
                isDuplicate = true;
            }
        }
        if (!isDuplicate) {
            uniqueCategories.push(category);
        }
    });
    return uniqueCategories;
}

function CategoryIsPresentInMasterList(uniqueCategories: CategoryType[]): Boolean {
    let masterList = getMasterCategoryList();
    for (let i = 0; i < uniqueCategories.length; i++) {
        let matchingCategories = masterList.filter(
            existingCategory => existingCategory.Name === uniqueCategories[i].Name
        );
        if (matchingCategories.length > 0) {
            return true;
        }
    }
    return false;
}
