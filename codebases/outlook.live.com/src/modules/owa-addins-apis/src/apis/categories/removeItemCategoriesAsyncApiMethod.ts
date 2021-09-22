import {
    getAdapter,
    MessageReadAdapter,
    AppointmentReadAdapter,
    AppointmentComposeAdapter,
} from 'owa-addins-adapters';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { ApiErrorCode } from '../ApiErrorCode';
import isCategoryNameLimitExceeded from './isCategoryNameLimitExceeded';
import { assertNever } from '@fluentui/utilities';

export interface RemoveCategoriesArgs {
    categories: string[];
}

export default async function removeItemCategoriesAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: RemoveCategoriesArgs,
    callback: ApiMethodCallback
): Promise<void> {
    const adapter = getAdapter(hostItemIndex);
    const mode = adapter.mode;

    if (isCategoryNameLimitExceeded(data.categories)) {
        callback(createErrorResult(ApiErrorCode.InvalidCategoryError));
        return;
    }

    try {
        switch (mode) {
            case ExtensibilityModeEnum.MessageRead:
                {
                    await (adapter as MessageReadAdapter).removeCategoriesItemRead(data.categories);
                }
                break;

            case ExtensibilityModeEnum.MessageCompose: {
                callback(createErrorResult(ApiErrorCode.OperationNotSupported));
                return;
            }

            case ExtensibilityModeEnum.AppointmentAttendee:
                {
                    await (adapter as AppointmentReadAdapter).removeCategoriesItemRead(
                        data.categories
                    );
                }
                break;

            case ExtensibilityModeEnum.AppointmentOrganizer:
                {
                    await (adapter as AppointmentComposeAdapter).removeCategoriesItemCompose(
                        data.categories
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
