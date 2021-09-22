import type { ApiMethodCallback } from '../ApiMethod';
import { getAdapter, CommonAdapter } from 'owa-addins-adapters';
import { createSuccessResult, createErrorResult } from '../ApiMethodResponseCreator';
import ApiErrorCode from '../ApiErrorCode';

export interface RemoveCategoriesArgs {
    categories: string[];
}

export default async function removeMasterCategoriesAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: RemoveCategoriesArgs,
    callback: ApiMethodCallback
) {
    try {
        const adapter = getAdapter(hostItemIndex) as CommonAdapter;
        if (adapter.isSharedItem()) {
            callback(createErrorResult(ApiErrorCode.InsufficientItemPermissions));
            return;
        }

        for (let i = 0; i < data.categories.length; i++) {
            var categoryLength = data.categories[i].length;
            if (categoryLength === 0 || categoryLength > 255) {
                callback(createErrorResult(ApiErrorCode.InvalidCategoryError));
                return;
            }
        }

        let success: Boolean = await adapter.removeCategoriesMailbox(data.categories);
        if (success) {
            callback(createSuccessResult());
        } else {
            callback(createErrorResult(ApiErrorCode.GenericResponseError));
        }
    } catch (err) {
        callback(createErrorResult());
    }
}
