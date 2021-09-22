import {
    getAdapter,
    MessageReadAdapter,
    AppointmentReadAdapter,
    AppointmentComposeAdapter,
} from 'owa-addins-adapters';
import { ApiErrorCode } from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { lazyGetMasterCategoriesList } from 'owa-categories';
import type CategoryType from 'owa-service/lib/contract/CategoryType';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import isCategoryNameLimitExceeded from './isCategoryNameLimitExceeded';
import { assertNever } from '@fluentui/utilities';

export interface AddCategoriesArgs {
    categories: string[];
}

export default async function addItemCategoriesAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: AddCategoriesArgs,
    callback: ApiMethodCallback
): Promise<void> {
    const adapter = getAdapter(hostItemIndex);
    const mode = adapter.mode;

    let getMasterCategoriesList = await lazyGetMasterCategoriesList.import();
    const masterCategoryList: CategoryType[] = getMasterCategoriesList();

    if (
        areInvalidCategories(data.categories, masterCategoryList) ||
        isCategoryNameLimitExceeded(data.categories)
    ) {
        callback(createErrorResult(ApiErrorCode.InvalidCategoryError));
        return;
    }
    const categoriesToBeAdded: string[] = removeDulpicateCategories(data.categories);

    try {
        switch (mode) {
            case ExtensibilityModeEnum.MessageRead:
                {
                    await (adapter as MessageReadAdapter).addCategoriesItemRead(
                        categoriesToBeAdded
                    );
                }
                break;

            case ExtensibilityModeEnum.MessageCompose: {
                callback(createErrorResult(ApiErrorCode.OperationNotSupported));
                return;
            }

            case ExtensibilityModeEnum.AppointmentAttendee:
                {
                    await (adapter as AppointmentReadAdapter).addCategoriesItemRead(
                        categoriesToBeAdded
                    );
                }
                break;

            case ExtensibilityModeEnum.AppointmentOrganizer:
                {
                    await (adapter as AppointmentComposeAdapter).addCategoriesItemCompose(
                        categoriesToBeAdded
                    );
                }
                break;

            default:
                assertNever(mode as never);
        }

        callback(createSuccessResult());
    } catch (err) {
        callback(createErrorResult(err.errorCode));
    }
}

// Returns true even if one category is not there in the Master Category List
export function areInvalidCategories(
    categories: string[],
    masterCategoryList: CategoryType[]
): boolean {
    for (let category of categories) {
        let matchingCategories = masterCategoryList.filter(
            masterCategory => masterCategory.Name === category
        );
        if (matchingCategories.length === 0) {
            return true;
        }
    }
    return false;
}

export function removeDulpicateCategories(categories: string[]): string[] {
    var uniqueCategories: string[] = [];
    categories.forEach(category => {
        let isDuplicate = false;
        // Checking for duplicates in input
        for (let uniqueCategory of uniqueCategories) {
            if (uniqueCategory === category) {
                //If duplicate is found
                isDuplicate = true;
            }
        }
        if (!isDuplicate) {
            uniqueCategories.push(category);
        }
    });
    return uniqueCategories;
}
