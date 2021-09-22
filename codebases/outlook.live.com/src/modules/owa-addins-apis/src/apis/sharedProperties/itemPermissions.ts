import type { CommonAdapter } from 'owa-addins-adapters';
import { ApiErrorCode } from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult } from '../ApiMethodResponseCreator';

export function returnErrorIfUserCannotEditItem(
    adapter: CommonAdapter,
    callback: ApiMethodCallback
) {
    if (!userCanEditItem(adapter)) {
        callback(createErrorResult(ApiErrorCode.InsufficientItemPermissions));
        return true;
    }

    return false;
}

export function userCanEditItem(adapter: CommonAdapter): boolean {
    if (!adapter.isSharedItem || !adapter.getSharedProperties) {
        return true;
    }

    if (!adapter.isSharedItem()) {
        return true;
    }

    const sharedProperties = adapter.getSharedProperties();

    // Return false if we know the user cannot edit the item
    return sharedProperties.delegatePermissions.EditOwn;
}
