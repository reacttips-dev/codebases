import {
    getAdapter,
    MessageReadAdapter,
    AppointmentReadAdapter,
    AppointmentComposeAdapter,
} from 'owa-addins-adapters';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import type CategoryType from 'owa-service/lib/contract/CategoryType';
import { CategoryColor } from './CategoryDetails';
import ApiErrorCode from '../ApiErrorCode';
import { assertNever } from '@fluentui/utilities';

export interface CategoryDetails {
    displayName: string;
    color: string;
}

export default async function getItemCategoriesAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: null,
    callback: ApiMethodCallback
): Promise<void> {
    const adapter = getAdapter(hostItemIndex);
    const mode = adapter.mode;
    let content: CategoryType[] = null;
    let categoryDetails: CategoryDetails[] = null;

    try {
        switch (mode) {
            case ExtensibilityModeEnum.MessageRead:
                {
                    content = await (adapter as MessageReadAdapter).getCategoriesItem();
                }
                break;

            case ExtensibilityModeEnum.MessageCompose: {
                callback(createErrorResult(ApiErrorCode.OperationNotSupported));
                return;
            }

            case ExtensibilityModeEnum.AppointmentAttendee:
                {
                    content = await (adapter as AppointmentReadAdapter).getCategoriesItem();
                }
                break;

            case ExtensibilityModeEnum.AppointmentOrganizer:
                {
                    content = await (adapter as AppointmentComposeAdapter).getCategoriesItem();
                }
                break;

            default:
                assertNever(mode as never);
        }

        if (content == null) {
            callback(createErrorResult(ApiErrorCode.GenericResponseError));
            return;
        }

        categoryDetails = createCategoryDetailsList(content);
        callback(createSuccessResult(categoryDetails));
    } catch (err) {
        callback(createErrorResult(err.errorCode));
    }
}

// This function coverts the CategoryType object received from mail/calendar to CategoryDetails object.
function createCategoryDetailsList(categories: CategoryType[]): CategoryDetails[] {
    let categoryDetails: CategoryDetails[] = [];
    for (let category of categories) {
        let singleCategoryDetails: CategoryDetails = {
            displayName: category.Name,
            color: CategoryColor[category.Color],
        };
        categoryDetails.push(singleCategoryDetails);
    }
    return categoryDetails;
}
