import type { ApiMethodCallback } from '../ApiMethod';
import { CategoryColor } from './CategoryDetails';
import { createSuccessResult, createErrorResult } from '../ApiMethodResponseCreator';
import type CategoryType from 'owa-service/lib/contract/CategoryType';
import ApiErrorCode from '../ApiErrorCode';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { getAdapter, CommonAdapter } from 'owa-addins-adapters';
import { assertNever } from '@fluentui/utilities';
export interface CategoryDetails {
    displayName: string;
    color: string;
}

export default async function getMasterCategoryListAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: null,
    callback: ApiMethodCallback
) {
    const adapter = getAdapter(hostItemIndex);
    const mode = adapter.mode;
    let masterList: CategoryType[] = [];
    let categories: CategoryDetails[] = null;
    try {
        switch (mode) {
            case ExtensibilityModeEnum.MessageRead:
            case ExtensibilityModeEnum.MessageCompose:
                {
                    masterList = await (adapter as CommonAdapter).getCategoriesMailbox();
                }
                break;

            case ExtensibilityModeEnum.AppointmentAttendee:
            case ExtensibilityModeEnum.AppointmentOrganizer:
                {
                    masterList = await (adapter as CommonAdapter).getCategoriesMailbox();
                }
                break;

            default:
                assertNever(mode as never);
        }

        if (masterList == null || masterList == undefined) {
            callback(createErrorResult(ApiErrorCode.GenericResponseError));
            return;
        }

        categories = masterList.map(
            wrapper =>
                <CategoryDetails>{
                    displayName: wrapper.Name,
                    color: CategoryColor[wrapper.Color],
                }
        );

        callback(createSuccessResult(categories));
    } catch (err) {
        callback(createErrorResult(err.errorCode));
    }
}
